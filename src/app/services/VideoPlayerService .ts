import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class VideoPlayerService {
  selectedURL = signal<string | null>(null);
  selectedVideo = signal<any>(null);

  play(video: any, url: string) {
    this.selectedVideo.set(video);
    this.selectedURL.set(url);
  }

  close() {
    this.selectedURL.set(null);
    this.selectedVideo.set(null);
  }
}