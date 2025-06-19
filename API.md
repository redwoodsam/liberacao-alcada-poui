
# Endpoints API Aprovação por alçada

## Listar Documentos
GET /documentos?search=0001&page=1&size=10&documentode=&documentoate=ZZZZZZ&emissaode=2025-01-20&emissaoate=2025-12-31&status=pendente

Response:
Status 200 - OK

Body:
```json
      "{
        "items": [
          {
            "id": "Documento",
            "tipoDocumento": "SA",
            "codUsuario": "Cód. Usuario",
            "codAprovador": "Cod. Aprovador",
            "grpAprov": "Grp. Aprov",
            "dataEmissao": "2025-01-10",
            "valorTotal": 1000.00,
            "dataLiberacao": " ",
            "prazo": "2025-01-10",
            "aviso": "Aviso",
            "tipoCompra": "Tipo Compra",
            "itens": [
              {
                "id": "1",
                "produto": "Produto 1",
                "descricao": "Descrição do produto 1",
                "quantidadeUm1": 10,
                "quantidadeUm2": 5,
                "valorUnitario": 100,
                "valorTotal": 500.00,
                "dataEntrega": "2025-01-15",
                "status": "pendente",
                "solicitante": "Fulano de tal",
                "centroCusto": "0102003",
                "contaContabil": "0101001",
                "necessidade": "2025-01-10",
                "os": "200OS",
                "observacao": "Observação do item 1",
                "um1": "unidade",
                "um2": "caixa"
              },"
            ],
            "status": "pendente",
            "historico": [
              {"item": "01", "nivel": "01", "aprovador": "Fulano 1", "situacao": "pendente", "dataLiberacao": "", "observacoes": "asdas"},
              {"item": "02", "nivel": "01", "aprovador": "Fulano 2", "situacao": "aprovado", "dataLiberacao": "", "observacoes": "asdas"},
            ],
            "anexos": [
              {"item": "01", "nome": "foto-01.png", "link": "link-para-download"}
              {"item": "02", "nome": "foto-02.png", "link": "link-para-download"}
            ],
          },
        ],
        "hasNext": false
    }"
```


## Aprovar documento

PUT /documentos/aprovar
Body:

```json
{
    "documento": "1234",
    "tipoDocumento": "SA",
}
```

Response:
Status 201 - OK

```json
Documento aprovado com sucesso!
```

## Recusar documento

PUT /documentos/rejeitar
Body: 

```json
{
    "documento": "1234",
    "tipoDocumento": "SA",
    "justificativa": "Uma justificativa plausível",
}
```

Response:
Status 200 - OK

```json
Documento aprovado com sucesso!
```


## Transferir documento
PUT /documentos/transferir

Body: 

```json
{
    "documento": "1234",
    "tipoDocumento": "SA",
    "codAprovador": "TEC001",
}
```

Response:
Status 200 - OK

```json
Documento transferido com sucesso!
```


## Consultar anexos
GET /documentos/anexos/

Body: 

```json
{
    "documento": "1234",
    "tipoDocumento": "SA",
    "linkAnexo": "foto1.jpeg",
}
```

Response:
Status 200 - OK Com documento



## Consultar Saldo
GET /saldos

Response:
Status 200 - OK

```json
{
    "codAprovador": "TEC001",
    "codUsuario": "000016",
    "nome": "Samuel Araujo",
    "superior": "Fulano de Tal",
    "limite": 15000.00,
    "moeda": "Real",
    "perLimite": "Mensal",
    "login": "samuel.araujo",
    "saldo": 15000.09,
    "dataRef": "2025-10-25",
}
```


## Aprovadores

GET /aprovadores/

Response:
Status 200 - OK

```json
[
    {
        "codAprovador": "TEC001",
        "nome": "Fulano"
    },
    {
        "codAprovador": "TEC002",
        "nome": "Ciclano"
    },
]
}
```

GET /aprovadores/superiores/

Response:
Status 200 - OK

```json
[
    {
        "codAprovador": "TEC001",
        "nome": "Fulano"
    },
    {
        "codAprovador": "TEC002",
        "nome": "Ciclano"
    },
]
}
```

## Respostas de erro
Response:
Status 400 - Bad Request

```json
{
    "message": "Um erro ocorreu porque...."
}

```