import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Horario } from '@models/horario';

@Component({
  selector: 'app-show-horario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-horario.component.html',
  styleUrl: './show-horario.component.css'
})
export class ShowHorarioComponent {
  @Input() horario: Horario | null = null;
  @Output() close = new EventEmitter<void>();
  mostrarTodos = false;
  closeModal() {
    this.close.emit();
  }

  showAllAlumnos() {
    this.mostrarTodos = true;
  }
}
