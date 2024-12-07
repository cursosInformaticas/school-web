import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Aula } from '@models/aula-model';
import { AulaService } from '@services/aula.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditAulaComponent } from '../add-edit-aula/add-edit-aula.component';

@Component({
  selector: 'app-list-aula',
  standalone: true,
  imports: [CommonModule, AddEditAulaComponent],
  templateUrl: './list-aula.component.html',
  styleUrl: './list-aula.component.css'
})
export class ListAulaComponent  implements OnInit {
  aulas: Aula[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  aulaToEdit: Aula | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor( private readonly aulaService: AulaService) { }

  ngOnInit(): void {
    this.loadAulas();
  }

  async loadAulas(): Promise<void> {
    try {

      const response = await this.aulaService.getAllAulas(this.page, this.size);
      this.aulas = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los aulas';
    }
  }


  agregarNuevoAula() {
    this.showModal = true;
    this.isEditing = false;
    this.aulaToEdit = {
      id: 0,
      nombre: '',
      capacidad: 0,

    };
  }

  editarAula(aula: Aula) {
    this.showModal = true;
    this.isEditing = true;
    this.aulaToEdit = {
      ...aula
    };
  }
  closeModal() {
    this.showModal = false;
    this.aulaToEdit = null;
  }


  async guardarNuevoAula(aula: Aula) {
    try {
      if (this.isEditing && this.aulaToEdit) {
        const updatedAula = await this.aulaService.updateAula(
          this.aulaToEdit.id,
          aula
        );
        const index = this.aulas.findIndex((a) => a.id === updatedAula.id);
        if (index !== -1) {
          this.aulas[index] = updatedAula;
        }
        Alerts.saveAlert('Aula', 'Actualizado exitosamente', 'success');
      } else {
        const nuevoAula = await this.aulaService.createAula({
          ...aula,
          id: undefined
        });
        this.aulas.push(nuevoAula);
        this.loadAulas();
        Alerts.saveAlert('Aula', 'Guardado exitosamente', 'success');
      }
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el alumno';
    }
  }

  async eliminarAula(idAula: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este aula?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.aulaService.deleteAula(idAula);
        this.aulas = this.aulas.filter(aula => aula.id !== idAula);
        Alerts.saveAlert('Eliminado', 'El aula ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el aula';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.loadAulas();
    }
  }
}
