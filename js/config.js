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
      'corte': '',                             // Masculino · Corte masculino
      'degrade': '',                           // Masculino · Degradê
      'barba': '',                             // Masculino · Barba premium
      'combo': '',                             // Masculino · Corte e barba
      'trat': '',                              // Masculino · Tratamento capilar
      'protese': '',                           // Masculino · Manutenção de Prótese Capilar
      'visag': '',                             // Masculino · Consultoria Visagismo
      'coloracao-retoque-de-raiz': '',         // Feminino · Coloração - Retoque de Raiz
      'coloracao-global': '',                  // Feminino · Coloração Global
      'tonalizacao': '',                       // Feminino · Tonalização
      'luzes-curto': '',                       // Feminino · Luzes Curto
      'luzes-medio': '',                       // Feminino · Luzes Médio
      'corte-feminino': '',                    // Feminino · Corte Feminino
      'combo-corte-e-escova': '',              // Feminino · Combo Corte e Escova
      'corte-hidratacao-escova-promocional': '', // Feminino · CORTE HIDRATACAO ESCOVA PROMOCIONAL
      'escova-curta': '',                      // Feminino · Escova Curta
      'escova-media': '',                      // Feminino · Escova Média
      'escova-longa': '',                      // Feminino · Escova Longa
      'escova-extra-longa': '',                // Feminino · Escova Extra Longa
      'baby-liss': '',                         // Feminino · Baby Liss
      'prancha': '',                           // Feminino · Prancha
      'efeito-sirena': '',                     // Feminino · Efeito Sirena
      'lavagem-e-secagem': '',                 // Feminino · Lavagem e Secagem
      'hidratacao': '',                        // Feminino · Hidratação
      'nutricao': '',                          // Feminino · Nutrição
      'reconstrucao': '',                      // Feminino · Reconstrução
      'cauterizacao': '',                      // Feminino · Cauterização
      'botox-capilar': '',                     // Feminino · Botox Capilar
      'selagem': '',                           // Feminino · Selagem
      'progressiva-curta': '',                 // Feminino · Progressiva Curta
      'progressiva-media': '',                 // Feminino · Progressiva Média
      'progressiva-longa': '',                 // Feminino · Progressiva Longa
      'progressiva-extra-longa': '',           // Feminino · Progressiva Extra Longa
      'cronograma-capilar-completo': '',       // Feminino · Cronograma Capilar Completo
      'manutencao-meha-hair-ate-10-fitas': '', // Feminino · Manutenção Meha Hair até 10 fitas
      'manutencao-mega-hair-20-fitas': '',     // Feminino · Manutenção Mega Hair 20 fitas
      'manutencao-mega-hair-30-fitas': '',     // Feminino · Manutenção Mega Hair 30 fitas
      'design-personalizado': '',              // Feminino · Design Personalizado
      'design-e-buco': '',                     // Feminino · Design e Buço
      'design-buco-queixo': '',                // Feminino · Design + Buço + Queixo
      'design-com-henna': '',                  // Feminino · Design com Henna
      'design-com-tintura': '',                // Feminino · Design com Tintura
      'henna-somente': '',                     // Feminino · Henna somente
      'tintura-sobrancelha-somente': '',       // Feminino · Tintura Sobrancelha somente
      'brow-lamination': '',                   // Feminino · Brow Lamination
      'fort-brows': '',                        // Feminino · Fort Brows
      'spa-das-sobrancelhas': '',              // Feminino · SPA das Sobrancelhas
      'lash-lifting': '',                      // Feminino · Lash Lifting
      'classico-fio-a-fio': '',                // Feminino · Classico Fio a Fio
      'volume-brasileiro': '',                 // Feminino · Volume Brasileiro
      'mega-volume-brasileiro': '',            // Feminino · Mega Volume Brasileiro
      'volume-egipcio': '',                    // Feminino · Volume Egípcio
      'volume-ingles': '',                     // Feminino · Volume Inglês
      'volume-luxo': '',                       // Feminino · Volume Luxo
      'fox-eyes': '',                          // Feminino · Fox Eyes
      'manutencao-lash': '',                   // Feminino · Manutenção Lash
      'lash-brow-hidra': '',                   // Feminino · Lash, + Brow + Hidra
      'micro-sobrancelha': '',                 // Feminino · Micro Sobrancelha
      'micro-sobrancelha-retoque': '',         // Feminino · Micro Sobrancelha Retoque
      'micro-labial': '',                      // Feminino · Micro Labial
      'micro-labial-retoque': '',              // Feminino · Micro Labial Retoque
      'limpeza-de-pele': '',                   // Feminino · Limpeza de Pele
      'revitalizacao-facial': '',              // Feminino · Revitalização Facial
      'glow-u': '',                            // Feminino · Glow U
      'buco': '',                              // Feminino · Buço
      'epilacao-facial': '',                   // Feminino · Epilação Facial
      'epilacao-partes': '',                   // Feminino · Epilação Partes
      'manicure': '',                          // Feminino · Manicure
      'pedicure': '',                          // Feminino · Pedicure
      'manicure-e-pedicure': '',               // Feminino · Manicure e Pedicure
      'esmaltacao-comum': '',                  // Feminino · Esmaltação Comum
      'esmaltacao-em-gel': '',                 // Feminino · Esmaltação em Gel
      'spa-dos-pes': '',                       // Feminino · SPA dos Pés
      'maquiagem': '',                         // Feminino · Maquiagem
      'penteado': '',                          // Feminino · Penteado
      'penteado-e-maquiagem': '',              // Feminino · Penteado e Maquiagem
      'avaliacao': '',                         // Feminino · AVALIAÇÃO
    },

    /* Opcional: URL direta de cada profissional (barbeiros e Studio Cupido Beauty). */
    profissionais: {
      1: '',    // Amadeu Diaz (Barbearia)
      2: '',    // Dom Bigode (Barbearia)
      3: '',    // Gustavo Adrian (Barbearia)
      4: '',    // Matheus (Barbearia)
      5: '',    // Barbeiro 05 (Barbearia)
      6: '',    // Chrys Gerbo (Studio Cupido Beauty)
      7: '',    // Carolina (Studio Cupido Beauty)
      8: '',    // Cinthia (Studio Cupido Beauty)
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
    'cat-feminino': 'images/owner-terno-vermelho.png', // Imagem principal do Feminino (recorte PNG)
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
