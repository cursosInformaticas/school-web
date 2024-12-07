import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tutor } from '@models/tutor';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditTutorComponent  {

  @Input() tutor: Tutor = { id: 0, nombre: '', apellido: '', email: '', telefono: '' };
  @Output() save = new EventEmitter<Tutor>();
  @Output() cancelAction = new EventEmitter<void>();

  onSubmit() {
    const tutorData = {
      ...this.tutor,
      id: this.tutor.id === 0 ? undefined : this.tutor.id
    };
    this.save.emit(tutorData);
  }

  get isEdit(): boolean {
    return this.tutor.id > 0;
  }

  cancel() {
    this.cancelAction.emit();
  }
}
