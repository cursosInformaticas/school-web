import { Component, OnInit } from '@angular/core';
import { ShowCalificaionComponent } from '../show-calificacion/show-calificacion.component';
import { CommonModule } from '@angular/common';
import { Calificacion } from '@models/calificacion';
import { CalificacionService } from '@services/calificacion.service';
import { Examen } from '@models/examen';
import { ExamenService } from '@services/examen.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditCalificaionComponent } from '../add-edit-calificacion/add-edit-calificacion.component';
import { Alumno } from '@models/alumno';
import { AlumnoService } from '@services/alumno.service';

@Component({
  selector: 'app-list-calificacion',
  standalone: true,
  imports: [CommonModule, ShowCalificaionComponent,AddEditCalificaionComponent],
  templateUrl: './list-calificacion.component.html',
  styleUrl: './list-calificacion.component.css'
})
export class ListCalificaionComponent implements OnInit {
  calificaciones: Calificacion[] = [];
  examenes: Examen[] = [];
  alumnos: Alumno[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  calificacionToEdit: Calificacion | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedCalificacion: Calificacion | null = null;
  showDetalleModal: boolean = false;

  constructor(
    private readonly calificacionService: CalificacionService,
    private readonly tutorService: ExamenService,
    private readonly alumnosService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.getCalificacions();
    this.loadExamens();
    this.getAlumnos();
  }

  async getCalificacions(): Promise<void> {
    try {
      const response = await this.calificacionService.getAllCalificaciones(this.page, this.size);
      this.calificaciones = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de calificaciones';
    }
  }

  async loadExamens(): Promise<void> {
    try {
   const response = await this.tutorService.getAllExamens(this.page, this.size);
   this.examenes = response.data;
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los examenes';
    }
  }

  async getAlumnos(): Promise<void> {
    try {
      const response = await this.alumnosService.getAllAlumnos(this.page, this.size);
      this.alumnos = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de alumnos';
    }
  }
  agregarNuevoCalificacion() {
    this.showModal = true;
    this.isEditing = false;
    this.calificacionToEdit = {
      id: 0,
      puntaje: 0,
      examen: null,
      alumno: null,
    };
  }

  closeModal() {
    this.showModal = false;
    this.calificacionToEdit = null;
    this.getCalificacions();
  }

  async guardarNuevoCalificacion(calificacion: Calificacion): Promise<void> {
    try {
      if (calificacion.id && calificacion.id !== 0) {
        await this.calificacionService.updateCalificacion(calificacion.id, calificacion);
      } else {
        await this.calificacionService.createCalificacion(calificacion);
      }
      await this.getCalificacions();
      this.showModal = false;
    } catch (error) {
      this.errorMessage = 'Error al guardar la calificación';
      console.error('Error al guardar calificación:', error);
    }
  }



  getAlumnoById(id: number | undefined): Alumno | undefined {
    return this.alumnos.find(alumno => alumno.id === id);
  }

  getExamenById(id: number | undefined): Examen | undefined {
    return this.examenes.find(examen => examen.id === id);
  }



  async eliminarCalificacion(idCalificacion: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este calificacion?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.calificacionService.deleteCalificacion(idCalificacion);
        this.calificaciones = this.calificaciones.filter(calificacion => calificacion.id !== idCalificacion);
        Alerts.saveAlert('Eliminado', 'El calificacion ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el calificacion';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getCalificacions();
    }
  }

  verDetalle(calificacion: Calificacion) {
    this.selectedCalificacion = calificacion;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedCalificacion = null;
    this.showDetalleModal = false;
  }

  editarCalificacion(calificacion: Calificacion): void {
    this.showModal = true; // Abre el modal
    this.isEditing = true; // Indica que es una edición
    this.calificacionToEdit = { ...calificacion }; // Clona la calificacion seleccionada para evitar cambios no deseados

    // Opcional: Asegúrate de que los examenes y alumnos estén cargados antes de abrir el modal
    if (!this.examenes.length) {
      this.loadExamens();
    }
    if (!this.alumnos.length) {
      this.getAlumnos();
    }
  }


}
