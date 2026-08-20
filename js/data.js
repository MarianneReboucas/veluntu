/* VELUNTU - Acervo Editorial Ampliado dos Destinos (África do Sul, Egito & Madagascar) */

const VELUNTU_DATA = {
  destinations: {
    egito: {
      id: 'egito',
      name: 'Egito',
      subtitle: 'O Tempo Gravado nas Pedras do Nilo',
      coords: '29.9792° N, 31.1342° E',
      region: 'Norte da África • Vale do Nilo & Deserto Ocidental',
      heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=800&auto=format&fit=crop',
      tags: ['Geometria Antiga', 'Arquitetura de Terra', 'Filosofia do Nilo', 'Oásis de Siwa'],
      quote: 'No Egito, a arquitetura não luta contra o tempo; ela habita a eternidade.',
      summary: 'Uma imersão arqueológica e sensorial profunda pelo Egito vernacular e sagrado. Das muralhas em Kershef do Oásis de Siwa às navegações silenciosas pelo Nilo, uma jornada desenhada para desacelerar o olhar e compreender cinco milênios de civilização.',
      bestSeason: 'Outubro a Abril (Clima seco e ameno, ideal para exploração do deserto)',

      // Contexto Cultural
      culturalContext: {
        intro: 'A essência cultural do Egito reside na simbiose entre o rio e a pedra. Mais do que a magnificência dos faraós, o país preserva tradições orais de poetas do Nilo, a sabedoria construtiva em terra batida e a riqueza intelectual das bibliotecas e cafés literários do Cairo.',
        keyPoints: [
          'Tradições construtivas em terra seca e Kershef (sal e argila) nos oásis.',
          'Música Sufi e poética lírica das vilas ao longo do Nilo.',
          'Filosofia da arquitetura funerária e relação com a vida pós-morte.'
        ]
      },

      // Lugares Notáveis
      places: [
        {
          name: 'Oásis de Siwa & Fortaleza de Shali',
          desc: 'Um oásis isolado no Deserto Ocidental onde a arquitetura ancestral em terra e sal sobressai entre tamareiras e lagos salgados.',
          coords: '29.2032° N, 25.5195° E',
          img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Templos de Luxor & Karnak',
          desc: 'O epicentro do Alto Egito, onde colunas gigantescas em forma de papiro narram hinos dedicados aos deuses e reis.',
          coords: '25.6989° N, 32.6421° E',
          img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Cairo Histórico & Bairro Cóptico',
          desc: 'Labirintos de pedra, mesquitas com minaretes entrelaçados e igrejas milenares imersas na vibração intelectual da cidade.',
          coords: '30.0444° N, 31.2357° E',
          img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Templo de Philae em Aswan',
          desc: 'Resgatado das águas do Nilo, o santuário dedicado à deusa Ísis repousa sobre a ilha sagrada de Agilkia.',
          coords: '24.0255° N, 32.8841° E',
          img: 'https://images.unsplash.com/photo-1572252821143-035a00445d47?q=80&w=800&auto=format&fit=crop'
        }
      ],

      // Categorias Temáticas & Experiências no Egito
      categories: {
        historia: [
          {
            title: 'Imersão Arqueológica Privada em Gizé & Sakkara',
            desc: 'Acompanhamento exclusivo de egiptólogos para compreender a evolução das mastabas às grandes pirâmides.',
            format: 'Expedição Guiada',
            duration: '1 Dia'
          },
          {
            title: 'Manuscritos Coptas e Arquivos de Alexandria',
            desc: 'Visita orientada às bibliotecas históricas e monastérios do deserto de Wadi El Natrun.',
            format: 'Estudo de Campo',
            duration: '2 Dias'
          }
        ],
        cultura: [
          {
            title: 'Cena Literária & Cafés Históricos do Cairo',
            desc: 'Caminhada pelos passos do prêmio Nobel Naguib Mahfouz e encontros com escritores contemporâneos.',
            format: 'Encontro Cultural',
            duration: 'Meio Dia'
          },
          {
            title: 'Noite de Cânticos Sufis & Dança Tanoura',
            desc: 'Vivência espiritual sonora no complexo histórico de Wekalet El Ghouri.',
            format: 'Imersão Sonora',
            duration: 'Noite'
          }
        ],
        aventura: [
          {
            title: 'Expedição de Felucca Tradicional pelo Nilo',
            desc: 'Navegação sem motor em barco de madeira, acampando sob o céu estrelado do deserto.',
            format: 'Travessia Fluvial',
            duration: '3 Dias'
          },
          {
            title: 'Traessia de 4x4 & Pernoite no Deserto Branco',
            desc: 'Exploração de paisagens calcárias surreais esculpidas pelos ventos saarianos.',
            format: 'Acampamento no Deserto',
            duration: '2 Dias'
          }
        ],
        gastronomia: [
          {
            title: 'Sabores do Nilo & Culinária Núbia',
            desc: 'Banquete tradicional preparado por famílias núbias com tajines de vegetais, pães Aish Baladi e especiarias.',
            format: 'Imersão Gastronômica',
            duration: 'Meio Dia'
          },
          {
            title: 'Rota dos Chás & Especiarias de Aswan',
            desc: 'Degustação e aprendizado sobre as ervas medicinais e o hibisco (Karkadeh) cultivado no Alto Egito.',
            format: 'Oficina Sensorial',
            duration: '3 Horas'
          }
        ],
        natureza: [
          {
            title: 'Banho nas Nascentes Quentes de Cleopatra em Siwa',
            desc: 'Flutuação em águas termais cristalinas rodeadas por tamareiras e dunas de areia.',
            format: 'Contemplação Natural',
            duration: '1 Dia'
          },
          {
            title: 'Ecossistema dos Lagos Salgados de Siwa',
            desc: 'Caminhada interpretativa entre depósitos naturais de sal cristalino e bioma de deserto.',
            format: 'Caminhada Botânica',
            duration: 'Meio Dia'
          }
        ],
        'vida-selvagem': [
          {
            title: 'Observação de Aves Migratórias na Represa de Aswan',
            desc: 'Identificação de garças, águias-pescadoras e pelicanos nas ilhas protegidas do Nilo com ornitólogos.',
            format: 'Observação Ornitológica',
            duration: 'Meio Dia'
          },
          {
            title: 'Fauna Adaptada do Deserto de Fayoum',
            desc: 'Identificação de raposas-do-deserto (Fennec) e fósseis marinhos no Vale das Baleias (Wadi El Hitan).',
            format: 'Expedição Biológica',
            duration: '1 Dia'
          }
        ]
      }
    },

    'africa-do-sul': {
      id: 'africa-do-sul',
      name: 'África do Sul',
      subtitle: 'Das Alturas do Fynbos às Narrativas da Savana',
      coords: '33.9249° S, 18.4241° E',
      region: 'Sul da África • Costa Ocidental & Planalto Central',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
      tags: ['Biodiversidade Fynbos', 'Arte Contemporânea', 'Savana Silenciosa', 'Gastronomia Botânica'],
      quote: 'A paisagem sul-africana é um diálogo vivo entre montanhas dramáticas e oceanos selvagens.',
      summary: 'A África do Sul combina a sofisticação urbana de Joanesburgo e Cidade do Cabo com o ecossistema botânico mais denso do planeta (Fynbos) e a imensidão preserved da savana do Kruger.',
      bestSeason: 'Maio a Outubro para Observação de Fauna; Novembro a Março para a Costa do Cabo',

      culturalContext: {
        intro: 'A cultura sul-africana é uma tapeçaria vibrante tecida por dezenas de etnias, movimentos de libertação e uma cena artística contemporânea de prestígio global. Fundamentada no conceito de Ubuntu, preza pela conexão humana e regeneração comunitária.',
        keyPoints: [
          'Filosofia Ubuntu ("Eu sou porque nós somos") na ética diária.',
          'Destaque internacional em artes visuais, fotografia e arquitetura.',
          'Culinária Cape Malay e influências dos oceanos Atlântico e Índico.'
        ]
      },

      places: [
        {
          name: 'Cidade do Cabo & Peninsula do Cabo',
          desc: 'Onde a icônica Table Mountain abraça o Oceano Atlântico, cercada por reservas florestais urbanas e vilas costeiras.',
          coords: '33.9249° S, 18.4241° E',
          img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Reserva Privada Kruger & Savana Central',
          desc: 'Santuário de vida selvagem onde acampamentos de baixo impacto ambiental promovem a conservação da biodiversidade.',
          coords: '23.9884° S, 31.5547° E',
          img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Vale Vinícola de Franschhoek',
          desc: 'Arquitetura Cape Dutch preservada, vinhedos seculares entre montanhas e restaurantes dedicados à alta gastronomia botânica.',
          coords: '33.9080° S, 19.1189° E',
          img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Cadeia de Montanhas Drakensberg',
          desc: 'Escarpas dramáticas e desfiladeiros decorados com pinturas rupestres ancestrais do povo San.',
          coords: '29.2559° S, 29.4061° E',
          img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'
        }
      ],

      categories: {
        historia: [
          {
            title: 'Rota da Liberdade & Arquivos em Soweto',
            desc: 'Caminhada histórica orientada por moradores e historiadores locais pelos marcos do movimento libertário.',
            format: 'Caminhada Histórica',
            duration: '1 Dia'
          },
          {
            title: 'Arte Rupestre San nas Montanhas Drakensberg',
            desc: 'Exploração das pinturas gravadas em rocha com mais de 3.000 anos por arqueólogos sul-africanos.',
            format: 'Expedição Arqueológica',
            duration: '2 Dias'
          }
        ],
        cultura: [
          {
            title: 'Imersão no Zeitz MOCAA & Galerias de Cape Town',
            desc: 'Visita privada ao maior museu de arte contemporânea africana do mundo e ateliês em Rosebank.',
            format: 'Curadoria de Arte',
            duration: '1 Dia'
          },
          {
            title: 'Oficina de Culinária & Tradição Cape Malay',
            desc: 'Aprenda o preparo de curries aromáticos e temperos em uma casa histórica do bairro Bo-Kaap.',
            format: 'Imersão Cultural',
            duration: 'Meio Dia'
          }
        ],
        aventura: [
          {
            title: 'Traessia dos Picos da Table Mountain',
            desc: 'Trilha guiada subindo as escarpas do Cabo com vistas panorâmicas para os dois oceanos.',
            format: 'Trilha de Montanha',
            duration: '1 Dia'
          },
          {
            title: 'Navegação de Caiaque entre Penhascos no Oceano',
            desc: 'Remada costeira em águas protegidas observando a vida marinha da Baía de False.',
            format: 'Aventura Marítima',
            duration: 'Meio Dia'
          }
        ],
        gastronomia: [
          {
            title: 'Harmonização de Terroir nos Vinhedos do Cabo',
            desc: 'Degustação guiada por sommeliers em vinhedos orgânicos de Stellenbosch e Franschhoek.',
            format: 'Degustação Premium',
            duration: '1 Dia'
          },
          {
            title: 'Menu Forrageado Fynbos & Alta Gastronomia',
            desc: 'Experiência sensorial jantando pratos elaborados com ervas e flores comestíveis nativas.',
            format: 'Jantar Autoral',
            duration: 'Noite'
          }
        ],
        natureza: [
          {
            title: 'Jardim Botânico Nacional de Kirstenbosch',
            desc: 'Caminhada interpretativa pela copa das árvores no coração do reino floral Fynbos.',
            format: 'Imersão Botânica',
            duration: 'Meio Dia'
          },
          {
            title: 'Observação da Rota das Flores em Namaqualand',
            desc: 'Testemunhe o espetáculo anual do deserto se transformando em um tapete de flores silvestres.',
            format: 'Expedição Botânica',
            duration: '3 Dias'
          }
        ],
        'vida-selvagem': [
          {
            title: 'Rastreamento Consciente na Savana do Kruger',
            desc: 'Saídas ao amanhecer com rangers especialistas para acompanhar felinos e elefantes sem interferência.',
            format: 'Safári de Conservação',
            duration: '3 Dias'
          },
          {
            title: 'Avistamento de Baleias Francas em Hermanus',
            desc: 'Observação marinha a partir dos penhascos e de embarcações sustentáveis na Costa das Baleias.',
            format: 'Observação Marinha',
            duration: '1 Dia'
          }
        ]
      }
    },

    madagascar: {
      id: 'madagascar',
      name: 'Madagascar',
      subtitle: 'O Continente Isolado no Tempo',
      coords: '18.8792° S, 47.5079° E',
      region: 'Oceano Índico Ocidental • Ilha Vermelha',
      heroImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      tags: ['Baobás Seculares', 'Tsingy de Pedra', 'Endemismo Raro', 'Identidade Malgache'],
      quote: 'Madagascar é uma cápsula do tempo natural onde 90% da vida não existe em nenhum outro lugar da Terra.',
      summary: 'Ilhada há dezenas de milhões de anos, Madagascar oferece uma imersão extraordinária em ecossistemas únicos do planeta: estradas monumentais de baobás, agulhas calcárias de Tsingy e rituais sagrados ligando gerações.',
      bestSeason: 'Maio a Novembro (Estação seca e de melhor navegação costeira)',

      culturalContext: {
        intro: 'A cultura Malgache une heranças austronésias e africanas em uma cosmovisão singular. O respeito aos antepassados (*Razana*) permeia a arquitetura tradicional, as esculturas funerárias Aloalo e as canções tocadas com a cítara de bambu (*Valiha*).',
        keyPoints: [
          'Conceito de Fomba (tradições sagradas e respeito aos ancestrais).',
          'Tecelagem de seda nativa (Lamba) e entalhe em madeira preciosa.',
          'Música contemplativa de Marovany e Valiha.'
        ]
      },

      places: [
        {
          name: 'Avenida dos Baobás em Morondava',
          desc: 'A mais famosa alameda de Baobás-Grandidier do planeta, cujas silhuetas se destacam sob o céu do oeste malgache.',
          coords: '20.2508° S, 44.4184° E',
          img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Parque Nacional Tsingy de Bemaraha',
          desc: 'Patrimônio Mundial da UNESCO composto por florestas de agulhas de pedra calcária esculpidas pela chuva.',
          coords: '19.1412° S, 44.8080° E',
          img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Reserva de Andasibe-Mantadia',
          desc: 'Floresta tropical de altitude onde habita o maior lêmure do mundo, o Indri Indri, famoso pelo seu canto ressonante.',
          coords: '18.9333° S, 48.4167° E',
          img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Ilha de Nosy Be & Arquipélago do Índico',
          desc: 'Águas turquesa transparentes, plantações de ylang-ylang aromático e recifes de corais preservados.',
          coords: '13.3167° S, 48.2667° E',
          img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
        }
      ],

      categories: {
        historia: [
          {
            title: 'Colina Sagrada de Ambohimanga',
            desc: 'Visita ao palácio de madeira e pedra dos antigos Reis Merina, berço da unificação de Madagascar.',
            format: 'Patrimônio Cultural',
            duration: 'Meio Dia'
          },
          {
            title: 'Esculturas Funerárias Aloalo em Toliara',
            desc: 'Estudo de campo sobre o significado simbólico dos tótems de madeira esculpidos pelos povos Mahafaly.',
            format: 'Antropologia Visual',
            duration: '1 Dia'
          }
        ],
        cultura: [
          {
            title: 'Oficina de Tecelagem de Seda Lamba em Arivonimamo',
            desc: 'Acompanhe o processo de extração e tecelagem manual da seda selvagem malgache.',
            format: 'Artesanato Tradicional',
            duration: '1 Dia'
          },
          {
            title: 'Apresentação Musical com Instrumento Valiha',
            desc: 'Encontro com mestres da cítara tradicional de bambu em Antananarivo.',
            format: 'Vivência Sonora',
            duration: 'Noite'
          }
        ],
        aventura: [
          {
            title: 'Travessia de Pontes de Corda nos Tsingy',
            desc: 'Caminhada equipada com cadeirinhas de escalada sobre os abismos de calcário de Bemaraha.',
            format: 'Trilha Extrema',
            duration: '2 Dias'
          },
          {
            title: 'Navegação de Piroga Tradicional pelo Rio Tsiribihina',
            desc: 'Descida de rio em canoa de madeira rústica com acampamento nas margens isoladas.',
            format: 'Expedição Fluvial',
            duration: '3 Dias'
          }
        ],
        gastronomia: [
          {
            title: 'Rota da Baunilha de Sambava & Cacao',
            desc: 'Visita às plantações orgânicas onde se produz a melhor baunilha Bourbon do mundo.',
            format: 'Terroir & Sabores',
            duration: '2 Dias'
          },
          {
            title: 'Gastronomia Marítima Malgache com Pimenta Rosa',
            desc: 'Pratos de peixes e frutos do mar frescos preparados com leite de coco nativo e especiarias.',
            format: 'Jantar à Beira-Mar',
            duration: 'Noite'
          }
        ],
        natureza: [
          {
            title: 'Caminhada Noturna na Floresta de Andasibe',
            desc: 'Identificação de camaleões gigantes, rãs fluorescentes e flora bioluminescente sob a luz de lanternas.',
            format: 'Exploração Noturna',
            duration: '3 Horas'
          },
          {
            title: 'Contemplação dos Baobás ao Pôr do Sol',
            desc: 'Fotografia e silêncio na Avenida dos Baobás enquanto a luz do sol tingem as árvores ancestrais.',
            format: 'Sessão Fotográfica',
            duration: 'Meio Dia'
          }
        ],
        'vida-selvagem': [
          {
            title: 'Encontro com o Indri Indri em Andasibe',
            desc: 'Caminhada com guias locais pelas copas das árvores escutando os chamados ecológicos dos lêmures.',
            format: 'Observação de Primatas',
            duration: '1 Dia'
          },
          {
            title: 'Mergulho de Conservação de Tartarugas em Nosy Tanikely',
            desc: 'Snorkeling sustentável ao lado de tartarugas marinhas e arraias em reserva marinha protegida.',
            format: 'Vida Marinha',
            duration: 'Meio Dia'
          }
        ]
      }
    }
  },

  interests: [
    {
      id: 'historia',
      number: '01',
      title: 'História',
      subtitle: 'Memória escrita nas pedras e na tradição oral',
      description: 'Explore manuscritos antigos, rotas comerciais milenares, a arquitetura Núbia e os arquivos de resistência que moldaram o continente.',
      img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'Manuscritos iluminados em Alexandria e bibliotecas históricas do Cairo.',
        'Rotas de comércio do Deserto do Saara e fortalezas de pedra.',
        'Patrimônio arquitetônico vernacular de Gizé ao Cabo.'
      ]
    },
    {
      id: 'cultura',
      number: '02',
      title: 'Cultura',
      subtitle: 'Tradições vivas, arte e estética contemporânea',
      description: 'Uma imersão sem clichês nas artes visuais africanas, rituais sagrados, tecelagem tradicional e movimentos literários emergentes.',
      img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'Bienais de arte contemporânea e galerias em Joanesburgo e Cidade do Cabo.',
        'Música gnawa no norte e ritmos de marovany em Madagascar.',
        'Filosofia Ubuntu e tradições espirituais respeitadas.'
      ]
    },
    {
      id: 'aventura',
      number: '03',
      title: 'Aventura',
      subtitle: 'Expedições em paisagens brutas e intocadas',
      description: 'Traessias a pé em desfiladeiros de calcário, navegação em rios sagrados e rotas cênicas entre o oceano e a savana.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'Exploração dos picos calcários de Tsingy de Bemaraha.',
        'Trilhas botânicas ao longo da Table Mountain e Garden Route.',
        'Expedição em dunas de areia silenciosas no Deserto Ocidental.'
      ]
    },
    {
      id: 'gastronomia',
      number: '04',
      title: 'Gastronomia',
      subtitle: 'Ingredientes nativos, especiarias e terroir',
      description: 'Descubra a culinária Cape Malay, os aromas de baunilha de Madagascar e o uso de ervas endêmicas em menus sustentáveis.',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'Terroir vinícola histórico de Franschhoek e Stellenbosch.',
        'Mercados de especiarias ancestrais do Cairo antigo.',
        'Gastronomia baseada em sementes de baobá e ervas tropicais.'
      ]
    },
    {
      id: 'natureza',
      number: '05',
      title: 'Natureza',
      subtitle: 'Ecossistemas botânicos e paisagens primordiais',
      description: 'Mergulhe no reino floral de Fynbos, oásis termais, florestas tropicais de neblina e formações geológicas raras.',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'O Bioma Fynbos: o menor e mais denso reino floral do mundo.',
        'Oásis de Siwa com nascentes naturais de água cristalina.',
        'Florestas primordiais de Andasibe em Madagascar.'
      ]
    },
    {
      id: 'vida-selvagem',
      number: '06',
      title: 'Vida Selvagem',
      subtitle: 'Encontros éticos e observação conservacionista',
      description: 'Privilegie a observação em habitats preservados, guiada por biólogos e rastreadores dedicados à conservação da fauna.',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
      snippets: [
        'Lêmures endêmicos em seu habitat natural em Madagascar.',
        'Rastreamento a pé de predadores na savana com especialistas.',
        'Migração de baleias francas no Oceano Atlântico Sul.'
      ]
    }
  ],

  narratives: [
    {
      id: 1,
      title: 'A Geometria Sagrada de Siwa',
      category: 'Arquitetura & Território',
      country: 'Egito',
      date: 'Caderno Editorial • Edição N° 04',
      snippet: 'Como o sal e a argila construíram uma cidade fortificada capaz de resistir aos ventos quentes do Saara há centenas de anos.',
      img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'O Silêncio dos Baobás ao Amanhecer',
      category: 'Botânica & Mito',
      country: 'Madagascar',
      date: 'Caderno Editorial • Edição N° 02',
      snippet: 'As lendas locais que envolvem as árvores de cabeça para baixo e sua importância hídrica para os povos da região de Menabe.',
      img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Design Contemporâneo em Joanesburgo',
      category: 'Arte & Cidade',
      country: 'África do Sul',
      date: 'Caderno Editorial • Edição N° 07',
      snippet: 'Uma jornada pelos estúdios de cerâmica, galerias de fotografia e coletivos de design que redefinem a narrativa sul-africana.',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop'
    }
  ]
};
