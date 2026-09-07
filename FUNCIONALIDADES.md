# Jairo Motos — Guia de Funcionalidades

Este documento explica, em linguagem simples, tudo o que o sistema **Jairo Motos** faz. Não é um manual técnico — é um guia para entender o que já está pronto e como cada parte ajuda no dia a dia da loja.

---

## Como funciona o acesso

- Cada funcionário tem um **login e senha** próprios, criados por um administrador (ninguém se cadastra sozinho).
- Existe a opção **"Lembrar de mim"** para não precisar digitar login toda hora.
- Existem dois tipos de conta: **Administrador** (acesso total, inclusive à área de Usuários) e **Funcionário** (acesso ao dia a dia, sem gerenciar outros usuários).
- **Não existe recuperação automática de senha.** Se alguém esquecer a senha, um administrador precisa entrar e criar um novo acesso.

---

## 1. Visão Geral (Dashboard)

Tela inicial do painel, com um resumo do negócio: gráficos e números de faturamento, despesas e comparação com meses anteriores, para ter uma ideia rápida da saúde financeira sem precisar entrar em cada área.

## 2. Estoque de Peças

Cadastro de todas as peças e produtos vendidos/usados na loja:

- Cada peça pode ter **até 5 fotos**.
- Nome, categoria, custo, preço de venda e quantidade em estoque.
- Um **estoque mínimo** configurável: quando a quantidade fica igual ou abaixo dele, o sistema avisa visualmente que está acabando.
- Histórico de **movimentações** de estoque (entrada, saída, ajuste), sempre com data e quem fez.
- Edição de dados e das fotos a qualquer momento.

## 3. Motos

Cadastro do estoque de motos à venda:

- Cada moto pode ter **até 5 fotos**.
- Marca, modelo, ano, cor, placa, quilometragem, custo de aquisição e preço de venda anunciado.
- Status da moto: **Disponível**, **Reservada** ou **Vendida**.
- Ao marcar uma moto como **vendida**, o sistema pede:
  - o valor da venda,
  - o **nome do comprador** (obrigatório) e telefone (opcional),
  - **pelo menos uma foto do comprovante de venda** (aceita até 5 fotos — nota fiscal, recibo, comprovante de pagamento, etc.).
- Depois de vendida, a página da moto mostra um resumo com comprador, telefone, data, valor e as fotos dos comprovantes — tudo num só lugar, para consultar quando precisar.
- Exclusão de motos cadastradas por engano.

## 4. Financeiro das Motos

Controle financeiro **separado**, só do negócio de compra e venda de motos:

- Toda compra e toda venda de moto já gera um lançamento automático aqui (não precisa lançar duas vezes).
- Também é possível lançar manualmente outros gastos ligados a uma moto específica (revisão antes da venda, documentação, etc.).
- Mostra o total investido, total vendido e o lucro — tanto por moto quanto no geral.

## 5. Notas (Ordens de Serviço / Venda)

É onde se monta o "orçamento/nota" para o cliente que traz a moto para manutenção ou compra peças:

- Adiciona peças direto do estoque (com busca) e serviços avulsos (mão de obra), cada um com seu valor.
- Permite aplicar desconto.
- Enquanto a nota está **pendente**, pode ser editada livremente.
- Ao **aprovar** a nota: o estoque das peças usadas é baixado automaticamente e o valor total entra no financeiro geral da loja — sem precisar fazer isso à mão.
- Se a nota for excluída depois de aprovada, o estoque é devolvido automaticamente (estorno), evitando erro de contagem.

## 6. Financeiro Geral

Controle de receitas e despesas da loja como um todo (diferente do financeiro específico das motos): tudo que entra e sai, com categoria, descrição, valor, forma de pagamento e data.

## 7. Usuários (somente Administradores)

Área restrita para administradores criarem novos acessos de funcionários ou outros administradores, e verem a lista da equipe com acesso ao sistema.

## 8. Vitrine Pública de Motos (site)

Uma página pública (sem precisar de login) que mostra automaticamente todas as motos com status **Disponível**, com fotos, ano, quilometragem, cor e preço. Cada moto tem um botão **"Tenho interesse"** que abre o WhatsApp da loja com uma mensagem já pronta, puxando o modelo e o preço da moto — o cliente só precisa mandar. Motos vendidas ou reservadas não aparecem nessa vitrine.

---

## Resumo rápido

| Área | Para que serve |
|---|---|
| Visão Geral | Resumo financeiro geral em gráficos |
| Estoque | Peças e produtos (até 5 fotos cada) |
| Motos | Motos à venda (até 5 fotos + comprovante de venda) |
| Financeiro Motos | Dinheiro que entra/sai só com motos |
| Notas | Orçamentos/vendas de peças e serviços para clientes |
| Financeiro | Dinheiro que entra/sai da loja em geral |
| Usuários | Quem tem acesso ao sistema (só admin) |
| Site público | Vitrine de motos disponíveis, com contato via WhatsApp |
