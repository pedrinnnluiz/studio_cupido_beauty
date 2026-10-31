# Studio Cupido · site institucional (protótipo)

Site estático: um HTML por tela, sem login e sem agendamento interno.
Todo agendamento acontece em um **aplicativo externo**; o site apenas encaminha o visitante.

## Telas
index (Home) · resultados · masculino · feminino · servicos · barbeiros · perfil-1 a perfil-8 (Equipe: barbeiros e Studio Cupido Beauty) · historia · contato

- **Masculino**: identidade azul (azul-marinho, azul profundo e branco).
- **Feminino**: identidade vinho (#572B3A, #33161F, #8A4A5F, #F8F1F2) com detalhes em champagne (#D6B483). Aplicada pela classe `theme-f` no `<body>` (ou em um bloco).
- A logo original é a mesma nas duas experiências (`images/logo.png`).

## O que editar (tudo em `js/config.js`)
1. **Agendamento externo**: `agendamento.masculino`, `agendamento.feminino` (obrigatórios para ativar os botões),
   `agendamento.servicos[id]` e `agendamento.profissionais[id]` (opcionais, para links diretos).
   Botão de serviço → URL do serviço → URL da categoria. Botão de barbeiro → URL do barbeiro → URL masculina.
   Os dois destinos principais (masculino e feminino) já estão configurados. Sem URL, o botão fica em "Em breve" e mostra um aviso ao clicar. Nenhum endereço é inventado.
2. **Funcionamento e contato**: dias, abertura, fechamento, endereço, WhatsApp, Instagram, e-mail e outros canais.
   Aparecem no rodapé e em Contato.
3. **Resultados (vídeos)**: em `resultados` do `config.js`, cole o link de compartilhamento de cada vídeo do Drive (masculino e feminino). Os links do Drive não aparecem para o visitante; o vídeo toca dentro do site.
4. **Fotografias**: coloque o arquivo em `images/` e informe o caminho em `fotos` (fachada, interior, cadeiras, decoracao,
   ferramentas, equipe, atendimentos, cat-masculino, cat-feminino, pro-1 a pro-8). A mesma chave atualiza todas as telas.

## Regenerar as páginas
`_fonte/build.py` gera os HTML, o CSS e copia `config.js` e `ui.js`. Edite os arquivos de `_fonte/` e rode `python3 _fonte/build.py`
(as edições feitas direto em `js/config.js` são sobrescritas se você regenerar; prefira editar `_fonte/config.js` ou copiar o arquivo de volta).
`_fonte/test_site.py` verifica links, rotas removidas, estados de agendamento, estouro lateral e erros de console (precisa de Playwright).
