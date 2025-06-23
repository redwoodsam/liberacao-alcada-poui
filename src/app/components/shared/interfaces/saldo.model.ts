export interface SaldoModel {
    Itens: Saldo[];
}

export interface Saldo {
    cod: string;
    nome: string;
    login: string;
    codUsuario: string;
    codSuperior: number;
    limite: number;
    tipoLimite: string;
    moeda: string;
    limiteMin: number;
    limiteMax: number;
    saldo: number;
    dataSaldo: string;
}