import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Curso } from '@models/curso-model';

@Component({
  selector: 'app-show-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-curso.component.html',
  styleUrl: './show-curso.component.css'
})
export class ShowCursoComponent {
  @Input() curso: Curso | null = null;
  @Output() close = new EventEmitter<void>();

  mostrarTodos = false; 

  closeModal() {
    this.close.emit();
  }
  showAllAlumnos() {
    this.mostrarTodos = true;
  }

}
