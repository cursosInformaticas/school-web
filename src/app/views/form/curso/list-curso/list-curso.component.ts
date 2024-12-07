import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Curso } from '@models/curso-model';
import { CursoService } from '@services/curso.service';
import { AddEditCursoComponent } from '../add-edit-curso/add-edit-curso.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowCursoComponent } from '../show-curso/show-curso.component';

@Component({
  selector: 'app-list-curso',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddEditCursoComponent,ShowCursoComponent],
  templateUrl: './list-curso.component.html',
  styleUrl: './list-curso.component.css'
})
export class ListCursoComponent implements OnInit {

  cursos: Curso[] = [];
  errorMessage: string = '';
  cursoToEdit: Curso | null = null;
  showModal: boolean = false;

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  selectedCurso: Curso | null = null;
  showDetalleModal: boolean = false;

  constructor(private readonly cursoService: CursoService) { }

  ngOnInit(): void {
    this.getCursos();
  }

  async getCursos(): Promise<void> {
    try {
      const response = await this.cursoService.getAllCursos(this.page, this.size);
      this.cursos = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los tutores';
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.getCursos();
    }
  }

  agregarNuevoCurso() {
    this.showModal = true;
    this.cursoToEdit = {
      nombre: '',
      descripcion: '',
      gradoEscolar: null,
      maestro: null,
      alumnos: []
    };
  }
  editarCurso(curso: Curso) {
    this.showModal = true;
    this.cursoToEdit = { ...curso };
  }

  closeModal() {
    this.showModal = false;
    this.cursoToEdit = null;
  }

  async guardarNuevoCurso(curso: Curso) {
    try {
      if (curso.id) {
        // Actualizar curso existente
        await this.cursoService.updateCurso(curso.id, curso);
      } else {
        // Crear un nuevo curso
        await this.cursoService.createCurso(curso);
      }
      this.getCursos();
      this.closeModal();
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar el curso';
    }
  }


  verDetalle(curso: Curso) {
    this.selectedCurso = curso;
    this.showDetalleModal = true;
  }

  cerrarDetalle() {
    this.selectedCurso = null;
    this.showDetalleModal = false;
  }
}
