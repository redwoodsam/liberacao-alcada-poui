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
    itens?: Array<ItemDocumento>
    detalhes?: Array<ItemDocumento>
}

export interface ItemDocumento {
    id: string,
    produto: string,
    descricao: string,
    quantidadeUm1: number,
    um1: string,
    quantidadeUm2: number,
    um2: string,
    solicitante: string,
    centroCusto: string,
    contaContabil: string,
    observacoes: string,
    necessidade: Date,
    status: string,
    os: string,
}