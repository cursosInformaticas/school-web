import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { MaterialModule } from 'src/app/material/material.module';
import { TokenRenewalModalComponent } from '../../modals/token-renewal-modal/token-renewal-modal.component';
import { Alerts } from 'src/app/material/alets-global';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, MaterialModule,TokenRenewalModalComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent implements OnInit, OnDestroy {
  timeLeft: number = 0; // Tiempo restante en segundos
  private timer: any;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const expirationTime = this.authService.getTokenExpirationTime();

    if (expirationTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      this.timeLeft = expirationTime - currentTime;
      this.startTimer();
    } else {
      this.authService.logout();
    }
  }

  startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft === 290) {
        clearInterval(this.timer);
        this.promptTokenRenewal();
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.authService.logout();
      }
    }, 1000);
  }

  promptTokenRenewal(): void {
    Alerts.confirmDeleteAlert(
      '¿Deseas continuar tu sesión?',
      'Tu sesión está a punto de expirar.',
      'warning',
      'Sí, continuar'
    ).then((result) => {
      if (result.isConfirmed) {
        // Usuario aceptó renovar la sesión
        this.authService.refreshToken().subscribe({
          next: (response: any) => {
            const newAccessToken = response.access_token;
            const newRefreshToken = response.refresh_token;

            this.authService.saveToken(newAccessToken, newRefreshToken);

            // Calcular el nuevo tiempo de expiración
            const expirationTime = this.authService.getTokenExpirationTime();
            const currentTime = Math.floor(Date.now() / 1000);
            this.timeLeft = expirationTime! - currentTime;

            this.startTimer();
          },
          error: () => {
            Alerts.confirmBasicAlert(
              'Error',
              'No se pudo renovar el token. Por favor, inicia sesión nuevamente.',
              'error'
            );
            this.authService.logout();
          }
        });
      } else {
        // Usuario rechazó renovar la sesión
        this.authService.logout();
      }
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
