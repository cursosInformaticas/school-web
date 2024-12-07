import { Alumno } from "./alumno";
import { Examen } from "./examen";

export interface Calificacion {
  id?: number;
  puntaje: number;
  examen?: Partial<Examen>;
  alumno?: Partial<Alumno>;
}
