import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { VideoService } from '../../services/video-service';
import { CommonService } from '../../services/Common-service';
import { VideoModalComponent } from '../shared/video-modal/video-modal.component';
import { PreviewableComponent } from '../shared/preview/PreviewableComponent';
import { FileEntity } from '../../model/FileEntity';

@Component({
  selector: 'app-favorites-carousel',
  templateUrl: './favorites-carousel.component.html',
  styleUrls: ['./favorites-carousel.component.css'],
  imports: [CommonModule, VideoModalComponent],
})
export class FavoritesCarouselComponent  extends PreviewableComponent{

protected getThumbnail(video: FileEntity): string {
  return this.commonService.getAbsoluteUrl(video.thumbnails[0]);
}
  @Input()
  videos: any[] = [];
  selectedURL: string | null = null;
  isDown = false;
  startX = 0;
  scrollLeft = 0;
  isDragging = false;
  selectedVideo: any = null;

  @ViewChild('carousel')
  carousel!: ElementRef;
  constructor(public logService: VideoService,public commonService:CommonService) {super();}
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

  startPreview(video: any) {
    this.hoveringVideo = video;
    this.previewIndex = 0;

    this.previewFrames = video.thumbnails.map((t: string) =>
      this.commonService.getAbsoluteUrl(t),
    );
    clearInterval(this.previewInterval);
    this.previewInterval = setInterval(() => {
      this.previewIndex = (this.previewIndex + 1) % this.previewFrames.length;
    }, 300);
  }

  play(video: any) {
    this.selectedVideo = video;
    this.selectedURL = this.logService.getVideo(video.path);
  }

  mouseDown(event: any) {
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

  mouseMove(event: any) {
    if (!this.isDown) return;
    const carousel = this.carousel.nativeElement;
    const x = event.pageX - carousel.offsetLeft;
    const walk = (x - this.startX) * 2;
    carousel.scrollLeft = this.scrollLeft - walk;
  }

like(video: any) {
  this.logService.like(video);
}

}
