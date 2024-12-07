import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tutor } from '@models/tutor';
import { TutorService } from '@services/tutor.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditTutorComponent } from '../add-edit/add-edit.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,AddEditTutorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListTutorComponent implements OnInit{

  tutores: Tutor[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  tutorToEdit: Tutor | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor(    private readonly tutorService: TutorService) { }

  ngOnInit(): void {
    this.loadTutores();
  }

  async loadTutores(): Promise<void> {
    try {

      const response = await this.tutorService.getAllTutores(this.page, this.size);
      this.tutores = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los tutores';
    }
  }

  agregarNuevoTutor() {
    this.showModal = true;
    this.isEditing = false;
    this.tutorToEdit = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',

    };
  }

  editarTutor(tutor: Tutor) {
    this.showModal = true;
    this.isEditing = true;
    this.tutorToEdit = {
      ...tutor
    };
  }
  closeModal() {
    this.showModal = false;
    this.tutorToEdit = null;
  }


  async guardarNuevoTutor(tutor: Tutor) {
    try {
      if (this.isEditing && this.tutorToEdit) {
        const updatedTutor = await this.tutorService.updateTutor(
          this.tutorToEdit.id,
          tutor
        );
        const index = this.tutores.findIndex((a) => a.id === updatedTutor.id);
        if (index !== -1) {
          this.tutores[index] = updatedTutor;
        }
      } else {
        const nuevoTutor = await this.tutorService.createTutor({
          ...tutor,
          id: undefined
        });
        this.tutores.push(nuevoTutor);
        this.loadTutores();
      }
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el alumno';
    }
  }

  async eliminarTutor(idTutor: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este tutor?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.tutorService.deleteTutor(idTutor);
        this.tutores = this.tutores.filter(tutor => tutor.id !== idTutor);
        Alerts.saveAlert('Eliminado', 'El tutor ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el tutor';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.loadTutores();
    }
  }
}
