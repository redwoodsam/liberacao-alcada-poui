import { Documento } from "./documento";

export interface DocumentosServiceModel {
    items: Documento[],
    hasNext: boolean
}