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
    console.log(changes);
  }
  @HostListener('window:keydown.escape')
  closeByEscape() {
    this.close();
  }
}
