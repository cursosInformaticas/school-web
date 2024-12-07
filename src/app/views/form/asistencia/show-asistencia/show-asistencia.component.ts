import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Asistencia } from '@models/asistencia';

@Component({
  selector: 'app-show-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-asistencia.component.html',
  styleUrl: './show-asistencia.component.css'
})
export class ShowAsistenciaComponent {
  @Input() asistencia: Asistencia | null = null;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
