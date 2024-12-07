import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Maestro } from '@models/maestro-model';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-maestro',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-maestro.component.html',
  styleUrl: './add-edit-maestro.component.css'
})
export class AddEditMaestroComponent {

  @Input() maestro: Maestro = { id: 0, nombre: '', apellido: '', especialidad: '' };
  @Output() save = new EventEmitter<Maestro>();
  @Output() cancelAction = new EventEmitter<void>();

  onSubmit() {
    const maestroData = {
      ...this.maestro,
      id: this.maestro.id === 0 ? undefined : this.maestro.id
    };
    this.save.emit(maestroData);
  }
  get isEdit(): boolean {
    return this.maestro.id > 0;
  }
  cancel() {
    this.cancelAction.emit();
  }
}
