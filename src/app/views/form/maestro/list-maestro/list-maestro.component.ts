import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Maestro } from '@models/maestro-model';
import { MaestroService } from '@services/maestro.service';
import { Alerts } from 'src/app/material/alets-global';
import { AddEditMaestroComponent } from '../add-edit-maestro/add-edit-maestro.component';

@Component({
  selector: 'app-list-maestro',
  standalone: true,
  imports: [CommonModule,AddEditMaestroComponent],
  templateUrl: './list-maestro.component.html',
  styleUrl: './list-maestro.component.css'
})
export class ListMaestroComponent implements OnInit {
  maestros: Maestro[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  maestroToEdit: Maestro | null = null;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor( private readonly maestroService: MaestroService) { }

  ngOnInit(): void {
    this.loadMaestros();
  }

  async loadMaestros(): Promise<void> {
    try {

      const response = await this.maestroService.getAllMaestros(this.page, this.size);
      this.maestros = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los maestros';
    }
  }


  agregarNuevoMaestro() {
    this.showModal = true;
    this.isEditing = false;
    this.maestroToEdit = {
      id: 0,
      nombre: '',
      apellido: '',
      especialidad: '',

    };
  }

  editarMaestro(maestro: Maestro) {
    this.showModal = true;
    this.isEditing = true;
    this.maestroToEdit = {
      ...maestro
    };
  }
  closeModal() {
    this.showModal = false;
    this.maestroToEdit = null;
  }


  async guardarNuevoMaestro(maestro: Maestro) {
    try {
      if (this.isEditing && this.maestroToEdit) {
        const updatedMaestro = await this.maestroService.updateMaestro(
          this.maestroToEdit.id,
          maestro
        );
        const index = this.maestros.findIndex((a) => a.id === updatedMaestro.id);
        if (index !== -1) {
          this.maestros[index] = updatedMaestro;
        }
        Alerts.saveAlert('Maestro', 'Actualizado exitosamente', 'success');
      } else {
        const nuevoMaestro = await this.maestroService.createMaestro({
          ...maestro,
          id: undefined
        });
        this.maestros.push(nuevoMaestro);
        this.loadMaestros();
        Alerts.saveAlert('Maestro', 'Guardado exitosamente', 'success');
      }
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el alumno';
    }
  }

  async eliminarMaestro(idMaestro: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este maestro?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.maestroService.deleteMaestro(idMaestro);
        this.maestros = this.maestros.filter(maestro => maestro.id !== idMaestro);
        Alerts.saveAlert('Eliminado', 'El maestro ha sido eliminado exitosamente', 'success');
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el maestro';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.loadMaestros();
    }
  }
}
