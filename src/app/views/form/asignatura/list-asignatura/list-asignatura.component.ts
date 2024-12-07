import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asignatura } from '@models/asignatura';
import { Curso } from '@models/curso-model';
import { AsignaturaService } from '@services/asignatura.service';
import { CursoService } from '@services/curso.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditAsignaturaComponent } from '../add-edit-asignatura/add-edit-asignatura.component';
import { ShowAsignaturaComponent } from '../show-asignatura/show-asignatura.component';

@Component({
  selector: 'app-list-asignatura',
  standalone: true,
  imports: [CommonModule,AddEditAsignaturaComponent, ShowAsignaturaComponent],
  templateUrl: './list-asignatura.component.html',
  styleUrl: './list-asignatura.component.css'
})
export class ListAsignaturaComponent  implements OnInit {
  asignaturas: Asignatura[] = [];
  cursos: Curso[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  asignaturaToEdit: Asignatura | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedAsignatura: Asignatura | null = null;
  showDetalleModal: boolean = false;

  constructor(
    private readonly asignaturaService: AsignaturaService,
    private readonly tutorService: CursoService
  ) {}

  ngOnInit(): void {
    this.getAsignaturas();
    this.loadCursos();
  }

  async getAsignaturas(): Promise<void> {
    try {
      const response = await this.asignaturaService.getAllAsignaturas(this.page, this.size);
      this.asignaturas = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de asignaturas';
    }
  }

  async loadCursos(): Promise<void> {
    try {
   const response = await this.tutorService.getAllCursos(this.page, this.size);
   this.cursos = response.data;
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los cursos';
    }
  }
  agregarNuevoAsignatura() {
    this.showModal = true;
    this.isEditing = false;
    this.asignaturaToEdit = {
      id: 0,
      nombre: '',
      descripcion: '',
      curso: null,
    };
  }

  editarAsignatura(asignatura: Asignatura) {
    this.showModal = true;
    this.isEditing = true;
    this.asignaturaToEdit = {
      ...asignatura,
      curso: this.getTutorById(asignatura.curso?.id) || null,
    };
  }
  closeModal() {
    this.showModal = false;
    this.asignaturaToEdit = null;
  }

  async guardarNuevoAsignatura(asignatura: Asignatura) {
    try {
      if (this.isEditing && this.asignaturaToEdit) {
        const updatedAsignatura = await this.asignaturaService.updateAsignatura(
          this.asignaturaToEdit.id,
          asignatura
        );
        const index = this.asignaturas.findIndex((a) => a.id === updatedAsignatura.id);
        if (index !== -1) {
          updatedAsignatura.curso = this.getTutorById(updatedAsignatura.curso?.id);
          this.asignaturas[index] = updatedAsignatura;
        }
        Alerts.saveAlert('Asignatura', 'Actualizado exitosamente', 'success');
      } else {
        const nuevoAsignatura = await this.asignaturaService.createAsignatura(asignatura);
        nuevoAsignatura.curso = this.getTutorById(nuevoAsignatura.curso?.id);
        this.asignaturas.push(nuevoAsignatura);
        this.getAsignaturas();
        this.loadCursos();
        Alerts.saveAlert('Asignatura', 'Guardado exitosamente', 'success');
      }
      this.closeModal();


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el asignatura';
    }
  }

  getTutorById(id: number | undefined): Curso | undefined {
    return this.cursos.find(tutor => tutor.id === id);
  }

  async eliminarAsignatura(idAsignatura: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este asignatura?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.asignaturaService.deleteAsignatura(idAsignatura);
        this.asignaturas = this.asignaturas.filter(asignatura => asignatura.id !== idAsignatura);
        Alerts.saveAlert('Eliminado', 'El asignatura ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el asignatura';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getAsignaturas();
    }
  }

  verDetalle(asignatura: Asignatura) {
    this.selectedAsignatura = asignatura;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedAsignatura = null;
    this.showDetalleModal = false;
  }
}
