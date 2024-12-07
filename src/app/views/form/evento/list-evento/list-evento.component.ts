import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  ShowEventoComponent } from '../show-evento/show-evento.component';
import { AddEditEventoComponent } from '../add-edit-evento/add-edit-evento.component';
import { Evento } from '@models/evento-model';
import { EventoService } from '@services/evento.service';

@Component({
  selector: 'app-list-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddEditEventoComponent,ShowEventoComponent],
  templateUrl: './list-evento.component.html',
  styleUrl: './list-evento.component.css'
})
export class ListEventoComponent implements OnInit {

  eventos: Evento[] = [];
  errorMessage: string = '';
  eventoToEdit: Evento | null = null;
  showModal: boolean = false;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedEvento: Evento | null = null;
  showDetalleModal: boolean = false;

  constructor(private readonly eventoService: EventoService) { }

  ngOnInit(): void {
    this.getEventos();
  }

  async getEventos(): Promise<void> {
    try {
      const response = await this.eventoService.getAllEventos(this.page, this.size);
      this.eventos = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los tutores';
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getEventos();
    }
  }

  agregarNuevoEvento() {
    this.showModal = true;
    this.eventoToEdit = {
      nombre: '',
      fecha: '',
      descripcion: '',
      maestros: [],
      alumnos: []
    };
  }
  editarEvento(evento: Evento) {
    this.showModal = true;
    this.eventoToEdit = { ...evento };
  }

  closeModal() {
    this.showModal = false;
    this.eventoToEdit = null;
  }

  async guardarNuevoEvento(evento: Evento) {
    try {
      if (evento.id) {
        // Actualizar evento existente
        await this.eventoService.updateEvento(evento.id, evento);
      } else {
        // Crear un nuevo evento
        await this.eventoService.createEvento(evento);
      }
      this.getEventos();
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el evento';
    }
  }


  verDetalle(evento: Evento) {
    this.selectedEvento = evento;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedEvento = null;
    this.showDetalleModal = false;
  }
}
