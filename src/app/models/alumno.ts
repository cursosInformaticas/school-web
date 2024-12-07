import { Tutor } from "./tutor";

export interface Alumno {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  tutor?: Partial<Tutor>;
  anioEscolar?: { id: number; anio?: number };
  hasDependencies : boolean;
}
