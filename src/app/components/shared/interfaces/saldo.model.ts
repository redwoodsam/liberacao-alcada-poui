export interface SaldoModel {
    Usuario: UsuarioSaldo;
    Itens: any[];
    PcoAtivo: boolean;
}

export interface SaldoSemPco {
    limite: number;
    tipoLimite: string;
    moeda: string;
    limiteMin: number;
    limiteMax: number;
    saldo: number;
    dataSaldo: string;
}

export interface SaldoPco {
    filial: string;
    centroCusto: string;
    descricao: string;
    saldos: Saldo[];
}

interface Saldo {
    filial: string;
    codContaContabil: string;
    descricaoConta: string;
    valorOrcado: number;
    valorRealizado: number;
    dataOrcamento: string;
    dataUltimaAtualizacaoRealizado: string;
}

export interface UsuarioSaldo {
    cod: string;
    nome: string;
    login: string;
    codUsuario: string;
    codSuperior: string;
}