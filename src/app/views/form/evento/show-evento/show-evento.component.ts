import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Evento } from '@models/evento-model';

@Component({
  selector: 'app-show-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-evento.component.html',
  styleUrl: './show-evento.component.css'
})
export class ShowEventoComponent {
  @Input() evento: Evento | null = null;
  @Output() close = new EventEmitter<void>();
  mostrarTodos = false; 
  closeModal() {
    this.close.emit();
  }

  showAllAlumnos() {
    this.mostrarTodos = true;
  }
}
