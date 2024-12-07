import { Asignatura } from "./asignatura";

export interface Examen {
  id?: number;
  nombre: string;
  fecha: string;
  asignatura?: Partial<Asignatura>;
}
