export function formataNumeroMoeda(numero: number) {
    const formatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numero);

    return formatado
}