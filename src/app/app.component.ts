import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  /*implements OnDestroy*/{
  title = 'curso-web';
/*
  constructor(private authService: AuthService) {
    window.addEventListener('beforeunload', this.clearLocalStorageOnClose.bind(this));
  }
  private clearLocalStorageOnClose(): void {
    this.authService.logout(); // Esto eliminará el localStorage
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.clearLocalStorageOnClose.bind(this));
  }*/
}
