import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { Curso } from '@models/curso-model';
import { Evento } from '@models/evento-model';
import { Maestro } from '@models/maestro-model';
import { AlumnoService } from '@services/alumno.service';
import { CursoService } from '@services/curso.service';
import { EventoService } from '@services/evento.service';
import { MaestroService } from '@services/maestro.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  cursos: Curso[] = [];
  alumnos: Alumno[] = [];
  maestros: Maestro[] = []; 
  eventos: Evento[] = [];
  errorMessage: string = '';
  selectedAnioEscolar: number | null = new Date().getFullYear();
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  totalRecordsAlumnos: number = 0;
  totalRecordsCursos: number = 0;
  totalRecordsMaestros: number = 0;
  totalRecordsEventos: number = 0;

constructor(    private readonly alumnoService: AlumnoService,
  private readonly cursoService: CursoService,
  private readonly maestroService: MaestroService,
  private readonly eventoService: EventoService
) {
  }

  ngOnInit(): void {
     this.getAlumnos();
     this.getCursos();
     this.getMaestros();
     this.getEventos();
  }  


  async getAlumnos(): Promise<void> {
    try {
      const response = await this.alumnoService.getAllAlumnos(
        this.page,
        this.size,
      );
      console.log('Datos recibidos:', response);
      this.alumnos = response.data;
      this.totalRecordsAlumnos  = response.meta.totalRecords;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
  
      console.log(`Total de páginas: ${this.totalPages}`);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
      this.errorMessage = 'Ocurrió un error al obtener la lista de alumnos';
    }
  }

  async getCursos(): Promise<void> {
    try {
      const response = await this.cursoService.getAllCursos(this.page, this.size);
      this.cursos = response.data;
      this.totalRecordsCursos = response.meta.totalRecords;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los tutores';
    }
  }

  async getMaestros(): Promise<void> {
    try {
      const response = await this.maestroService.getAllMaestros(this.page, this.size);
      this.maestros = response.data;
      this.totalRecordsMaestros = response.meta.totalRecords;
    } catch (error) {
      console.error('Error al obtener los maestros:', error);
      this.errorMessage = 'Ocurrió un error al cargar los maestros';
    }
  }

  async getEventos(): Promise<void> {
    try {
      const response = await this.eventoService.getAllEventos(this.page, this.size);
      this.eventos = response.data;
      this.totalRecordsEventos = response.meta.totalRecords;
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      this.errorMessage = 'Ocurrió un error al cargar los eventos';
    }
  }
}
