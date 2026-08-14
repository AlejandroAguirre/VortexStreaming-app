import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { FileEntity } from '../model/FileEntity';
import { Page } from '../model/Page';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private urlBase = environment.urlBase;
  private urlEndPointLog = `${this.urlBase}/vortex`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getVideos(path: string = ''): Observable<FileEntity[]> {
    const params = path ? `?path=${encodeURIComponent(path)}` : '';

    return this.http.get<FileEntity[]>(
      `${this.urlEndPointLog}/videos${params}`,
    );
  }

  getVideo(path: string): string {
    return (
      `${this.urlEndPointLog}/video/` +
      path.split('/').map(encodeURIComponent).join('/')
    );
  }

  searchVideos(
    text: string,
    page = 0,
    size = 20,
  ): Observable<Page<FileEntity>> {
    return this.http.get<Page<FileEntity>>(
      `${this.urlEndPointLog}/search?q=${encodeURIComponent(text)}&page=${page}&size=${size}`,
    );
  }

  getRecentVideos(page = 0, size = 11): Observable<Page<FileEntity>> {
    return this.http.get<Page<FileEntity>>(
      `${this.urlEndPointLog}/recent?page=${page}&size=${size}`,
    );
  }

  getFavorites(page = 0, size = 10): Observable<Page<FileEntity>> {
    return this.http.get<Page<FileEntity>>(
      `${this.urlEndPointLog}/favorites?page=${page}&size=${size}`,
    );
  }

  like(video: any) {
    if (video.liked) {
      this.http
        .delete(`${this.urlEndPointLog}/like/${video.path}`)
        .subscribe(() => {
          video.liked = false;
        });
    } else {
      this.http
        .post(`${this.urlEndPointLog}/like/${video.path}`, {})
        .subscribe(() => {
          video.liked = true;
        });
    }
  }

  listenThumbnailGeneration(): Observable<number> {
    return new Observable<number>((observer) => {
      const eventSource = new EventSource(
        `${this.urlEndPointLog}/thumbnails/events`,
      );

      const onFinished = (event: MessageEvent) => {
        const total = Number(event.data);
        observer.next(total);
      };

      eventSource.addEventListener('thumbnails-finished', onFinished);

      eventSource.onerror = (error) => {
        console.warn(
          'SSE connection error. EventSource will attempt to reconnect.',
          error,
        );
      };

      return () => {
        eventSource.removeEventListener('thumbnails-finished', onFinished);

        eventSource.close();
      };
    });
  }
}
