# Jairo Motos — Sistema de Gestão da Loja

Este documento é um resumo do projeto para apresentar ao cliente. Nada aqui é técnico — é só para explicar **o que foi construído e por quê**.

---

## O que é

Um sistema (um programa acessado pelo navegador, como um site, mas privado) feito sob medida para a Jairo Motos administrar o negócio inteiro em um único lugar: estoque de peças, motos à venda, orçamentos e vendas para clientes, financeiro e uma vitrine pública na internet.

Não é uma planilha nem um aplicativo genérico pronto — foi pensado especificamente para a rotina de uma loja que vende peças, presta serviço e compra/vende motos.

## Qual problema ele resolve

Sem um sistema assim, o controle normalmente fica espalhado: caderno, planilha, memória de quem vendeu o quê, papel de comprovante que pode se perder. Isso gera:

- Estoque desatualizado (vender uma peça que na real já acabou).
- Dificuldade de saber, rápido, quanto entrou e quanto saiu no mês.
- Negócio de motos misturado com o resto do financeiro, dificultando saber se está dando lucro.
- Nenhuma vitrine online — quem quer ver as motos disponíveis depende de ir até a loja ou perguntar por mensagem.
- Sem histórico organizado de vendas e comprovantes.

## O que o sistema faz — visão geral

| Área | Para que serve |
|---|---|
| **Visão Geral** | Um painel inicial com gráficos simples mostrando a saúde financeira do negócio. |
| **Estoque de Peças** | Cadastro de todas as peças, com fotos, preço e quantidade. Avisa sozinho quando algo está acabando. |
| **Motos** | Cadastro das motos à venda, com fotos e dados completos. Ao vender, guarda o comprovante e os dados do comprador. |
| **Notas** | Onde se monta o orçamento/venda para o cliente (peças + serviço). Ao aprovar, o estoque e o financeiro se atualizam sozinhos. |
| **Financeiro** | Controle de receitas e despesas da loja, separado em "geral" e "motos" — para saber exatamente o lucro de cada frente do negócio. |
| **Usuários** | Cada funcionário tem seu próprio login. O dono decide quem é administrador (acesso total) e quem é funcionário (acesso ao dia a dia). |
| **Vitrine Pública** | Uma página na internet, sem precisar de login, mostrando as motos disponíveis. O cliente clica em "Tenho interesse" e já cai direto no WhatsApp da loja. |

*(O detalhamento completo de cada área está em [FUNCIONALIDADES.md](FUNCIONALIDADES.md), e o passo a passo de uso no dia a dia está em [COMO-USAR.md](COMO-USAR.md).)*

## Principais benefícios

- **Tudo em um só lugar** — não precisa mais de planilha, caderno e WhatsApp separados para controlar o negócio.
- **Menos erro manual** — o estoque e o financeiro são atualizados automaticamente quando uma venda é aprovada, sem precisar lançar duas vezes.
- **Visão clara do lucro** — o financeiro de motos é separado do financeiro da loja, então dá para saber se cada frente do negócio está sendo lucrativa.
- **Presença online 24 horas** — a vitrine de motos fica disponível na internet o tempo todo, mesmo com a loja fechada, gerando contato direto pelo WhatsApp.
- **Histórico organizado** — todas as vendas, comprovantes e movimentações ficam guardados e são fáceis de consultar depois.
- **Controle de quem acessa o quê** — funcionários não veem informações sensíveis (como financeiro e custo das peças), só o dono/administrador.

## Segurança e acesso

Cada pessoa tem login e senha próprios, criados pelo administrador — ninguém se cadastra sozinho. Não existe recuperação automática de senha por e-mail; se alguém esquecer, o administrador cria uma nova.

## Status atual

O sistema já está funcional com todas as áreas descritas acima prontas para uso.

## Sugestão de pauta para a reunião

1. Apresentar a ideia geral (este documento).
2. Fazer uma demonstração ao vivo do sistema funcionando.
3. Mostrar a vitrine pública como o cliente final vai ver.
4. Ouvir dúvidas e ajustes que o cliente queira pedir.
5. Alinhar próximos passos (ajustes finais, treinamento da equipe, data de início de uso).
