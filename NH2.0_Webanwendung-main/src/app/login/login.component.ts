import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage =
        'Bitte Benutzername und Passwort eingeben.';
      return;
    }

    this.loading = true;

    this.authService.login(
      this.username,
      this.password
    ).subscribe({

      next: () => {
        this.loading = false;

        // Nach erfolgreichem Login
        // auf eure bestehende Personenübersicht
        this.router.navigate(['/list-person']);
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Benutzername oder Passwort ist falsch.';
        } else {
          this.errorMessage =
            'Anmeldung momentan nicht möglich.';
        }
      }

    });
  }
}