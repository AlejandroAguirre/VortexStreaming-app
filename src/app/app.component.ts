import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoModalComponent } from './components/shared/video-modal/video-modal.component';

@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, VideoModalComponent],
})
export class AppComponent {
  title = 'vortex-app';
}
