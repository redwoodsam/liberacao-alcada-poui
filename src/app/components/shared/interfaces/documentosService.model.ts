import { Documento } from "./documento";

export interface DocumentosServiceModel {
    Itens: Documento[],
    hasNext: boolean,
}