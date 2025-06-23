export interface Documento {
    filial: string,
    id: string,
    doc: string,
    tipo: string,
    codUsuario: string,
    codAprovador?: string,
    grpAprov?: string,
    dataEmissao: string,
    valorTotal: number,
    moeda?: string,
    dataLiberacao?: string,
    prazo?: string,
    aviso?: string,
    tipoCompra?: string,
    status: string,
    Itens?: Array<ItemDocumento>,
    Liberacao?: HistoricoDocumento[],
    obs?: string
}

export interface ItemDocumento {
    item: string,
    id?: string,
    doc: string,
    produto: string,
    descricao: string,
    quantidadeUm1: number,
    um: string,
    valorUnitario?: number,
    dataEntrega?: string,
    observacao?: string
    valorTotal?: number,
    solicitante?: string,
    centroCusto?: string,
    necessidade?: string,
    status: string,
}

export interface HistoricoDocumento {
    item?: string;
    nivel: string;
    aprovador: string;
    situacao: string;
    status: string;
    msg: string;
    dataLiberacao?: string;
    observacoes?: string;
}