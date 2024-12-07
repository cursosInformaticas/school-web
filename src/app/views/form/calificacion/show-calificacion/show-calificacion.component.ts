import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Calificacion } from '@models/calificacion';

@Component({
  selector: 'app-show-calificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-calificacion.component.html',
  styleUrl: './show-calificacion.component.css'
})
export class ShowCalificaionComponent {

  @Input() calificacion: Calificacion | null = null;
  @Output() close = new EventEmitter<void>();

  mostrarTodos = false; 
  showAllAlumnos() {
    this.mostrarTodos = true;
  }

  
  closeModal() {
    this.close.emit();
  }
}
