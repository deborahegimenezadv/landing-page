export const siteUrl = "https://dantasgimenez.adv.br";
export const siteName = "Dantas Gimenez & Machado Advogados";

export const whatsappMessage = "Olá, gostaria de falar sobre um caso.";

function buildWhatsappLink(number: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
}

export const whatsappNumbers = {
  tributario: "5567998144478",
  civilPrevidenciario: "5567999559249",
};

// Default for the site's general CTAs (nav, hero, floating button, contato) —
// civil/previdenciário covers 2 of the 3 practice areas.
export const whatsappLink = buildWhatsappLink(
  whatsappNumbers.civilPrevidenciario,
);

export const navLinks = [
  { href: "#areas", label: "Áreas" },
  { href: "#escritorio", label: "Escritório" },
  { href: "#advogados", label: "Advogados" },
  { href: "#faq", label: "FAQ" },
  { href: "#contato", label: "Contato" },
];

export type Area = {
  tag: string;
  title: string;
  description: string;
  topics: string[];
  lawyer: string;
  whatsapp: string;
};

export const areas: Area[] = [
  {
    tag: "PREVIDENCIÁRIO",
    title: "Direito Previdenciário",
    description:
      "Concessão e revisão de benefícios do INSS, aposentadorias e ações judiciais previdenciárias.",
    topics: [
      "Aposentadorias",
      "Benefícios do INSS",
      "Revisão de benefícios",
      "Ações previdenciárias",
    ],
    lawyer: "Deborah Cristhina Peixoto Dantas Gimenez",
    whatsapp: buildWhatsappLink(whatsappNumbers.civilPrevidenciario),
  },
  {
    tag: "TRIBUTÁRIO",
    title: "Direito Tributário",
    description:
      "Planejamento tributário, defesa em autuações fiscais e contencioso administrativo e judicial.",
    topics: [
      "Planejamento tributário",
      "Defesa em autuações fiscais",
      "Contencioso administrativo",
      "Contencioso judicial",
    ],
    lawyer: "Vinícius Mattos Machado",
    whatsapp: buildWhatsappLink(whatsappNumbers.tributario),
  },
  {
    tag: "CIVIL",
    title: "Direito Civil",
    description:
      "Contratos, responsabilidade civil, direito de família e sucessões, e negociação extrajudicial.",
    topics: [
      "Contratos",
      "Responsabilidade civil",
      "Direito de família",
      "Sucessões e negociações",
    ],
    lawyer: "Antoliano Santana Gimenez",
    whatsapp: buildWhatsappLink(whatsappNumbers.civilPrevidenciario),
  },
];

export type Value = {
  n: string;
  title: string;
  description: string;
};

export const values: Value[] = [
  {
    n: "01",
    title: "Atendimento direto",
    description:
      "O advogado responsável pela área acompanha o caso do início ao fim.",
  },
  {
    n: "02",
    title: "Transparência nos honorários",
    description:
      "Valores e forma de pagamento combinados antes do início do trabalho.",
  },
  {
    n: "03",
    title: "Rigor técnico",
    description: "Análise fundamentada em cada etapa do processo.",
  },
  {
    n: "04",
    title: "Comunicação clara",
    description: "Retorno objetivo sobre o andamento de cada caso.",
  },
];

export type Lawyer = {
  name: string;
  area: string;
  bio: string;
  oab: string;
  photoLabel: string;
  photoSrc?: string;
};

export const lawyers: Lawyer[] = [
  {
    name: "Deborah Cristhina Peixoto Dantas Gimenez",
    area: "Direito Previdenciário",
    bio: "Atua com concessão e revisão de benefícios do INSS, aposentadorias e ações judiciais previdenciárias.",
    oab: "OAB/MS 24.262",
    photoLabel: "foto — Deborah Gimenez",
    photoSrc: "/deborah.jpeg",
  },
  {
    name: "Vinícius Mattos Machado",
    area: "Direito Tributário",
    bio: "Atua com planejamento tributário, defesa em autuações fiscais e contencioso tributário administrativo e judicial.",
    oab: "OAB/MS 30.725",
    photoLabel: "foto — Vinícius Machado",
    photoSrc: "/vinicius.jpg",
  },
  {
    name: "Antoliano Santana Gimenez",
    area: "Direito Civil",
    bio: "Atua com contratos, responsabilidade civil, direito de família e sucessões.",
    oab: "OAB/MS 32.159",
    photoLabel: "foto — Antoliano Gimenez",
    photoSrc: "/antoliano.JPG",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Como funciona a primeira conversa com o escritório?",
    answer:
      "O contato inicial é feito por WhatsApp ou telefone para entender o caso e indicar o advogado responsável pela área.",
  },
  {
    question: "Os honorários são combinados antes do início do trabalho?",
    answer:
      "Sim. Os valores e a forma de pagamento são apresentados e combinados antes de qualquer atuação no caso.",
  },
  {
    question: "O escritório atende fora de Campo Grande?",
    answer:
      "Atendemos casos em todo o estado e, em processos judiciais eletrônicos, em outras regiões do país.",
  },
  {
    question:
      "Quanto tempo leva um processo previdenciário, tributário ou civil?",
    answer:
      "O prazo varia de acordo com o tipo de processo e a instância. Essa estimativa é discutida caso a caso na consulta inicial.",
  },
];

const street = "R. Brilhante, n° 983";
const neighborhood = "Vila Bandeirante";
const city = "Campo Grande";
const state = "MS";
const postalCode = "79005-520";

export const contact = {
  street,
  neighborhood,
  city,
  state,
  postalCode,
  addressLines: [street, `${neighborhood}, ${city}/${state} — CEP ${postalCode}`],
  phone: "(67) 9955-9249",
  phoneIntl: "+55 67 99955-9249",
  email: "contato@dantasgimenez.adv.br",
};

export const footer = {
  disclaimer:
    "Conteúdo elaborado em conformidade com o Provimento 205/2021 do Conselho Federal da OAB, com finalidade meramente informativa, sem caráter publicitário ou promessa de resultado.",
  copyright: "© 2026 Dantas Gimenez & Machado Advogados",
  team: "Deborah C. P. Dantas Gimenez · Vinícius Mattos Machado · Antoliano Santana Gimenez",
};
