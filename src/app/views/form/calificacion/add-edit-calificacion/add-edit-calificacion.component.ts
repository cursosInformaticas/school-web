import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { Calificacion } from '@models/calificacion';
import { Examen } from '@models/examen';
import { AlumnoService } from '@services/alumno.service';
import { ExamenService } from '@services/examen.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-calificacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-calificacion.component.html',
  styleUrl: './add-edit-calificacion.component.css'
})
export class AddEditCalificaionComponent implements OnInit, OnChanges{
  @Input() calificacion: Calificacion = { id: 0, puntaje: 0, examen: null, alumno: null };
  @Input() examenes: Examen[] = [];
  @Input() alumnos: Alumno[] = [];
   @Output() save = new EventEmitter<Calificacion>();
   @Output() cancelAction = new EventEmitter<void>();

   page: number = 0;
   size: number = 100;
   totalPages: number = 0;

   constructor(  private readonly examenService: ExamenService,
    private readonly alumnoService: AlumnoService
   ) {}

   ngOnInit(): void {
     this.loadExamens();
     this.loadAlumno();
   }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['calificacion']) {
      if (this.examenes.length > 0) {
        this.setExamenSeleccionado();
      }else {
        console.log('La lista de alumnos aún no está cargada.');
      }
    }
  }

  async loadAlumno(): Promise<void> {
    try {
      const response = await this.alumnoService.getAllAlumnos(this.page, this.size);
      this.alumnos = response.data;
      if (this.calificacion.alumno) {
        this.setAlumnoSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los alumnos', error);
    }
  }

  async loadExamens(): Promise<void> {
    try {
      const response = await this.examenService.getAllExamens(this.page, this.size);
      this.examenes = response.data;
      if (this.calificacion.examen) {
        this.setExamenSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los examenes', error);
    }
  }

  setExamenSeleccionado(): void {
    if (this.calificacion.examen?.id) {
      const matchedExamen = this.examenes.find(examen => examen.id === this.calificacion.examen?.id);
      if (matchedExamen) {
        this.calificacion.examen = matchedExamen;
      } else {
        this.calificacion.examen = null;
      }
    }
  }

  setAlumnoSeleccionado(): void {
    if (this.calificacion.alumno?.id) {
      const matchedAlumno = this.alumnos.find(alumno => alumno.id === this.calificacion.alumno?.id);
      if (matchedAlumno) {
        this.calificacion.alumno = matchedAlumno;
      } else {
        this.calificacion.alumno = null;
      }
    } else {
      console.log('No hay alumno asignado en calificacion.');
    }
  }


  onSubmit(): void {
    const { id, ...calificacionData } = this.calificacion;
    const calificacionToSave: Calificacion = {
      ...(id !== 0 ? { id } : {}),
      ...calificacionData,
      examen: { id: this.calificacion.examen?.id },
      alumno: { id: this.calificacion.alumno?.id },
    };
    this.save.emit(calificacionToSave);
  }

  get isEdit(): boolean {
    return this.calificacion.id > 0;
  }

   cancel() {
     this.cancelAction.emit();
   }
 }


