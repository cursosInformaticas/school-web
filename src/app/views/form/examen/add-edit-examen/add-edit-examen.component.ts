import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Asignatura } from '@models/asignatura';
import { Examen } from '@models/examen';
import { AsignaturaService } from '@services/asignatura.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-examen',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-examen.component.html',
  styleUrl: './add-edit-examen.component.css'
})
export class AddEditExamenComponent implements OnInit, OnChanges{
  @Input() examen: Examen = { id: 0, nombre: '', fecha: '', asignatura: null };
  @Input() asignaturas: Asignatura[] = [];
   @Output() save = new EventEmitter<Examen>();
   @Output() cancelAction = new EventEmitter<void>();

   page: number = 0;
   size: number = 100;
   totalPages: number = 0;

   constructor(  private readonly asignaturaService: AsignaturaService
   ) {}

   ngOnInit(): void {
     this.loadAsignaturas();
   }

   ngOnChanges(changes: SimpleChanges) {
    // Si los asignaturas ya están cargados, asigna el asignatura seleccionado
    if (changes['examen'] && this.examen && this.asignaturas.length > 0) {
      this.setAsignaturaSeleccionado();
    }
  }

   async loadAsignaturas(): Promise<void> {
    try {
   const response = await this.asignaturaService.getAllAsignaturas(this.page, this.size);
   this.asignaturas = response.data;
   this.setAsignaturaSeleccionado();
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      console.error('Error al cargar los asignaturas', error);
    }
  }

  setAsignaturaSeleccionado(): void {
    if (this.examen.asignatura?.id) {
      this.examen.asignatura = this.asignaturas.find(asignatura => asignatura.id === this.examen.asignatura?.id) || null;
    }
  }

   onSubmit() {
     const { id, ...examenData } = this.examen;
     examenData.asignatura = { id: this.examen.asignatura?.id };
     this.save.emit(examenData);
   }

   get isEdit(): boolean {
    return this.examen.id > 0;
  }
   cancel() {
     this.cancelAction.emit();
   }
 }
