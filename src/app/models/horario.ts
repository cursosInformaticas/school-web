import { Asignatura } from "./asignatura";
import { Aula } from "./aula-model";

export interface Horario {
  id?: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  asignatura?: Partial<Asignatura>;
  aula?: Partial<Aula>;
}
