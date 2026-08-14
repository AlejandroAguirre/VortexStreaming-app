import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewableComponent } from '../shared/preview/PreviewableComponent';
import { FileEntity } from '../../model/FileEntity';
import { CommonService } from '../../services/Common-service';
import { VideoService } from '../../services/video-service';
import { VideoModalComponent } from '../shared/video-modal/video-modal.component';

@Component({
  selector: 'app-artists-gallery',
  standalone: true,
  imports: [CommonModule, VideoModalComponent],
  templateUrl: './artists-gallery.component.html',
  styleUrls: ['./artists-gallery.component.css'],
})
export class ArtistsGalleryComponent extends PreviewableComponent {
  @Input()
  videos: FileEntity[] = [];
  @Input()
  currentPath = '';
  @Output()
  videoSelected = new EventEmitter<FileEntity>();
  @Output()
  folderSelected = new EventEmitter<FileEntity>();
  @Output()
  goBackClick = new EventEmitter<void>();
  @Input() searchMode = false;

  @ViewChild('carousel')
  carousel!: ElementRef;

  isDown = false;
  startX = 0;
  scrollLeft = 0;

  selectedURL: string | null = null;
  selectedVideo: FileEntity | null = null;

  constructor(
    public commonService: CommonService,
    public logService: VideoService,
  ) {
    super();
  }

  protected getThumbnail(video: FileEntity): string {
    if (video.type === 'file') {
      return this.commonService.getThumbnail(video.path);
    }
    if (video.thumbnails?.length) {
      return this.commonService.getAbsoluteUrl(video.thumbnails[0]);
    }
    return 'assets/folder-icon.png';
  }

clickVideo(video: FileEntity): void {
  if (video.type === 'folder') {
    this.logService.getVideos(video.path).subscribe((children) => {
      if (children.length === 1 && children[0].type === 'file') {
        // La carpeta solo tiene un video: reproducir directo, sin entrar
        const singleVideo = children[0];
        this.selectedVideo = singleVideo;
        this.selectedURL = this.logService.getVideo(singleVideo.path);
      } else {
        this.folderSelected.emit(video);
      }
    });
    return;
  }
  this.selectedVideo = video;
  this.selectedURL = this.logService.getVideo(video.path);
}

  startPreview(video: FileEntity): void {
    if (video.type !== 'file') {
      return;
    }
    this.hoveringVideo = video;
    this.previewIndex = 0;
    this.commonService.getPreviews(video.path).subscribe((frames) => {
      this.previewFrames = frames.map((f) =>
        this.commonService.getAbsoluteUrl(f),
      );
      clearInterval(this.previewInterval);
      this.previewInterval = setInterval(() => {
        this.previewIndex = (this.previewIndex + 1) % this.previewFrames.length;
      }, 300);
    });
  }

  like(video: FileEntity): void {
    this.logService.like(video);
  }

  get showingVideos(): boolean {
    return this.videos.length > 0 && this.videos[0].type === 'file';
  }


  moveLeft() {
  this.carousel.nativeElement.scrollBy({
    left: -300,
    behavior: 'smooth',
  });
}

moveRight() {
  this.carousel.nativeElement.scrollBy({
    left: 300,
    behavior: 'smooth',
  });
}

mouseDown(event: MouseEvent) {
  this.isDown = true;
  const carousel = this.carousel.nativeElement;
  this.startX = event.pageX - carousel.offsetLeft;
  this.scrollLeft = carousel.scrollLeft;
}

mouseLeave() {
  this.isDown = false;
}

mouseUp() {
  this.isDown = false;
}

mouseMove(event: MouseEvent) {
  if (!this.isDown) return;

  const carousel = this.carousel.nativeElement;
  const x = event.pageX - carousel.offsetLeft;
  const walk = (x - this.startX) * 2;

  carousel.scrollLeft = this.scrollLeft - walk;
}

}
