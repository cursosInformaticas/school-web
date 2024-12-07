import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { Curso } from '@models/curso-model';
import { GradoEscolar } from '@models/grado-escolar-model';
import { Maestro } from '@models/maestro-model';
import { AlumnoService } from '@services/alumno.service';
import { GaradoEscolarService } from '@services/grado-escolar.service';
import { MaestroService } from '@services/maestro.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-curso',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-edit-curso.component.html',
  styleUrl: './add-edit-curso.component.css'
})
export class AddEditCursoComponent  implements OnInit, OnChanges{

  @Input() curso: Curso = {
    nombre: '',
    descripcion: '',
    gradoEscolar: null,
    maestro: null,
    alumnos: []
  };

  @Output() save = new EventEmitter<Curso>();
  @Output() cancelAction = new EventEmitter<void>();

  gradoEscolares: GradoEscolar[] = [];
  maestros: Maestro[] = [];
  alumnos: Alumno[] = [];
  selectedAlumnos: Set<number> = new Set();

  errorMessage: string = '';
  cursoForm: FormGroup;
  page: number = 0;
  size: number = 100;
  totalPages: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly alumnoService: AlumnoService,
    private readonly maestroService: MaestroService,
    private readonly gradoEscolarService: GaradoEscolarService
  ) {  }

  ngOnInit() {
    this.cargarGradosEscolares();
    this.cargarMaestros();
    this.cargarAlumnos();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['curso'] && this.curso) {
      this.initializeForm();
      this.setSelectedAlumnos();
    }
  }

  initializeForm(): void {
    this.cursoForm = this.fb.group({
      nombre: [this.curso.nombre, Validators.required],
      descripcion: [this.curso.descripcion, Validators.required],
      gradoEscolar: [this.curso.gradoEscolar ? this.curso.gradoEscolar.id : null, Validators.required],
      maestro: [this.curso.maestro ? this.curso.maestro.id : null, Validators.required],
      alumnos: [[]]
    });
  }

  setSelectedAlumnos() {
    this.selectedAlumnos = new Set(this.curso.alumnos.map(alumno => alumno.id));
  }

  toggleSeleccion(alumnoId: number) {
    if (this.selectedAlumnos.has(alumnoId)) {
      this.selectedAlumnos.delete(alumnoId);
    } else {
      this.selectedAlumnos.add(alumnoId);
    }
    this.curso.alumnos = Array.from(this.selectedAlumnos).map(id =>
      this.alumnos.find(alumno => alumno.id === id) as Alumno
    );
  }

  esAlumnoSeleccionado(alumnoId: number): boolean {
    return this.selectedAlumnos.has(alumnoId);
  }

  onSubmit() {
    if (this.cursoForm.valid) {
      const formData = this.cursoForm.value;
      const newCurso: Curso = {
        ...this.curso,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        gradoEscolar: formData.gradoEscolar ? { id: formData.gradoEscolar, nombre: '' } : null,
        maestro: formData.maestro ? { id: formData.maestro, nombre: '', apellido: '', especialidad: '' } : null,
        alumnos: Array.from(this.selectedAlumnos).map(id => {
          const alumnoCompleto = this.alumnos.find(alumno => alumno.id === id);
          return alumnoCompleto ? { ...alumnoCompleto } : { id, nombre: '', apellido: '', email: '', hasDependencies: false };
        })
      };

      console.log("Curso a guardar:", newCurso);
      this.save.emit(newCurso);
    }
  }

  cancel() {
    this.cancelAction.emit();
  }

  async cargarGradosEscolares(): Promise<void> {
    try {

      const response = await this.gradoEscolarService.getAllGradoEscolars(this.page, this.size);
      this.gradoEscolares = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los gradoEscolares';
    }
  }

  async cargarMaestros(): Promise<void> {
    try {

      const response = await this.maestroService.getAllMaestros(this.page, this.size);
      this.maestros = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);


    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los maestros';
    }
  }
  async cargarAlumnos(): Promise<void> {
    try {
      const response = await this.alumnoService.getAllAlumnos(this.page, this.size);
      this.alumnos = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
      for (let alumno of this.alumnos) {
        alumno.hasDependencies = await this.alumnoService.hasDependencies(alumno.id);
      }
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al obtener la lista de alumnos';
    }
  }
  get isEdit(): boolean {
    return this.curso.id > 0;
  }
}
