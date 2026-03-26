import {
  VIEWBOX_TERRA_VISTA_REAL,
  GEOMETRIA_TERRA_VISTA_REAL,
} from "./real";

import { RUAS_TERRA_VISTA } from "./ruas";
import { AREAS_TERRA_VISTA } from "./areas";

export const MAPA_TERRA_VISTA = {
  key: "terravista",
  nome: "Terra Vista",
  fonte: "real",
  viewBox: VIEWBOX_TERRA_VISTA_REAL,
  lotes: GEOMETRIA_TERRA_VISTA_REAL,

  // 👇 adiciona isso
  ruas: RUAS_TERRA_VISTA,
  areas: AREAS_TERRA_VISTA,
};