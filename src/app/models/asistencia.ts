import { Alumno } from "./alumno";
import { Curso } from "./curso-model";

export interface Asistencia {
  id?: number;
  fecha: string;
  presente: boolean;
  curso?: Partial<Curso>;
  alumno?: Partial<Alumno>;
}
