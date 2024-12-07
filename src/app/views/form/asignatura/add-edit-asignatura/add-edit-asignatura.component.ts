import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Asignatura } from '@models/asignatura';
import { Curso } from '@models/curso-model';
import { CursoService } from '@services/curso.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-asignatura',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './add-edit-asignatura.component.html',
  styleUrl: './add-edit-asignatura.component.css'
})
export class AddEditAsignaturaComponent implements OnInit, OnChanges{
  @Input() asignatura: Asignatura = { id: 0, nombre: '', descripcion: '', curso: null };
  @Input() cursos: Curso[] = [];
   @Output() save = new EventEmitter<Asignatura>();
   @Output() cancelAction = new EventEmitter<void>();

   page: number = 0;
   size: number = 100;
   totalPages: number = 0;

   constructor(  private readonly cursoService: CursoService
   ) {}

   ngOnInit(): void {
     this.loadCursos();
   }

   ngOnChanges(changes: SimpleChanges) {
    // Si los cursos ya están cargados, asigna el curso seleccionado
    if (changes['asignatura'] && this.asignatura && this.cursos.length > 0) {
      this.setCursoSeleccionado();
    }
  }

   async loadCursos(): Promise<void> {
    try {
   const response = await this.cursoService.getAllCursos(this.page, this.size);
   this.cursos = response.data;
   this.setCursoSeleccionado();
   this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      console.error('Error al cargar los cursos', error);
    }
  }

  setCursoSeleccionado(): void {
    if (this.asignatura.curso?.id) {
      this.asignatura.curso = this.cursos.find(curso => curso.id === this.asignatura.curso?.id) || null;
    }
  }

   onSubmit() {
     const { id, ...asignaturaData } = this.asignatura;
     asignaturaData.curso = { id: this.asignatura.curso?.id };
     this.save.emit(asignaturaData);
   }

   get isEdit(): boolean {
    return this.asignatura.id > 0;
  }
   cancel() {
     this.cancelAction.emit();
   }
 }
