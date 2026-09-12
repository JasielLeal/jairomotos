# Jairo Motos — Passo a Passo

Guia rápido de como usar o sistema no dia a dia. Cada seção é uma tarefa — vá direto na que você precisa.

---

## Entrar no sistema

1. Acesse o endereço do painel e digite seu **e-mail** e **senha**.
2. Marque **"Lembrar de mim"** se quiser continuar logado por mais tempo nesse computador.
3. Clique em **"Entrar"**.

> Esqueceu a senha? Não tem recuperação automática — peça pra um administrador criar uma nova senha pra você em "Usuários".

---

## Cadastrar uma peça nova no estoque

1. Menu lateral → **Estoque**.
2. Botão **"Novo produto"** (canto superior direito).
3. Clique em **"Adicionar"** para tirar/anexar até 5 fotos da peça.
4. Preencha: Nome, Prateleira, Preço de venda, Quantidade inicial e Estoque mínimo.
   - *Estoque mínimo* é a partir de quantas unidades o sistema deve avisar que tá acabando.
   - O campo **Custo** só aparece para administradores.
5. Clique em **"Cadastrar produto"**.

## Dar entrada ou saída em uma peça já cadastrada

1. Estoque → clique na peça na lista.
2. Na seção **"Histórico de movimentações"**, escolha:
   - **Entrada (compra/reposição)** — quando chega mercadoria nova.
   - **Saída (uso interno/perda)** — quando sai sem ser por uma venda pela nota.
3. Preencha a quantidade e, se quiser, o motivo.
4. Clique em **"Registrar"**.

> Vendas feitas por uma **Nota** já baixam o estoque sozinhas — não precisa lançar aqui de novo.

---

## Cadastrar uma moto nova

1. Menu lateral → **Motos**.
2. Botão **"Nova moto"**.
3. Adicione até 5 fotos.
4. Preencha marca, modelo, ano, cor, placa, quilometragem, custo de aquisição e preço de venda.
5. Clique em **"Cadastrar moto"**.

## Marcar uma moto como vendida

1. Motos → clique na moto.
2. Botão verde **"Marcar como vendida"**.
3. Informe: valor de venda, nome do comprador (obrigatório), telefone (opcional) e **pelo menos uma foto do comprovante** de venda (nota, recibo, comprovante Pix, etc.).
4. Clique em **"Confirmar venda"**.

A moto passa a aparecer como **Vendida** e some da vitrine pública automaticamente. Os dados da venda ficam salvos na própria página da moto, em "Detalhes da venda".

> Também dá pra marcar como **"Reservada"** (quando alguém já sinalizou interesse mas ainda não fechou) direto na página da moto.

---

## Criar uma nota para o cliente (venda de peças e/ou serviço)

1. Menu lateral → **Notas** → botão **"Nova nota"**.
2. Preencha o nome (e telefone, opcional) do cliente.
3. Em **"Itens (peças do estoque)"**, busque e adicione as peças usadas, ajustando quantidade e preço se precisar.
4. Em **"Serviços (mão de obra)"**, clique em **"Adicionar serviço"** para lançar cada serviço (descrição + valor).
5. Se for dar desconto, preencha o campo **"Desconto (R$)"**.
6. Clique em **"Criar nota"**.

A nota nasce como **Pendente** — ainda não afeta o estoque nem o financeiro.

## Aprovar, editar ou excluir uma nota

Na página da nota (Notas → clique na nota desejada):

- **"Aprovar nota"** — baixa o estoque das peças usadas e lança o valor total no Financeiro automaticamente. Só pode aprovar uma vez.
- **"Editar nota"** — funciona mesmo depois de aprovada (só não dá pra editar nota cancelada). Ao adicionar, remover ou trocar a quantidade de um item numa nota já aprovada, o estoque e o lançamento no Financeiro são ajustados automaticamente.
- **"Baixar/Ver PDF"** — gera a nota em PDF pra imprimir ou salvar.
- **"Enviar por WhatsApp"** — abre o WhatsApp já com a mensagem pronta pro cliente (precisa ter telefone cadastrado).
- **"Excluir nota"** — apaga a nota. Se ela já tinha sido aprovada, o estoque volta e o lançamento no financeiro é desfeito automaticamente.

---

## Lançar uma receita ou despesa manual *(só administradores)*

1. Menu lateral → **Financeiro** → **"Novo lançamento"**.
2. Escolha o tipo (**Receita** ou **Despesa**), categoria (ex: Aluguel, Fornecedor), descrição, valor, data e, se quiser, a forma de pagamento.
3. Clique em **"Registrar lançamento"**.

> Vendas de peças/serviço (via Notas aprovadas) e vendas/compras de motos já entram sozinhas — isso aqui é só para o que não passa por essas telas.

## Cadastrar e baixar boletos *(só administradores)*

1. Menu lateral → **Boletos** → botão **"Novo boleto"**.
2. Escolha o tipo (**A pagar** ou **A receber**), descrição, valor, vencimento e, se quiser, observações.
3. Clique em **"Cadastrar boleto"**.

Na lista de Boletos, cada um mostra a situação: **Pendente**, **Vence em Xd** (aviso quando o vencimento está a 7 dias ou menos), **Vencido** (atrasado) ou **Pago**. Um aviso de boletos vencidos ou perto de vencer também aparece no topo da Visão Geral e do Financeiro.

- **"Baixar"** — marca o boleto como pago e lança automaticamente a receita/despesa no Financeiro.
- **"Cancelar"** — cancela um boleto pendente sem lançar nada no Financeiro.
- **Excluir** — apaga o boleto; se ele já tinha sido baixado, o lançamento gerado no Financeiro também é removido.

## Acompanhar o financeiro *(só administradores)*

- **Visão Geral** — resumo geral do negócio com gráficos e avisos de boletos a vencer.
- **Financeiro** — todas as receitas e despesas da loja (peças/serviços).
- **Financeiro Motos** — só o dinheiro que entra/sai com compra e venda de motos.
- **Boletos** — boletos a pagar e a receber, com aviso de vencimento próximo.

Funcionários não têm acesso a essas telas — o menu deles mostra só Estoque, Motos e Notas.

---

## Cadastrar um novo funcionário ou administrador *(só administradores)*

1. Menu lateral → **Usuários**.
2. Preencha nome, e-mail, senha e escolha o **Papel**: Funcionário ou Administrador.
3. Clique em **"Criar usuário"**.

A pessoa já pode entrar com esse e-mail e senha assim que você criar.

---

## Vitrine pública (site que os clientes veem)

A página inicial do site (sem precisar de login) mostra automaticamente todas as motos com status **Disponível** — com fotos, ano, km, cor e preço. Cada uma tem um botão **"Tenho interesse"** que abre o WhatsApp da loja com uma mensagem pronta. Motos reservadas ou vendidas somem de lá sozinhas.
