import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        whatWeDo: "What We Do",
        waysToGive: "Ways to Give",
        stories: "Stories",
        aboutUs: "About Us",
        contact: "Contact",
        memberLogin: "Member Login",
        publications: "Publications/Reports",
        donateNow: "Donate Now"
      },
      home: {
        heroTitle: "Transforming Lives Through Compassion",
        heroSubtitle: "Join Crossborders Outreach Ministry Inc in making a lasting impact on communities through sustainable humanitarian programs.",
        getInvolved: "Get Involved",
        latestNews: "Latest News",
        viewAllNews: "View All News"
      },
      programs: {
        foodSupport: "Food Support",
        foodDesc: "Providing nutritious meals and food security to families in need across multiple communities.",
        education: "Education Support",
        educationDesc: "Empowering children through quality education, school supplies, and learning resources.",
        healthcare: "Healthcare Outreach",
        healthcareDesc: "Delivering essential medical care, preventive health services, and wellness programs.",
        economic: "Economic Empowerment",
        economicDesc: "Creating sustainable livelihoods through skills training and microfinance support.",
        helpingFamilies: "Helping Needy Families",
        helpingFamiliesDesc: "Restoring hope and dignity to vulnerable families through comprehensive welfare support and community care.",
        learnMore: "Learn More"
      },
      stats: {
        livesImpacted: "Lives Impacted",
        partnerOrgs: "Partner Organizations",
        corePrograms: "Core Programs",
        countriesReached: "Countries Reached"
      },
      footer: {
        tagline: "Transforming lives across borders through compassion, dedication, and sustainable community impact.",
        ourPrograms: "Our Programs",
        quickLinks: "Quick Links",
        contactUs: "Contact Us",
        missionVision: "Mission & Vision",
        impactStories: "Impact Stories",
        annualReports: "Annual Reports",
        volunteer: "Volunteer",
        partnerWithUs: "Partner With Us",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        accessibility: "Accessibility",
        rightsReserved: "All rights reserved."
      }
    }
  },
  es: {
    translation: {
      nav: {
        whatWeDo: "Lo Que Hacemos",
        waysToGive: "Formas de Donar",
        stories: "Historias",
        aboutUs: "Sobre Nosotros",
        contact: "Contacto",
        memberLogin: "Acceso de Miembros",
        publications: "Publicaciones/Informes",
        donateNow: "Donar Ahora"
      },
      home: {
        heroTitle: "Transformando Vidas a Través de la Compasión",
        heroSubtitle: "Únete a Crossborders Outreach Ministry Inc para crear un impacto duradero en las comunidades a través de programas humanitarios sostenibles.",
        getInvolved: "Participa",
        latestNews: "Últimas Noticias",
        viewAllNews: "Ver Todas las Noticias"
      },
      programs: {
        foodSupport: "Apoyo Alimentario",
        foodDesc: "Proporcionando comidas nutritivas y seguridad alimentaria a familias necesitadas en múltiples comunidades.",
        education: "Apoyo Educativo",
        educationDesc: "Empoderando a los niños a través de educación de calidad, útiles escolares y recursos de aprendizaje.",
        healthcare: "Alcance de Salud",
        healthcareDesc: "Brindando atención médica esencial, servicios de salud preventiva y programas de bienestar.",
        economic: "Empoderamiento Económico",
        economicDesc: "Creando medios de vida sostenibles a través de capacitación en habilidades y apoyo de microfinanzas.",
        helpingFamilies: "Ayudando a Familias Necesitadas",
        helpingFamiliesDesc: "Restaurando la esperanza y la dignidad de las familias vulnerables a través de apoyo integral y cuidado comunitario.",
        learnMore: "Saber Más"
      },
      stats: {
        livesImpacted: "Vidas Impactadas",
        partnerOrgs: "Organizaciones Asociadas",
        corePrograms: "Programas Principales",
        countriesReached: "Países Alcanzados"
      },
      footer: {
        tagline: "Transformando vidas a través de fronteras mediante compasión, dedicación e impacto comunitario sostenible.",
        ourPrograms: "Nuestros Programas",
        quickLinks: "Enlaces Rápidos",
        contactUs: "Contáctenos",
        missionVision: "Misión y Visión",
        impactStories: "Historias de Impacto",
        annualReports: "Informes Anuales",
        volunteer: "Voluntario",
        partnerWithUs: "Asóciate con Nosotros",
        privacyPolicy: "Política de Privacidad",
        termsOfService: "Términos de Servicio",
        accessibility: "Accesibilidad",
        rightsReserved: "Todos los derechos reservados."
      }
    }
  },
  fr: {
    translation: {
      nav: {
        whatWeDo: "Ce Que Nous Faisons",
        waysToGive: "Façons de Donner",
        stories: "Histoires",
        aboutUs: "À Propos",
        contact: "Contact",
        memberLogin: "Connexion Membre",
        publications: "Publications/Rapports",
        donateNow: "Faire un Don"
      },
      home: {
        heroTitle: "Transformer des Vies par la Compassion",
        heroSubtitle: "Rejoignez Crossborders Outreach Ministry Inc pour créer un impact durable dans les communautés grâce à des programmes humanitaires durables.",
        getInvolved: "S'impliquer",
        latestNews: "Dernières Nouvelles",
        viewAllNews: "Voir Toutes les Nouvelles"
      },
      programs: {
        foodSupport: "Aide Alimentaire",
        foodDesc: "Fournir des repas nutritifs et la sécurité alimentaire aux familles dans le besoin dans plusieurs communautés.",
        education: "Soutien à l'Éducation",
        educationDesc: "Autonomiser les enfants grâce à une éducation de qualité, des fournitures scolaires et des ressources d'apprentissage.",
        healthcare: "Sensibilisation à la Santé",
        healthcareDesc: "Fournir des soins médicaux essentiels, des services de santé préventive et des programmes de bien-être.",
        economic: "Autonomisation Économique",
        economicDesc: "Créer des moyens de subsistance durables grâce à la formation professionnelle et au soutien de la microfinance.",
        helpingFamilies: "Aider les Familles Nécessiteuses",
        helpingFamiliesDesc: "Restaurer l'espoir et la dignité des familles vulnérables grâce à un soutien social complet et des soins communautaires.",
        learnMore: "En Savoir Plus"
      },
      stats: {
        livesImpacted: "Vies Impactées",
        partnerOrgs: "Organisations Partenaires",
        corePrograms: "Programmes Principaux",
        countriesReached: "Pays Atteints"
      },
      footer: {
        tagline: "Transformer des vies au-delà des frontières grâce à la compassion, au dévouement et à l'impact communautaire durable.",
        ourPrograms: "Nos Programmes",
        quickLinks: "Liens Rapides",
        contactUs: "Nous Contacter",
        missionVision: "Mission et Vision",
        impactStories: "Histoires d'Impact",
        annualReports: "Rapports Annuels",
        volunteer: "Bénévole",
        partnerWithUs: "Partenariat",
        privacyPolicy: "Politique de Confidentialité",
        termsOfService: "Conditions de Service",
        accessibility: "Accessibilité",
        rightsReserved: "Tous droits réservés."
      }
    }
  },
  pt: {
    translation: {
      nav: {
        whatWeDo: "O Que Fazemos",
        waysToGive: "Formas de Doar",
        stories: "Histórias",
        aboutUs: "Sobre Nós",
        contact: "Contato",
        memberLogin: "Login de Membro",
        publications: "Publicações/Relatórios",
        donateNow: "Doe Agora"
      },
      home: {
        heroTitle: "Transformando Vidas Através da Compaixão",
        heroSubtitle: "Junte-se ao Crossborders Outreach Ministry Inc para criar um impacto duradouro nas comunidades através de programas humanitários sustentáveis.",
        getInvolved: "Participe",
        latestNews: "Últimas Notícias",
        viewAllNews: "Ver Todas as Notícias"
      },
      programs: {
        foodSupport: "Apoio Alimentar",
        foodDesc: "Fornecendo refeições nutritivas e segurança alimentar para famílias necessitadas em várias comunidades.",
        education: "Apoio à Educação",
        educationDesc: "Capacitando crianças através de educação de qualidade, materiais escolares e recursos de aprendizagem.",
        healthcare: "Assistência à Saúde",
        healthcareDesc: "Fornecendo cuidados médicos essenciais, serviços de saúde preventiva e programas de bem-estar.",
        economic: "Empoderamento Econômico",
        economicDesc: "Criando meios de subsistência sustentáveis através de treinamento de habilidades e apoio de microfinanças.",
        helpingFamilies: "Ajudando Famílias Necessitadas",
        helpingFamiliesDesc: "Restaurando a esperança e a dignidade das famílias vulneráveis através de apoio social abrangente e cuidados comunitários.",
        learnMore: "Saiba Mais"
      },
      stats: {
        livesImpacted: "Vidas Impactadas",
        partnerOrgs: "Organizações Parceiras",
        corePrograms: "Programas Principais",
        countriesReached: "Países Alcançados"
      },
      footer: {
        tagline: "Transformando vidas além das fronteiras através da compaixão, dedicação e impacto comunitário sustentável.",
        ourPrograms: "Nossos Programas",
        quickLinks: "Links Rápidos",
        contactUs: "Fale Conosco",
        missionVision: "Missão e Visão",
        impactStories: "Histórias de Impacto",
        annualReports: "Relatórios Anuais",
        volunteer: "Voluntário",
        partnerWithUs: "Parceria",
        privacyPolicy: "Política de Privacidade",
        termsOfService: "Termos de Serviço",
        accessibility: "Acessibilidade",
        rightsReserved: "Todos os direitos reservados."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
