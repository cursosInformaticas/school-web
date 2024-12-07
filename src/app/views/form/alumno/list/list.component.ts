import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Alumno } from '@models/alumno';
import { AlumnoService } from '@services/alumno.service';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { TutorService } from '@services/tutor.service';
import { Tutor } from '@models/tutor';
import { Alerts } from 'src/app/material/alets-global';
import { AnioEscolar } from '@models/anio-escolar';
import { AnioEscolarService } from '@services/anio-escolar.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseWithMeta } from 'src/app/helpers/api-response-meta';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, AddEditComponent, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  alumnos: Alumno[] = [];
  tutores: Tutor[] = [];
  aniosEscolares: AnioEscolar[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  alumnoToEdit: Alumno | null = null;
  selectedAnioEscolar: number | null = new Date().getFullYear();

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly tutorService: TutorService,
    private readonly anioEscolarService: AnioEscolarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.page = params['page'] ? parseInt(params['page'], 10) : 0;
      this.size = params['size'] ? parseInt(params['size'], 10) : 5;
      this.selectedAnioEscolar =
        params['anio'] && !isNaN(Number(params['anio']))
          ? Number(params['anio'])
          : new Date().getFullYear();
      await this.getAlumnos();
    });
    this.loadTutores();
    this.loadAniosEscolares();
  }

  async getAlumnos(): Promise<void> {
    try {
      console.log(
        `Cargando alumnos: Página ${this.page}, Tamaño ${this.size}, Año ${this.selectedAnioEscolar}`
      );

      const response = await this.alumnoService.getAllAlumnos(
        this.page,
        this.size,
        this.selectedAnioEscolar ?? undefined
      );

      console.log('Datos recibidos:', response);
      this.alumnos = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);

      console.log(`Total de páginas: ${this.totalPages}`);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
      this.errorMessage = 'Ocurrió un error al obtener la lista de alumnos';
    }
  }

  async loadTutores(): Promise<void> {
    try {
      const response = await this.tutorService.getAllTutores(
        this.page,
        this.size
      );
      this.tutores = response.data;
      this.totalPages = Math.ceil(response.meta.totalRecords / this.size);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al cargar los tutores';
    }
  }
  agregarNuevoAlumno() {
    this.showModal = true;
    this.isEditing = false;
    this.alumnoToEdit = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      tutor: null,
      anioEscolar: null,
      hasDependencies: false,
    };
  }

  editarAlumno(alumno: Alumno) {
    this.showModal = true;
    this.isEditing = true;
    this.alumnoToEdit = {
      ...alumno,
      tutor: this.getTutorById(alumno.tutor?.id) || null,
      anioEscolar: alumno.anioEscolar?.id
        ? { id: alumno.anioEscolar.id, anio: alumno.anioEscolar.anio }
        : null,
    };
  }
  closeModal() {
    this.showModal = false;
    this.alumnoToEdit = null;
  }

  async guardarNuevoAlumno(alumno: Alumno): Promise<void> {
    try {
      let response: ApiResponseWithMeta<Alumno>;

      if (this.isEditing && this.alumnoToEdit) {
        response = await this.alumnoService.updateAlumno(
          this.alumnoToEdit.id,
          alumno
        );
        const index = this.alumnos.findIndex((a) => a.id === response.data.id);
        if (index !== -1) {
          response.data.tutor = this.getTutorById(response.data.tutor?.id);
          this.alumnos[index] = response.data;
        }
        Alerts.saveAlert('Alumno', response.meta.message, 'success');
      } else {
        response = await this.alumnoService.createAlumno(alumno);
        response.data.tutor = this.getTutorById(response.data.tutor?.id);
        this.alumnos.push(response.data);
        await this.getAlumnos();
        await this.loadTutores();
        Alerts.saveAlert('Alumno', response.meta.message, 'success');
      }
      this.closeModal();
    } catch (error: any) {
      if (error.meta && error.meta.message) {
        this.errorMessage = error.meta.message;
        Alerts.saveAlert('Error', error.meta.message, 'error');
      } else {
        this.errorMessage = 'Ocurrió un error al guardar el alumno';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  getTutorById(id: number | undefined): Tutor | undefined {
    return this.tutores.find((tutor) => tutor.id === id);
  }

  async eliminarAlumno(idAlumno: number): Promise<void> {
    const result = await Alerts.confirmDeleteAlert(
      '¿Está seguro?',
      '¿Está seguro de que desea eliminar este alumno?',
      'warning',
      'Sí, eliminar'
    );
    if (result.isConfirmed) {
      try {
        await this.alumnoService.deleteAlumno(idAlumno);
        this.alumnos = this.alumnos.filter((alumno) => alumno.id !== idAlumno);
        Alerts.saveAlert(
          'Eliminado',
          'El alumno ha sido eliminado exitosamente',
          'success'
        );
      } catch (error) {
        this.errorMessage = 'Ocurrió un error al eliminar el alumno';
        Alerts.saveAlert('Error', this.errorMessage, 'error');
      }
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.page = pagina;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: this.page,
          size: this.size,
          anio: this.selectedAnioEscolar ?? undefined,
        },
        queryParamsHandling: 'merge',
      });
      this.getAlumnos();
    }
  }

  async loadAniosEscolares(): Promise<void> {
    try {
      const response = await this.anioEscolarService.getAllAniosEscolares();
      console.log('Años escolares cargados:', response.data);
      this.aniosEscolares = response.data;
    } catch (error) {
      console.error('Error al cargar los años escolares', error);
      this.errorMessage = 'Ocurrió un error al cargar los años escolares';
    }
  }

  onAnioEscolarChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedAnioEscolar =
      value && !isNaN(Number(value)) ? Number(value) : null;
    this.page = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        size: this.size,
        anio: this.selectedAnioEscolar ?? undefined,
      },
      queryParamsHandling: 'merge',
    });

    this.getAlumnos();
  }
}
