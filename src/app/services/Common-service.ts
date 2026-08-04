import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { FileEntity } from '../model/FileEntity';
import { ContinueWatchingRequest } from '../model/ContinueWatchingRequest';
import { Page } from '../model/Page';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private urlBase = environment.urlBase;
  private urlEndPointLog: string = this.urlBase + '/api/vortex';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getThumbnail(path: string): string {
    return `${this.urlEndPointLog}/thumbnail?path=` + encodeURIComponent(path);
  }

  getAbsoluteUrl(relativePath: string): string {
    return this.urlEndPointLog + relativePath.replace('/api/vortex', '');
  }

  getPreviews(path: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.urlEndPointLog}/previews?path=${encodeURIComponent(path)}`,
    );
  }

  // ----------------------------
  // Continue Watching
  // ----------------------------

  getContinueWatching(page = 0, size = 10): Observable<Page<FileEntity>> {
    return this.http.get<Page<FileEntity>>(
      `${this.urlBase}/api/vortex/continue?page=${page}&size=${size}`,
    );
  }

  saveContinueWatching(request: ContinueWatchingRequest): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/api/vortex/continue`, request);
  }

  removeContinueWatching(videoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.urlBase}/api/vortex/continue/${videoId}`,
    );
  }
}
