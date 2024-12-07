import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  errorMessage = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Redirigir si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/initial']); // Ruta a la que quieres redirigir al usuario autenticado
    }
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.access_token, response.refresh_token);
        this.router.navigate(['/initial']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas.';
      },
    });
  }


}
