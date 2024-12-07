import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GradoEscolar } from '@models/grado-escolar-model';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-grado-escolar',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-grado-escolar.component.html',
  styleUrl: './add-edit-grado-escolar.component.css'
})
export class AddEditGradoEscolarComponent {

  @Input() gradoEscolar: GradoEscolar = { id: 0, nombre: '' };
  @Output() save = new EventEmitter<GradoEscolar>();
  @Output() cancelAction = new EventEmitter<void>();

  onSubmit() {
    const gradoEscolarData = {
      ...this.gradoEscolar,
      id: this.gradoEscolar.id === 0 ? undefined : this.gradoEscolar.id
    };
    this.save.emit(gradoEscolarData);
  }

  get isEdit(): boolean {
    return this.gradoEscolar.id > 0;
  }
  cancel() {
    this.cancelAction.emit();
  }
}
