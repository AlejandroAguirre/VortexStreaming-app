import { Injectable } from '@angular/core';
import { FileEntity } from '../model/FileEntity';
import { CommonService } from './Common-service';


@Injectable()
export class PreviewService {

  hoveringVideo: FileEntity | null = null;
  previewFrames: string[] = [];
  previewIndex = 0;
  previewInterval: any = null;
  currentPreviewId = 0;

  constructor(
    private commonService: CommonService
  ) {}

  getPreviewFrame(video: FileEntity): string {
    if (
      this.hoveringVideo?.path === video.path &&
      this.previewFrames.length > 0
    ) {
      return this.previewFrames[this.previewIndex];
    }
    return this.getThumbnail(video);
  }


  private getThumbnail(video: FileEntity): string {
    if (!video.thumbnails || video.thumbnails.length === 0) {
      return 'assets/folder-icon.png';
    }
    return this.commonService.getAbsoluteUrl(
      video.thumbnails[0]
    );
  }


  stopPreview() {
    if(this.previewInterval){
      clearInterval(this.previewInterval);
    }

    this.previewInterval = null;
    this.previewFrames = [];
    this.previewIndex = 0;
    this.hoveringVideo = null;
    this.currentPreviewId++;
  }
}