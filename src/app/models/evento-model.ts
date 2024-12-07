import { Alumno } from "./alumno";
import { Maestro } from "./maestro-model";

export interface Evento {
  id?: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  maestros?: Maestro[];
  alumnos?: Alumno[];
}
