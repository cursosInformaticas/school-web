import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { Asistencia } from '@models/asistencia';
import { Curso } from '@models/curso-model';
import { AlumnoService } from '@services/alumno.service';
import { CursoService } from '@services/curso.service';
import { MaterialModule } from 'src/app/material/material.module';
import  moment from 'moment';

@Component({
  selector: 'app-add-edit-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-asistencia.component.html',
  styleUrl: './add-edit-asistencia.component.css'
})
export class AddEditAsistenciaComponent  implements OnInit, OnChanges{
  @Input() asistencia: Asistencia = { id: 0, fecha: '', presente: false, curso: null, alumno: null };
  @Input() cursos: Curso[] = [];
  @Input() alumnos: Alumno[] = [];
   @Output() save = new EventEmitter<Asistencia>();
   @Output() cancelAction = new EventEmitter<void>();
   fechaValida: boolean = true;
   page: number = 0;
   size: number = 100;
   totalPages: number = 0;

   constructor(  private readonly cursoService: CursoService,
    private readonly alumnoService: AlumnoService
   ) {}

   ngOnInit(): void {
     this.loadCursos();
     this.loadAlumno();

     if (this.asistencia.fecha) {
      this.asistencia.fecha = moment(this.asistencia.fecha).format('YYYY-MM-DDTHH:mm');
    }
   }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['asistencia']) {
   
    }
  }

  async loadAlumno(): Promise<void> {
    try {
      const response = await this.alumnoService.getAllAlumnos(this.page, this.size);
      this.alumnos = response.data;
      if (this.asistencia.alumno) {
        this.setAlumnoSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los alumnos', error);
    }
  }

  async loadCursos(): Promise<void> {
    try {
      const response = await this.cursoService.getAllCursos(this.page, this.size);
      this.cursos = response.data;
      if (this.asistencia.curso) {
        this.setCursoSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los cursos', error);
    }
  }

  setCursoSeleccionado(): void {
    if (this.asistencia.curso?.id) {
      const matchedCurso = this.cursos.find(curso => curso.id === this.asistencia.curso?.id);
      if (matchedCurso) {
        this.asistencia.curso = matchedCurso;
      } else {
        this.asistencia.curso = null;
      }
    }
  }

  setAlumnoSeleccionado(): void {
    if (this.asistencia.alumno?.id) {
      const matchedAlumno = this.alumnos.find(alumno => alumno.id === this.asistencia.alumno?.id);
      if (matchedAlumno) {
        this.asistencia.alumno = matchedAlumno;
      } else {
        this.asistencia.alumno = null;
      }
    } else {
      console.log('No hay alumno asignado en asistencia.');
    }
  }
  today: string = moment().format('YYYY-MM-DDTHH:mm');

  validateFecha(): void {
    const selectedDate = moment(this.asistencia.fecha);
    const today = moment().startOf('day'); // Día actual sin hora
    const dayOfWeek = selectedDate.day();
  
    // Validar que el día sea de lunes a viernes y sea el día actual
    this.fechaValida =
      dayOfWeek >= 1 &&
      dayOfWeek <= 5 &&
      selectedDate.isSame(today, 'day');
  
    if (!this.fechaValida) {
      console.error('La fecha seleccionada no es válida. Solo se permite el día actual entre lunes y viernes.');
    }
  }
  
  

  onSubmit(): void {
    if (!this.fechaValida) {
      alert('La fecha seleccionada no es válida.');
      return;
    }
    const formattedFecha = moment(this.asistencia.fecha).format('YYYY-MM-DDTHH:mm:ss');
    const { id, ...asistenciaData } = this.asistencia;
    const asistenciaToSave: Asistencia = {
      ...(id !== 0 ? { id } : {}),
      ...asistenciaData,
      fecha: formattedFecha,
      curso: { id: this.asistencia.curso?.id },
      alumno: { id: this.asistencia.alumno?.id },
    };
    this.save.emit(asistenciaToSave);
  }

  get isEdit(): boolean {
    return this.asistencia.id > 0;
  }

   cancel() {
     this.cancelAction.emit();
   }
 }