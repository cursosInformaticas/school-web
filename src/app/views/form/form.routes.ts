import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListComponent } from "./alumno/list/list.component";
import { ListTutorComponent } from "./tutor/list/list.component";
import { ListCursoComponent } from "./curso/list-curso/list-curso.component";
import { ListMaestroComponent } from "./maestro/list-maestro/list-maestro.component";
import { ListAulaComponent } from "./aula/list-aula/list-aula.component";
import { ListGradoEscolarComponent } from "./grado/list-grado-escolar/list-grado-escolar.component";
import { ListAsignaturaComponent } from "./asignatura/list-asignatura/list-asignatura.component";
import { ListAsistenciaComponent } from "./asistencia/list-asistencia/list-asistencia.component";
import { ListHorarioComponent } from "./horario/list-horario/list-horario.component";
import { ListExamenComponent } from "./examen/list-examen/list-examen.component";
import { ListCalificaionComponent } from "./calificacion/list-calificacion/list-calificacion.component";
import { ListEventoComponent } from "./evento/list-evento/list-evento.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const pagesRoutes: Routes = [
  { path: 'initial', component: DashboardComponent },
  { path: 'alumnos', component: ListComponent },
  { path: 'tutores', component: ListTutorComponent },
  { path: 'cursos', component: ListCursoComponent },
  { path: 'maestros', component: ListMaestroComponent },
  { path: 'aulas', component: ListAulaComponent },
  { path: 'grado-escolares', component: ListGradoEscolarComponent },
  { path: 'asignaturas', component: ListAsignaturaComponent },
  { path: 'asistencias', component: ListAsistenciaComponent },
  { path: 'horarios', component: ListHorarioComponent },
  { path: 'examenes', component: ListExamenComponent },
  { path: 'calificaciones', component: ListCalificaionComponent },
  { path: 'evento-escolares', component: ListEventoComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(pagesRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
