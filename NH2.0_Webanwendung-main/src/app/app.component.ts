import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'NH2.00';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
