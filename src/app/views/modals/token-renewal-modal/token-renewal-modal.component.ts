import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-token-renewal-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './token-renewal-modal.component.html',
  styleUrl: './token-renewal-modal.component.css'
})
export class TokenRenewalModalComponent {
  constructor(public dialogRef: MatDialogRef<TokenRenewalModalComponent>) {}

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
