import { FileEntity } from '../../../model/FileEntity';

export abstract class PreviewableComponent {
  hoveringVideo: FileEntity | null = null;
  previewFrames: string[] = [];
  previewIndex = 0;
  previewInterval: any = null;
  currentPreviewId = 0;

  stopPreview(): void {
    if (this.previewInterval) {
      clearInterval(this.previewInterval);
      this.previewInterval = null;
    }
    this.previewFrames = [];
    this.hoveringVideo = null;
    this.previewIndex = 0;
    this.currentPreviewId++;
  }

  getPreviewFrame(video: FileEntity): string {
    if (
      this.hoveringVideo?.path === video.path &&
      this.previewFrames.length > 0
    ) {
      return this.previewFrames[this.previewIndex];
    }
    return this.getThumbnail(video);
  }
  protected abstract getThumbnail(video: FileEntity): string;
}
