import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GradoEscolar } from '@models/grado-escolar-model';
import { GaradoEscolarService } from '@services/grado-escolar.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditGradoEscolarComponent } from '../add-edit-grado-escolar/add-edit-grado-escolar.component';

@Component({
  selector: 'app-list-grado-escolar',
  standalone: true,
  imports: [CommonModule, AddEditGradoEscolarComponent],
  templateUrl: './list-grado-escolar.component.html',
  styleUrl: './list-grado-escolar.component.css'
})
export class ListGradoEscolarComponent  implements OnInit {
  gradoEscolares: GradoEscolar[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  gradoEscolarToEdit: GradoEscolar | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor( private readonly gradoEscolarService: GaradoEscolarService) { }

  ngOnInit(): void {
    this.loadGradoEscolars();
  }

  async loadGradoEscolars(): Promise<void> {
    try {

      const response = await this.gradoEscolarService.getAllGradoEscolars(this.page, this.size);
      this.gradoEscolares = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los gradoEscolares';
    }
  }


  agregarNuevoGradoEscolar() {
    this.showModal = true;
    this.isEditing = false;
    this.gradoEscolarToEdit = {
      id: 0,
      nombre: '',

    };
  }

  editarGradoEscolar(gradoEscolar: GradoEscolar) {
    this.showModal = true;
    this.isEditing = true;
    this.gradoEscolarToEdit = {
      ...gradoEscolar
    };
  }
  closeModal() {
    this.showModal = false;
    this.gradoEscolarToEdit = null;
  }


  async guardarNuevoGradoEscolar(gradoEscolar: GradoEscolar) {
    try {
      if (this.isEditing && this.gradoEscolarToEdit) {
        const updatedGradoEscolar = await this.gradoEscolarService.updateGradoEscolar(
          this.gradoEscolarToEdit.id,
          gradoEscolar
        );
        const index = this.gradoEscolares.findIndex((a) => a.id === updatedGradoEscolar.id);
        if (index !== -1) {
          this.gradoEscolares[index] = updatedGradoEscolar;
        }
        Alerts.saveAlert('GradoEscolar', 'Actualizado exitosamente', 'success');
      } else {
        const nuevoGradoEscolar = await this.gradoEscolarService.createGradoEscolar({
          ...gradoEscolar,
          id: undefined
        });
        this.gradoEscolares.push(nuevoGradoEscolar);
        this.loadGradoEscolars();
        Alerts.saveAlert('GradoEscolar', 'Guardado exitosamente', 'success');
      }
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el alumno';
    }
  }

  async eliminarGradoEscolar(idGradoEscolar: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este gradoEscolar?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.gradoEscolarService.deleteGradoEscolar(idGradoEscolar);
        this.gradoEscolares = this.gradoEscolares.filter(gradoEscolar => gradoEscolar.id !== idGradoEscolar);
        Alerts.saveAlert('Eliminado', 'El gradoEscolar ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el gradoEscolar';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.loadGradoEscolars();
    }
  }
}

