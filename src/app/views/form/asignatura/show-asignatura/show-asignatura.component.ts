import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Asignatura } from '@models/asignatura';

@Component({
  selector: 'app-show-asignatura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-asignatura.component.html',
  styleUrl: './show-asignatura.component.css'
})
export class ShowAsignaturaComponent {
  @Input() asignatura: Asignatura | null = null;
  @Output() close = new EventEmitter<void>();
  mostrarTodos = false;

  closeModal() {
    this.close.emit();
  }
  showAllAlumnos() {
    this.mostrarTodos = true;
  }
}
