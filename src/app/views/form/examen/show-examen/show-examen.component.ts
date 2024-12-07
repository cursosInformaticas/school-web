import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Examen } from '@models/examen';

@Component({
  selector: 'app-show-examen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-examen.component.html',
  styleUrl: './show-examen.component.css'
})
export class ShowExamenComponent {
  @Input() examen: Examen | null = null;
  @Output() close = new EventEmitter<void>();
  mostrarTodos = false; 
  showAllAlumnos() {
    this.mostrarTodos = true;
  }

  closeModal() {
    this.close.emit();
  }
}
