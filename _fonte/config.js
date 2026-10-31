/* ============================================================================
   STUDIO CUPIDO · CONFIGURAÇÃO CENTRAL
   Este é o único arquivo que precisa ser editado para:
     1) informar os endereços do aplicativo externo de agendamento;
     2) preencher horários e canais de contato;
     3) trocar os placeholders pelas fotografias reais.
   Campos vazios ('') mantêm o espaço reservado na tela. Nada é inventado.
   ============================================================================ */
window.CUPIDO_CONFIG = {

  /* -------- 1) AGENDAMENTO EXTERNO ------------------------------------------
     O site não agenda nada: apenas encaminha o visitante ao aplicativo externo.
     Ordem de escolha do destino de cada botão:
       botão de serviço       → serviços[id]  → profissionais[id] (se o botão for de profissional) → categoria
       botão de profissional  → profissionais[id] → categoria
       botão de categoria     → masculino ou feminino
     Se nenhum destino estiver preenchido, o botão fica em estado "Em breve"
     (desabilitado) e não leva a lugar nenhum.
     Use endereços completos, começando por https://                           */
  agendamento: {
    masculino: 'https://sites.appbarber.com.br/studiocupidobar-rw7b',   // fluxo de agendamento MASCULINO
    feminino:  'https://sites.appbarber.com.br/studiocupidobar-jeh6',   // fluxo de agendamento FEMININO

    /* Opcional: URL direta de cada serviço, se o aplicativo permitir. */
    servicos: {
/*@@SERVICOS@@*/
    },

    /* Opcional: URL direta de cada profissional (barbeiros e Studio Cupido Beauty). */
    profissionais: {
/*@@PROFISSIONAIS@@*/
    }
  },

  /* -------- 2) FUNCIONAMENTO E CONTATO --------------------------------------
     Terça a sábado, das 09:00 às 19:00 (conforme informado pela gestão).     */
  funcionamento: {
    dias: 'Terça a sábado',
    abertura: '09:00',
    fechamento: '19:00'
  },
  contato: {
    endereco:  'Rua Raul Pompéia, 195 · Vila Jardini · 18044-020 · Sorocaba/SP',
    whatsapp:  'https://api.whatsapp.com/send/?phone=15996148166&text=Olá%2C+gostaria+de+fazer+um+agendamento&type=phone_number&app_absent=0&utm_source=ig',
    instagram: 'https://www.instagram.com/studiocupidooficial/',
    email:     '',   // [PENDENTE]
    outros: [        // [OPCIONAL] outros canais oficiais: { nome: 'TikTok', url: 'https://...' }
    ]
  },

  /* -------- RESULTADOS (aba "Resultados") ------------------------------------
     Vídeos do Google Drive (arquivo compartilhado como "Qualquer pessoa com o
     link"). Cole o link de compartilhamento de cada vídeo em uma das listas;
     o visitante escolhe Homem ou Mulher no topo da página. Os links do Drive
     NÃO aparecem para o visitante: o vídeo toca dentro do site.
     formato: 'vertical' (reels, 9:16) ou 'horizontal' (16:9).                  */
  resultados: {
    formato: 'vertical',
    masculino: [
      { titulo: 'Resultado 01', video: 'https://drive.google.com/file/d/19NrvjERxs2eOJeiOBjBneC3Qp2ptPJq_/view' },
      { titulo: 'Resultado 02', video: 'https://drive.google.com/file/d/1e9j_7ZEGvsfOPXGoPC9vWX5p8L48cxMs/view' },
      { titulo: 'Resultado 03', video: 'https://drive.google.com/file/d/1eo2qpPGI4Tz_b_dw61OwSzi1s5WyNkpw/view' },
      { titulo: 'Resultado 04', video: 'https://drive.google.com/file/d/1EDzp3TZjoe9iIMmcN45XAL-qVnnfjkjr/view' },
      { titulo: 'Resultado 05', video: 'https://drive.google.com/file/d/1dILCde0QupUiDGGJ9YZ1qgri7EYIDMBD/view' }
    ],
    feminino: [
      { titulo: 'Resultado 01', video: 'https://drive.google.com/file/d/18xjgGqFbzBHxCY0dGzjL43UA70zya89k/view' },
      { titulo: 'Resultado 02', video: 'https://drive.google.com/file/d/1vYG2vn9sHPbfF4U0jMMwngxlpylRfO-0/view' },
      { titulo: 'Resultado 03', video: 'https://drive.google.com/file/d/1FpzF2vWB-CIt18RTOMI-ysOpM_JkSBQe/view' },
      { titulo: 'Resultado 04', video: 'https://drive.google.com/file/d/1nui7UcFeu2SLlKioMgp062NUuaYmiEt9/view' },
      { titulo: 'Resultado 05', video: 'https://drive.google.com/file/d/1jjWhtajuFbjVRlDe0NVdeAvO1u0JWFP7/view' }
    ]
  },

  /* -------- 3) FOTOGRAFIAS ---------------------------------------------------
     Para trocar um placeholder, coloque o arquivo na pasta images/ e informe o
     caminho aqui. A mesma chave atualiza todas as telas em que a foto aparece.
     Proporção livre: a imagem é cortada automaticamente para caber no quadro.  */
  fotos: {
    'fachada':      'images/fachada.jpg',   // Fachada (primeiro endereço)
    'interior':     'images/hero-bg.jpg',   // Ambiente interno (parede e janelas)
    'cadeiras':     '',                     // Cadeiras e estações de atendimento
    'decoracao':    '',                     // Detalhes da decoração
    'ferramentas':  '',                     // Ferramentas de trabalho
    'equipe':       '',                     // Equipe reunida
    'atendimentos': '',                     // Profissionais durante os atendimentos
    'cat-masculino':'images/owner-terno.png',   // Imagem principal do Masculino (recorte PNG)
    'cat-feminino': 'images/owner-terno-vinho.png', // Imagem principal do Feminino (recorte PNG)
    'pro-1':        'images/amadeu.jpg',        // Amadeu Diaz
    'pro-2':        '',                         // Dom Bigode
    'pro-3':        '',                         // Gustavo Adrian
    'pro-4':        '',                         // Matheus
    'pro-5':        '',                         // Barbeiro 05 (a definir)
    'pro-6':        'images/chrys-gerbo.jpg',   // Chrys Gerbo
    'pro-7':        'images/carolina.jpg',      // Carolina
    'pro-8':        'images/cinthia.jpg'        // Cinthia
  }
};
