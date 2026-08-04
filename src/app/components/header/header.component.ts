import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private router: Router){}


}
