import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
    }),
   /* provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
      languages: {
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml')
      },
      themePath: 'path-to-theme.css'
    }),*/
    //provideMomentDateAdapter(), 
    provideNativeDateAdapter(),
    MatNativeDateModule, 
    importProvidersFrom(FormsModule,MatMomentDateModule,MatDatepickerModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    provideRouter(routes), provideAnimationsAsync()],
    
};
