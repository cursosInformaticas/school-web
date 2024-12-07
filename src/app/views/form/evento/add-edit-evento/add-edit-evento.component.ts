import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '@models/alumno';
import { Evento } from '@models/evento-model';
import { Maestro } from '@models/maestro-model';
import { AlumnoService } from '@services/alumno.service';
import { MaestroService } from '@services/maestro.service';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-add-edit-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-edit-evento.component.html',
  styleUrl: './add-edit-evento.component.css'
})
export class AddEditEventoComponent  implements OnInit, OnChanges{

  @Input() evento: Evento = {
    nombre: '',
    fecha: '',
    descripcion: '',
    maestros: [],
    alumnos: []
  };

  @Output() save = new EventEmitter<Evento>();
  @Output() cancelAction = new EventEmitter<void>();

  maestros: Maestro[] = [];
  alumnos: Alumno[] = [];
  selectedAlumnos: Set<number> = new Set();
  selectedMaestros: Set<number> = new Set();

  errorMessage: string = '';
  cursoForm: FormGroup;
  page: number = 0;
  size: number = 100;
  totalPages: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly alumnoService: AlumnoService,
    private readonly maestroService: MaestroService
  ) {  }

  ngOnInit() {
    this.cargarMaestros();
    this.cargarAlumnos();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['evento'] && this.evento) {
      this.initializeForm();
      this.setSelectedAlumnos();
      this.setSelectedMaestros()
    }
  }

  initializeForm(): void {
    this.cursoForm = this.fb.group({
      nombre: [this.evento.nombre, Validators.required],
      fecha: [this.evento.fecha, Validators.required],
      descripcion: [this.evento.descripcion, Validators.required],
      maestros: [[]],
      alumnos: [[]]
    });
  }

  setSelectedAlumnos() {
    this.selectedAlumnos = new Set(this.evento.alumnos.map(alumno => alumno.id));
  }

  setSelectedMaestros() {
    this.selectedMaestros = new Set(this.evento.maestros.map(maestro => maestro.id));
  }

  toggleSeleccion(alumnoId: number) {
    if (this.selectedAlumnos.has(alumnoId)) {
      this.selectedAlumnos.delete(alumnoId);
    } else {
      this.selectedAlumnos.add(alumnoId);
    }
    this.evento.alumnos = Array.from(this.selectedAlumnos).map(id =>
      this.alumnos.find(alumno => alumno.id === id) as Alumno
    );
  }

  toggleSeleccionMaestro(maestroId: number) {
    if (this.selectedMaestros.has(maestroId)) {
      this.selectedMaestros.delete(maestroId);
    } else {
      this.selectedMaestros.add(maestroId);
    }
    this.evento.maestros = Array.from(this.selectedMaestros).map(id =>
      this.maestros.find(maestro => maestro.id === id) as Maestro
    );
  }

  esAlumnoSeleccionado(alumnoId: number): boolean {
    return this.selectedAlumnos.has(alumnoId);
  }

  esMaestroSeleccionado(maestroId: number): boolean {
    return this.selectedMaestros.has(maestroId);
  }

  onSubmit() {
    if (this.cursoForm.valid) {
      const formData = this.cursoForm.value;
      const newEvento: Evento = {
        ...this.evento,
        nombre: formData.nombre,
        fecha: formData.fecha,
        descripcion: formData.descripcion,
        maestros: Array.from(this.selectedMaestros).map(id => {
          const maestroCompleto = this.maestros.find(maestro => maestro.id === id);
          return maestroCompleto ? { ...maestroCompleto } : { id, nombre: '', apellido: '', especialidad: '' };
        }),
        alumnos: Array.from(this.selectedAlumnos).map(id => {
          const alumnoCompleto = this.alumnos.find(alumno => alumno.id === id);
          return alumnoCompleto ? { ...alumnoCompleto } : { id, nombre: '', apellido: '', email: '', hasDependencies: false };
        })
      };

      console.log("Evento a guardar:", newEvento);
      this.save.emit(newEvento);
    }
  }

  cancel() {
    this.cancelAction.emit();
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
    return this.evento.id > 0;
  }
}
