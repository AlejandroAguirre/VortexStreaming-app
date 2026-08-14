import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileEntity } from '../../model/FileEntity';
import { CommonService } from '../../services/Common-service';
import { VideoService } from '../../services/video-service';
import { VideoModalComponent } from '../shared/video-modal/video-modal.component';

@Component({
  selector: 'app-continue-watching-card',
  standalone: true,
  imports: [CommonModule, VideoModalComponent],
  templateUrl: './continue-watching-card.component.html',
  styleUrls: ['./continue-watching-card.component.css'],
})
export class ContinueWatchingCardComponent {
  @Input({ required: true })
  item!: FileEntity;

  @Output()
  playItem = new EventEmitter<FileEntity>();

  selectedURL: string | null = null;

  selectedVideo: FileEntity | null = null;

  constructor(
    public commonService: CommonService,
    private videoService: VideoService,
  ) {}
  play() {
    this.selectedVideo = this.item;
    this.selectedURL = this.videoService.getVideo(this.item.path);
  }

  get image(): string {
    if (this.item.continueImage) {
      return this.commonService.getAbsoluteUrl(this.item.continueImage);
    }

    if (this.item.thumbnails?.length) {
      return this.commonService.getAbsoluteUrl(this.item.thumbnails[0]);
    }
    return this.commonService.getThumbnail(this.item.path);
  }

  get progress(): number {
    return this.item.progress ?? 0;
  }

  get remainingTime(): string {
    if (!this.item.duration || !this.item.currentSecond) {
      return '';
    }

    const remaining = this.item.duration - this.item.currentSecond;
    const minutes = Math.floor(remaining / 60);

    if (minutes < 1) {
      return 'Menos de 1 min restante';
    }
    return `${minutes} min restantes`;
  }
}
