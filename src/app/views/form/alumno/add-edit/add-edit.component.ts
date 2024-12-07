import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { AnioEscolar } from '@models/anio-escolar';
import { Tutor } from '@models/tutor';
import { TutorService } from '@services/tutor.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent implements OnInit{
 @Input() alumno: Alumno = { id: 0, nombre: '', apellido: '', email: '', tutor: null,anioEscolar: null,hasDependencies: false };
 @Input() tutores: Tutor[] = [];
  @Output() save = new EventEmitter<Alumno>();
  @Output() cancelAction = new EventEmitter<void>();
  @Input() aniosEscolares: AnioEscolar[] = [];
  page: number = 0;
  size: number = 100;
  totalPages: number = 0;

  constructor(private readonly tutorService: TutorService) {}

  ngOnInit(): void {
    this.loadTutores();
  }

  async loadTutores(): Promise<void> {
    try {
    const response = await this.tutorService.getAllTutores(this.page, this.size);
    this.tutores = response.data;
    this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      console.error('Error al cargar los tutores', error);
    }
  }

  compareTutorsById(t1: Tutor, t2: Tutor): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  compareAnioEscolarById(t1: AnioEscolar, t2: AnioEscolar): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }
  onSubmit() {
    const alumnoData = {
      ...this.alumno,
      anioEscolar: this.alumno.anioEscolar
        ? {
            id: this.alumno.anioEscolar.id,
            ...(this.isEdit ? { anio: this.alumno.anioEscolar.anio } : {}), // Incluir el `anio` solo si es edición
          }
        : null,
      tutor: this.alumno.tutor
        ? { id: this.alumno.tutor.id } // Solo el ID del tutor
        : null,
    };

    // Eliminar `id` si es creación y tiene un valor de `0`
    if (!this.isEdit && alumnoData.id === 0) {
      delete alumnoData.id;
    }

    console.log('Datos enviados:', alumnoData); // Log para depuración
    this.save.emit(alumnoData);
  }






  get isEdit(): boolean {
    return this.alumno.id > 0;
  }
  cancel() {
    this.cancelAction.emit();
  }
}
