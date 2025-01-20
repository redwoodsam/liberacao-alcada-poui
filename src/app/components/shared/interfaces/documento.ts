export interface Documento {
    id: string,
    tipoDocumento: string,
    codUsuario: string,
    codAprovador: string,
    grpAprov: string,
    dataEmissao: string,
    valorTotal: number,
    moeda?: string,
    dataLiberacao?: string,
    prazo?: string,
    aviso?: string,
    tipoCompra?: string,
    status: string,
    itens?: Array<ItemDocumento>,
    historico?: HistoricoDocumento[]
}

export interface ItemDocumento {
    id: string,
    produto: string,
    descricao: string,
    quantidadeUm1: number,
    um1: string,
    quantidadeUm2?: number,
    um2?: string,
    valorUnitario?: number,
    dataEntrega?: string,
    observacao?: string
    valorTotal?: number,
    solicitante?: string,
    centroCusto?: string,
    contaContabil?: string,
    necessidade?: string,
    status: string,
    os?: string,
}

export interface HistoricoDocumento {
    item: string;
    nivel: string;
    aprovador: string;
    situacao: string;
    dataLiberacao: string;
    observacoes: string;
}