import { Alumno } from "./alumno";
import { GradoEscolar } from "./grado-escolar-model";
import { Maestro } from "./maestro-model";

export interface Curso {
  id?: number;
  nombre: string;
  descripcion: string;
  gradoEscolar?: GradoEscolar | null;
  maestro?: Maestro | null;
  alumnos?: Alumno[];
}
