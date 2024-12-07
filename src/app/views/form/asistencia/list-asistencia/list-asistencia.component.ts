import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddEditAsistenciaComponent } from '../add-edit-asistencia/add-edit-asistencia.component';
import { ShowAsistenciaComponent } from '../show-asistencia/show-asistencia.component';
import { Alerts } from 'src/app/material/alets-global';
import { Asistencia } from '@models/asistencia';
import { Alumno } from '@models/alumno';
import { Curso } from '@models/curso-model';
import { AsistenciaService } from '@services/asistencia.service';
import { CursoService } from '@services/curso.service';
import { AlumnoService } from '@services/alumno.service';

@Component({
  selector: 'app-list-asistencia',
  standalone: true,
  imports: [CommonModule,AddEditAsistenciaComponent,ShowAsistenciaComponent],
  templateUrl: './list-asistencia.component.html',
  styleUrl: './list-asistencia.component.css'
})
export class ListAsistenciaComponent implements OnInit {
  asistencias: Asistencia[] = [];
  cursos: Curso[] = [];
  alumnos: Alumno[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  asistenciaToEdit: Asistencia | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedAsistencia: Asistencia | null = null;
  showDetalleModal: boolean = false;

  constructor(
    private readonly asistenciaService: AsistenciaService,
    private readonly cursoService: CursoService,
    private readonly alumnosService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.getAsistencias();
    this.loadCursos();
    this.getAlumnos();
  }

  async getAsistencias(): Promise<void> {
    try {
      const response = await this.asistenciaService.getAllAsistencias(this.page, this.size);
      this.asistencias = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de asistencias';
    }
  }

  async loadCursos(): Promise<void> {
    try {
   const response = await this.cursoService.getAllCursos(this.page, this.size);
   this.cursos = response.data;
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los cursos';
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
  agregarNuevoAsistencia() {
    this.showModal = true;
    this.isEditing = false;
    this.asistenciaToEdit = {
      id: 0,
      fecha: '',
      presente: false,
      curso: null,
      alumno: null,
    };
  }

  closeModal() {
    this.showModal = false;
    this.asistenciaToEdit = null;
    this.getAsistencias();
  }

  async guardarNuevoAsistencia(asistencia: Asistencia): Promise<void> {
    try {
      if (asistencia.id && asistencia.id !== 0) {
        await this.asistenciaService.updateAsistencia(asistencia.id, asistencia);
      } else {
        await this.asistenciaService.createAsistencia(asistencia);
      }
      await this.getAsistencias();
      this.showModal = false;
    } catch (error) {
      this.errorMessage = 'Error al guardar la calificación';
      console.error('Error al guardar calificación:', error);
    }
  }

  getAlumnoById(id: number | undefined): Alumno | undefined {
    return this.alumnos.find(alumno => alumno.id === id);
  }

  getCursoById(id: number | undefined): Curso | undefined {
    return this.cursos.find(examen => examen.id === id);
  }



  async eliminarAsistencia(idAsistencia: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este asistencia?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.asistenciaService.deleteAsistencia(idAsistencia);
        this.asistencias = this.asistencias.filter(asistencia => asistencia.id !== idAsistencia);
        Alerts.saveAlert('Eliminado', 'El asistencia ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el asistencia';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getAsistencias();
    }
  }

  verDetalle(asistencia: Asistencia) {
    this.selectedAsistencia = asistencia;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedAsistencia = null;
    this.showDetalleModal = false;
  }

  editarAsistencia(asistencia: Asistencia): void {
    this.showModal = true;
    this.isEditing = true;
    this.asistenciaToEdit = { ...asistencia };
    if (!this.cursos.length) {
      this.loadCursos();
    }
    if (!this.alumnos.length) {
      this.getAlumnos();
    }
  }
  isEditable(asistencia: Asistencia): boolean {
    const currentTime = new Date().getTime();
    const asistenciaTime = new Date(asistencia.fecha).getTime();
    const diffInHours = (currentTime - asistenciaTime) / (1000 * 60 * 60);
    return diffInHours <= 24;
  }

}
