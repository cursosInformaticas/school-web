import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardComponent } from '@form/dashboard/dashboard.component';
import { TimerComponent } from '@form/timer/timer.component';
import { AuthService } from '@services/auth.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    TimerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarOpen = false;
  screenWidth: number = 0;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object,
private authService: AuthService ) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Solo actualizar el ancho si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = event.target.innerWidth;
    }
  }

  isDesktop(): boolean {
    return this.screenWidth >= 768; // Cambia el valor según el breakpoint de 'md' en Tailwind
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verifica si el clic ocurrió dentro del header o del botón del sidebar
    if (!target.closest('header') && !target.closest('.menu-button')) {
      this.sidebarOpen = false; // Cierra el sidebar si el clic es fuera del header o del menú
    }
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
  logout() {
    this.authService.logout();
  }
}
