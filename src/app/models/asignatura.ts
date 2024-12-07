import { Curso } from "./curso-model";

export interface Asignatura {
  id?: number;
  nombre: string;
  descripcion: string;
  curso?: Partial<Curso>;
}
