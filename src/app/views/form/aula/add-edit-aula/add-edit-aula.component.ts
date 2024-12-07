import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aula } from '@models/aula-model';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-aula',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-aula.component.html',
  styleUrl: './add-edit-aula.component.css'
})
export class AddEditAulaComponent {


  @Input() aula: Aula = { id: 0, nombre: '', capacidad: 0 };
  @Output() save = new EventEmitter<Aula>();
  @Output() cancelAction = new EventEmitter<void>();

  onSubmit() {
    const aulaData = {
      ...this.aula,
      id: this.aula.id === 0 ? undefined : this.aula.id
    };
    this.save.emit(aulaData);
  }
  get isEdit(): boolean {
    return this.aula.id > 0;
  }
  cancel() {
    this.cancelAction.emit();
  }
}
