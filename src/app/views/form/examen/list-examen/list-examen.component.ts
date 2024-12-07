import { Component, OnInit } from '@angular/core';
import { ShowExamenComponent } from '../show-examen/show-examen.component';
import { CommonModule } from '@angular/common';
import { Examen } from '@models/examen';
import { ExamenService } from '@services/examen.service';
import { Asignatura } from '@models/asignatura';
import { AsignaturaService } from '@services/asignatura.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditExamenComponent } from '../add-edit-examen/add-edit-examen.component';

@Component({
  selector: 'app-list-examen',
  standalone: true,
  imports: [CommonModule, ShowExamenComponent,AddEditExamenComponent],
  templateUrl: './list-examen.component.html',
  styleUrl: './list-examen.component.css'
})
export class ListExamenComponent implements OnInit {
  examenes: Examen[] = [];
  asignaturas: Asignatura[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  examenToEdit: Examen | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedExamen: Examen | null = null;
  showDetalleModal: boolean = false;

  constructor(
    private readonly examenService: ExamenService,
    private readonly tutorService: AsignaturaService
  ) {}

  ngOnInit(): void {
    this.getExamens();
    this.loadAsignaturas();
  }

  async getExamens(): Promise<void> {
    try {
      const response = await this.examenService.getAllExamens(this.page, this.size);
      this.examenes = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de examenes';
    }
  }

  async loadAsignaturas(): Promise<void> {
    try {
   const response = await this.tutorService.getAllAsignaturas(this.page, this.size);
   this.asignaturas = response.data;
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los asignaturas';
    }
  }
  agregarNuevoExamen() {
    this.showModal = true;
    this.isEditing = false;
    this.examenToEdit = {
      id: 0,
      nombre: '',
      fecha: '',
      asignatura: null,
    };
  }

  editarExamen(examen: Examen) {
    this.showModal = true;
    this.isEditing = true;
    this.examenToEdit = {
      ...examen,
      asignatura: this.getTutorById(examen.asignatura?.id) || null,
    };
  }
  closeModal() {
    this.showModal = false;
    this.examenToEdit = null;
  }

  async guardarNuevoExamen(examen: Examen) {
    try {
      if (this.isEditing && this.examenToEdit) {
        const updatedExamen = await this.examenService.updateExamen(
          this.examenToEdit.id,
          examen
        );
        const index = this.examenes.findIndex((a) => a.id === updatedExamen.id);
        if (index !== -1) {
          updatedExamen.asignatura = this.getTutorById(updatedExamen.asignatura?.id);
          this.examenes[index] = updatedExamen;
        }
        Alerts.saveAlert('Examen', 'Actualizado exitosamente', 'success');
      } else {
        const nuevoExamen = await this.examenService.createExamen(examen);
        nuevoExamen.asignatura = this.getTutorById(nuevoExamen.asignatura?.id);
        this.examenes.push(nuevoExamen);
        this.getExamens();
        this.loadAsignaturas();
        Alerts.saveAlert('Examen', 'Guardado exitosamente', 'success');
      }
      this.closeModal();


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el examen';
    }
  }

  getTutorById(id: number | undefined): Asignatura | undefined {
    return this.asignaturas.find(tutor => tutor.id === id);
  }

  async eliminarExamen(idExamen: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este examen?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.examenService.deleteExamen(idExamen);
        this.examenes = this.examenes.filter(examen => examen.id !== idExamen);
        Alerts.saveAlert('Eliminado', 'El examen ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el examen';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getExamens();
    }
  }

  verDetalle(examen: Examen) {
    this.selectedExamen = examen;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedExamen = null;
    this.showDetalleModal = false;
  }
}

