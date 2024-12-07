import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Asignatura } from '@models/asignatura';
import { Aula } from '@models/aula-model';
import { Horario } from '@models/horario';
import { AsignaturaService } from '@services/asignatura.service';
import { AulaService } from '@services/aula.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-horario',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-horario.component.html',
  styleUrl: './add-edit-horario.component.css'
})
export class AddEditHorarioComponent implements OnInit, OnChanges{
  @Input() horario: Horario = { id: 0, diaSemana: '', horaInicio: '',horaFin: '', asignatura: null, aula: null };
  @Input() asignaturas: Asignatura[] = [];
  @Input() aulas: Aula[] = [];
   @Output() save = new EventEmitter<Horario>();
   @Output() cancelAction = new EventEmitter<void>();

   page: number = 0;
   size: number = 100;
   totalPages: number = 0;

   constructor(  private readonly asignaturaService: AsignaturaService,
    private readonly aulaService: AulaService
   ) {}

   ngOnInit(): void {
     this.loadAsignaturas();
     this.loadAula();
   }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['horario']) {
      if (this.asignaturas.length > 0) {
        this.setAsignaturaSeleccionado();
      }else {
        console.log('La lista de aulas aún no está cargada.');
      }
    }
  }

  async loadAula(): Promise<void> {
    try {
      const response = await this.aulaService.getAllAulas(this.page, this.size);
      this.aulas = response.data;

      console.log('Aulas cargados:', this.aulas);

      if (this.horario.aula) {
        this.setAulaSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los aulas', error);
    }
  }



  async loadAsignaturas(): Promise<void> {
    try {
      const response = await this.asignaturaService.getAllAsignaturas(this.page, this.size);
      this.asignaturas = response.data;
      if (this.horario.asignatura) {
        this.setAsignaturaSeleccionado();
      }
    } catch (error) {
      console.error('Error al cargar los asignaturas', error);
    }
  }

  setAsignaturaSeleccionado(): void {
    if (this.horario.asignatura?.id) {
      const matchedAsignatura = this.asignaturas.find(asignatura => asignatura.id === this.horario.asignatura?.id);
      if (matchedAsignatura) {
        this.horario.asignatura = matchedAsignatura;
      } else {
        this.horario.asignatura = null;
      }
    }
  }

  setAulaSeleccionado(): void {
    if (this.horario.aula?.id) {
      console.log('Buscando aula con ID:', this.horario.aula.id);
      console.log('Lista de aulas cargados:', this.aulas);

      const matchedAula = this.aulas.find(aula => aula.id === this.horario.aula?.id);

      if (matchedAula) {
        console.log('Aula encontrado:', matchedAula);
        this.horario.aula = matchedAula;
      } else {
        console.log('No se encontró un aula con el ID especificado.');
        this.horario.aula = null;
      }
    } else {
      console.log('No hay aula asignado en horario.');
    }
  }


  onSubmit(): void {
    // Validar que horaFin sea mayor que horaInicio
    if (this.horario.horaInicio && this.horario.horaFin && this.horario.horaInicio >= this.horario.horaFin) {
      alert('La hora de fin debe ser mayor que la hora de inicio');
      return;
    }

    // Crear un nuevo objeto excluyendo `id` si es 0
    const { id, ...horarioData } = this.horario;
    const horarioToSave: Horario = {
      ...(id !== 0 ? { id } : {}), // Solo incluir `id` si no es 0
      ...horarioData,
      asignatura: { id: this.horario.asignatura?.id }, // Solo ID de la asignatura
      aula: { id: this.horario.aula?.id }, // Solo ID del aula
    };

    // Emitir los datos procesados
    this.save.emit(horarioToSave);
  }

  get isEdit(): boolean {
    return this.horario.id > 0;
  }

   cancel() {
     this.cancelAction.emit();
   }
 }

