import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ShowHorarioComponent } from '../show-horario/show-horario.component';
import { Horario } from '@models/horario';
import { HorarioService } from '@services/horario.service';
import { Asignatura } from '@models/asignatura';
import { AsignaturaService } from '@services/asignatura.service';
import { Aula } from '@models/aula-model';
import { AulaService } from '@services/aula.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditHorarioComponent } from '../add-edit-horario/add-edit-horario.component';

@Component({
  selector: 'app-list-horario',
  standalone: true,
  imports: [CommonModule, ShowHorarioComponent,AddEditHorarioComponent],
  templateUrl: './list-horario.component.html',
  styleUrl: './list-horario.component.css'
})
export class ListHorarioComponent  implements OnInit {
  horarios: Horario[] = [];
  asignaturas: Asignatura[] = [];
  aulas: Aula[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  horarioToEdit: Horario | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedHorario: Horario | null = null;
  showDetalleModal: boolean = false;

  constructor(
    private readonly horarioService: HorarioService,
    private readonly tutorService: AsignaturaService,
    private readonly aulaService: AulaService
  ) {}

  ngOnInit(): void {
    this.getHorarios();
    this.loadAsignaturas();
    this.getAulas();
  }

  async getHorarios(): Promise<void> {
    try {
      const response = await this.horarioService.getAllHorarios(this.page, this.size);
      this.horarios = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de horarios';
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

  async getAulas(): Promise<void> {
    try {
      const response = await this.aulaService.getAllAulas(this.page, this.size);
      this.aulas = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de aulas';
    }
  }
  agregarNuevoHorario() {
    this.showModal = true;
    this.isEditing = false;
    this.horarioToEdit = {
      id: 0,
      diaSemana: '',
      horaInicio: '',
      horaFin: '',
      asignatura: null,
      aula: null,
    };
  }

  closeModal() {
    this.showModal = false;
    this.horarioToEdit = null;
    this.getHorarios();
  }

  async guardarNuevoHorario(horario: Horario): Promise<void> {
    try {
      let updatedHorario: Horario;
      if (this.isEditing && this.horarioToEdit?.id) {
        // Actualizar horario
        updatedHorario = await this.horarioService.updateHorario(this.horarioToEdit.id, horario);
      } else {
        // Crear nueva horario
        updatedHorario = await this.horarioService.createHorario(horario);
      }

      // Asignar datos completos de asignatura y aula
      updatedHorario.asignatura = this.getAsignaturaById(updatedHorario.asignatura?.id);
      updatedHorario.aula = this.getAulaById(updatedHorario.aula?.id);

      if (this.isEditing) {
        // Actualizar horario en la lista
        const index = this.horarios.findIndex(a => a.id === updatedHorario.id);
        if (index !== -1) {
          this.horarios[index] = updatedHorario;
        }
      } else {
        // Agregar nueva horario a la lista
        this.horarios.push(updatedHorario);
      }

      this.showModal = false; // Cerrar modal
    } catch (error) {
      this.errorMessage = 'Error al guardar la horario';
      console.error('Error al guardar horario:', error);
    }
  }

  getAsignaturaById(id: number | undefined): Asignatura | undefined {
    return this.asignaturas.find(asignatura => asignatura.id === id) || undefined;
  }

  getAulaById(id: number | undefined): Aula | undefined {
    return this.aulas.find(aula => aula.id === id) || undefined;
  }


  async eliminarHorario(idHorario: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este horario?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.horarioService.deleteHorario(idHorario);
        this.horarios = this.horarios.filter(horario => horario.id !== idHorario);
        Alerts.saveAlert('Eliminado', 'El horario ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el horario';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getHorarios();
    }
  }

  verDetalle(horario: Horario) {
    this.selectedHorario = horario;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedHorario = null;
    this.showDetalleModal = false;
  }

  editarHorario(horario: Horario): void {
    this.showModal = true; // Abre el modal
    this.isEditing = true; // Indica que es una edición
    this.horarioToEdit = { ...horario }; // Clona la horario seleccionada para evitar cambios no deseados

    // Opcional: Asegúrate de que los asignaturas y aulas estén cargados antes de abrir el modal
    if (!this.asignaturas.length) {
      this.loadAsignaturas();
    }
    if (!this.aulas.length) {
      this.getAulas();
    }
  }


}
