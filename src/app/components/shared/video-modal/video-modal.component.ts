import { Component, ElementRef, HostListener, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video-service';
import { CommonService } from '../../../services/Common-service';
import { ContinueWatchingRequest } from '../../../model/ContinueWatchingRequest';
import { VideoPlayerService } from '../../../services/VideoPlayerService '; 

@Component({
  selector: 'app-video-modal',
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css',
})
export class VideoModalComponent {
  videoPlayerService = inject(VideoPlayerService);

  @ViewChild('player')
  playerRef!: ElementRef<HTMLVideoElement>;

  constructor(
    private videoService: VideoService,
    private commonService: CommonService,
  ) {
    // reemplaza al ngOnChanges: reacciona cada vez que cambia la URL en el servicio
    effect(() => {
      const url = this.videoPlayerService.selectedURL();
      this.loadAndPlay(url);
    });
  }

  get video() {
    return this.videoPlayerService.selectedVideo();
  }

  close() {
    this.saveContinueWatching();
    if (this.playerRef) {
      this.playerRef.nativeElement.pause();
    }
    this.videoPlayerService.close();
  }

  like() {
    if (this.video) {
      this.videoService.like(this.video);
    }
  }

  onTimeUpdate() {
    this.saveContinueWatching();
  }

  saveContinueWatching() {
    if (!this.video || !this.playerRef) return;
    const videoElement = this.playerRef.nativeElement;
    if (!videoElement.duration) return;
    const request: ContinueWatchingRequest = {
      videoId: Number(this.video.path),
      currentSecond: Math.floor(videoElement.currentTime),
      duration: Math.floor(videoElement.duration),
    };
    this.commonService.saveContinueWatching(request).subscribe();
  }

  restorePosition(): void {
    if (!this.playerRef || !this.video) return;
    if (this.video.currentSecond != null) {
      this.playerRef.nativeElement.currentTime = this.video.currentSecond;
    }
  }

  private loadAndPlay(url: string | null): void {
    if (!this.playerRef) {
      setTimeout(() => this.loadAndPlay(url), 0);
      return;
    }
    
    const videoElement = this.playerRef.nativeElement;
    if (!url) {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
      return;
    }
    videoElement.src = url;
    videoElement.load();
    requestAnimationFrame(() => {
      videoElement.play().catch((err) => {
        console.warn('No se pudo reproducir el video:', err);
      });
    });
  }

  @HostListener('window:keydown.escape')
  closeByEscape() {
    this.close();
  }
}