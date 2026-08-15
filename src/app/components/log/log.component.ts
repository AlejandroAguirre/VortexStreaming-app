import { OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Component } from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FileEntity } from "../../model/FileEntity";
import { RecentCarouselComponent } from "../recent-carousel/recent-carousel.component";
import { VideoService } from "../../services/video-service";
import { CommonService } from "../../services/Common-service";
import { PreviewableComponent } from "../shared/preview/PreviewableComponent";
import { FavoritesCarouselComponent } from "../favorites-carousel/favorites-carousel.component";
import { ArtistsGalleryComponent } from "../artists-gallery/artists-gallery.component";
import { ContinueWatchingCardComponent } from "../continue-watching-card/continue-watching-card.component";

@Component({
  selector: "app-log",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RecentCarouselComponent,
    FavoritesCarouselComponent,
    ArtistsGalleryComponent,
    ContinueWatchingCardComponent,
  ],
  templateUrl: "./log.component.html",
})
export class LogComponent
  extends PreviewableComponent
  implements OnInit, OnDestroy
{
  private notificationAudio = new Audio('assets/sounds/notification.m4a');
  audioUnlocked = false;
  showSoundBanner = true;

  videos: FileEntity[] = [];
  filteredVideos: FileEntity[] = [];
  recentVideos: FileEntity[] = [];
  favoriteVideos: FileEntity[] = [];
  currentPath = "";
  searchTerm = "";
  private navigationSubscription?: Subscription;
  continueWatching: FileEntity[] = [];
  totalPages = 0;
  currentPage = 0;
  selectedURL: string | null = null;
  selectedVideo: FileEntity | null = null;
  isSearching = false;

  constructor(
    public logService: VideoService,
    public commonService: CommonService,
  ) {
    super();
  }

  enableSound(): void {
    this.notificationAudio.play()
      .then(() => {
        this.notificationAudio.pause();
        this.notificationAudio.currentTime = 0;
        this.audioUnlocked = true;
        this.showSoundBanner = false;
      })
      .catch((err) => {
        console.warn('No se pudo activar el audio:', err);
      });
  }

  protected getThumbnail(video: FileEntity): string {
    if (video.thumbnails?.length) {
      return this.commonService.getAbsoluteUrl(video.thumbnails[0]);
    }
    return this.commonService.getThumbnail(video.path);
  }

  ngOnInit(): void {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    }
    this.loadInitialData();
    this.listenThumbnailEvents();
  }

  private loadInitialData(): void {
    this.loadVideos();
    this.loadRecentVideos();
    this.loadFavorites();
    this.loadContinueWatching();
  }

  public loadVideos(path: string = ""): void {
    this.currentPath = path;
    this.logService.getVideos(path).subscribe((data) => {
      this.videos = data;
      this.filteredVideos = data;
    });
  }

  loadRecentVideos(): void {
    this.logService.getRecentVideos(0, 11).subscribe((res) => {
      this.recentVideos = res.content;
      this.totalPages = res.totalPages;
    });
  }

  loadFavorites(): void {
    this.logService.getFavorites(0, 10).subscribe((res) => {
      this.favoriteVideos = res.content;
    });
  }

  openFolder(folder: FileEntity): void {
    this.loadVideos(folder.path);
  }

  goBack(): void {
    const parts = this.currentPath.split("/");
    parts.pop();
    this.loadVideos(parts.join("/"));
  }

  filterVideos(): void {
    const term = this.searchTerm.trim();
    this.isSearching = term.length > 0;
    if (!term) {
      this.filteredVideos = [...this.videos];
      return;
    }
    this.logService.searchVideos(term, 0, 20).subscribe((res) => {
      this.filteredVideos = res.content;
    });
  }

  toggleDarkMode(): void {
    document.body.classList.toggle("dark");
  }

  loadContinueWatching(): void {
    this.commonService.getContinueWatching(0, 1).subscribe((res) => {
      this.continueWatching = res.content;
      this.totalPages = res.totalPages;
    });
  }

  playContinue(video: FileEntity): void {
    console.log("VIDEO RECIBIDO:", video);
    this.selectedVideo = video;
    this.selectedURL = this.logService.getVideo(video.path);
    console.log("URL GENERADA:", this.selectedURL);
  }

  private listenThumbnailEvents(): void {
    this.logService.listenThumbnailGeneration().subscribe({
      next: (total) => {
        console.log(`Se generaron ${total} thumbnails`);
        this.notificationAudio.currentTime = 0;
        this.notificationAudio.play().catch((error) => {
          console.warn('No se pudo reproducir el sonido:', error);
        });
        this.loadRecentVideos();
      },
      error: (error) => {
        console.error('Error escuchando eventos de thumbnails', error);
      },
    });
  }

  get isMobileDevice(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }
}