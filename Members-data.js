/* Golden Order — dados dos membros da guilda (árvore genealógica de
   quem recrutou quem). Editar ESTE arquivo é a ÚNICA coisa necessária
   pra adicionar, remover ou atualizar alguém em /membros.html — o
   membros.js lê essa lista e desenha a árvore inteira sozinho,
   incluindo as linhas de "quem chamou quem" e as cores de cargo
   (ver membros.css).

   ---------------------------------------------------------------
   Pra ADICIONAR UMA PESSOA: um objeto novo dentro de MEMBERS, com:

     id        — identificador único, sem espaços/acentos
                 (ex.: 'novo-membro')
     name      — nome exibido na árvore
     rank      — a "key" de um dos cargos listados em RANKS, abaixo
     recruiter — o id de quem chamou essa pessoa pra guilda (deixe de
                 fora só no caso do Mahou, que é a raiz da árvore)
     ex        — true se a pessoa não está mais na guilda (opcional;
                 se não tiver essa linha, a pessoa aparece como ativa)
     couple    — id de quem é par romântico dessa pessoa, pra desenhar
                 os dois juntos com um coração no meio (opcional, só
                 quem "puxa" o par precisa ter essa linha — ver
                 Tinylung/Atlas mais abaixo)
     rankLabelKey — chave de i18n pra um rótulo de cargo diferente do
                 padrão embaixo do nome (ex.: forma feminina do cargo;
                 opcional, bem raro — ver Maandy mais abaixo)

   Pra ADICIONAR/REMOVER UM CARGO (não uma pessoa), edite o array
   RANKS — a ordem da lista é a ordem de cima pra baixo na página. A
   cor de cada cargo (igual ao cargo no Discord) fica definida à parte,
   em membros.css, numa classe .org-tier.rank-<key> pra cada entrada
   daqui — se criar um cargo novo, adicione a cor dele lá também.
   --------------------------------------------------------------- */
window.GoldenOrderMembers = {
  RANKS: [
    { key: 'leader', i18n: 'rank.leader', lead: true },
    { key: 'coleader', i18n: 'rank.coleader', lead: true },
    { key: 'master-artisan', i18n: 'rank.masterArtisan' },
    { key: 'grand-master', i18n: 'rank.grandMaster' },
    { key: 'master', i18n: 'rank.master' },
    { key: 'artisan', i18n: 'rank.artisan' },
    { key: 'consecrated', i18n: 'rank.consecrated' },
    { key: 'sworn', i18n: 'rank.sworn' },
    { key: 'recruit', i18n: 'rank.recruit' }
  ],

  MEMBERS: [
    { id: 'mahou', name: 'Mahou', rank: 'leader' },

    { id: 'radyzinn', name: 'Radyzinn', rank: 'coleader', recruiter: 'mahou' },
    { id: 'gatti', name: 'Gatti', rank: 'coleader', recruiter: 'mahou' },
    { id: 'bruno5025', name: 'Bruno5025', rank: 'coleader', recruiter: 'mahou', ex: true },
    { id: 'lucxyz', name: 'LucXYZ', rank: 'coleader', recruiter: 'mahou', ex: true },

    { id: 'rik001', name: 'Rik_001', rank: 'master-artisan', recruiter: 'mahou' },
    { id: 'nisaka', name: 'Nisaka', rank: 'grand-master', recruiter: 'mahou' },
    { id: 'andy', name: 'Andy', rank: 'master', recruiter: 'mahou' },

    { id: 'sandryzz', name: 'Sandryzz', rank: 'consecrated', recruiter: 'mahou' },

    { id: 'hyper', name: 'Hyper', rank: 'sworn', recruiter: 'radyzinn' },
    { id: 'doge', name: 'Doge', rank: 'sworn', recruiter: 'gatti' },
    { id: 'natanpis8', name: 'Natanpis8', rank: 'sworn', recruiter: 'mahou' },
    { id: 'xamineh', name: 'Xamineh', rank: 'sworn', recruiter: 'mahou' },
    { id: 'maandy', name: 'Maandy', rank: 'sworn', recruiter: 'gatti', ex: true, rankLabelKey: 'rank.swornFem' },
    { id: 'kimooy', name: 'Kimooy', rank: 'sworn', recruiter: 'gatti', ex: true },
    { id: 'oceanusolor', name: 'oceanusolor', rank: 'sworn', recruiter: 'mahou', ex: true },
    { id: 'liffers', name: 'Liffers', rank: 'sworn', recruiter: 'mahou', ex: true },

    { id: 'tinylung', name: 'Tinylung', rank: 'recruit', recruiter: 'mahou', couple: 'atlas' },
    { id: 'atlas', name: 'Atlas', rank: 'recruit', recruiter: 'mahou' },
    { id: 'miwendo', name: 'Miwendo', rank: 'recruit', recruiter: 'radyzinn' },
    { id: 'musashi', name: 'Musashi', rank: 'recruit', recruiter: 'nisaka' },
    { id: 'pedro', name: 'Pedro', rank: 'recruit', recruiter: 'andy', ex: true },
    { id: 'mejdalani', name: 'Mejdalani', rank: 'recruit', recruiter: 'gatti', ex: true },
    { id: 'xssul', name: 'Xssul', rank: 'recruit', recruiter: 'gatti', ex: true }
  ]
};