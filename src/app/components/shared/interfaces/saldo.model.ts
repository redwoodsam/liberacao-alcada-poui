export interface Saldo {
    codAprovador: string;
    codUsuario: string;
    nome: string;
    superior: {
        codUsuario: string;
        nome: string;
    };
    limite: number;
    moeda: string;
    perLimite: string;
    login: string;
    saldo: {
        valor: number;
        dataRef: string;
        moeda: string;
    }
}