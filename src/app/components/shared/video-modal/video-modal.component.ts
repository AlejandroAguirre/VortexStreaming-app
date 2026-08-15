import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { VideoService } from '../../../services/video-service';
import { ContinueWatchingRequest } from '../../../model/ContinueWatchingRequest';
import { CommonService } from '../../../services/Common-service';

@Component({
  selector: 'app-video-modal',
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css',
})
export class VideoModalComponent implements OnChanges {
  @Input()
  videoUrl: string | null = null;
  @Output()
  videoUrlChange = new EventEmitter<string | null>();
  @Input()
  video: any = null;
  @ViewChild('player')
  player!: ElementRef<HTMLVideoElement>;

  constructor(
    private videoService: VideoService,
    private commonService: CommonService,
  ) {}

  close() {
    this.saveContinueWatching();
    if (this.player) {
      const videoElement = this.player.nativeElement;
      videoElement.pause();
    }
    this.videoUrlChange.emit(null);
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
    if (!this.video || !this.player) {
      return;
    }
    const videoElement = this.player.nativeElement;
    if (!videoElement.duration) {
      return;
    }
    const request: ContinueWatchingRequest = {
      videoId: Number(this.video.path),
      currentSecond: Math.floor(videoElement.currentTime),
      duration: Math.floor(videoElement.duration),
    };
    this.commonService.saveContinueWatching(request).subscribe();
  }

  restorePosition(): void {
    if (!this.player || !this.video) {
      return;
    }
    if (this.video.currentSecond != null) {
      this.player.nativeElement.currentTime = this.video.currentSecond;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl']) {
      this.loadAndPlay();
    }
  }

  private loadAndPlay(): void {
    if (!this.player) {
      // el ViewChild aún no existe en el primer ciclo; reintenta en el próximo microtask
      setTimeout(() => this.loadAndPlay(), 0);
      return;
    }

    const videoElement = this.player.nativeElement;

    if (!this.videoUrl) {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
      return;
    }

    videoElement.src = this.videoUrl;
    videoElement.load();

    // Da un frame de layout antes de intentar reproducir,
    // para evitar el bug de compositing de iOS Safari
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