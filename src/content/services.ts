import { webDesignService } from "./web-design.ts";
import { serviceDefinitions } from "../config/services.ts";
import { automationService } from "./automation.ts";
export type ContentItem = { title: string; description: string };
export type FAQ = { question: string; answer: string };
export type Service = {
  slug: string;
  href: string;
  navigationLabel: string;
  title: string;
  uiType: "web" | "software" | "app" | "mvp" | "automatizacion";
  includes: string[];
  idealFor: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoOpenGraphDescription?: string;
  h1: string;
  intro: string;
  cta: string;
  query: "web" | "software" | "aplicacion" | "mvp" | "automatizacion";
  sections: { title: string; intro?: string; items: ContentItem[] }[];
  process: ContentItem[];
  faqs: FAQ[];
  related: string;
};
export const services: Service[] = [
  webDesignService,
  {
    ...serviceDefinitions.software,
    slug: "software-a-medida-barcelona",
    includes: ["Análisis de procesos", "Integraciones", "Roles y permisos", "Mantenimiento"],
    idealFor: "Empresas con hojas de cálculo o herramientas que no encajan con sus procesos.",
    description:
      "Herramientas adaptadas a tus procesos y a la forma de trabajar de tu empresa.",
    seoTitle: "Desarrollo de Software a Medida en Barcelona | ASIVQUARK",
    seoDescription:
      "Creamos software a medida para empresas: herramientas de gestión, plataformas, integraciones y soluciones digitales personalizadas.",
    h1: "Desarrollo de software a medida para empresas",
    intro:
      "Cuando las herramientas disponibles no encajan, conviene entender el proceso antes de escribir código. Desde Barcelona, diseñamos soluciones ajustadas a las necesidades de cada empresa.",
    cta: "Cuéntanos qué software necesitas",
    sections: [
      {
        title: "Cuando el proceso necesita otra herramienta",
        items: [
          {
            title: "Información dispersa",
            description:
              "Unificar información que hoy se reparte entre hojas de cálculo y aplicaciones.",
          },
          {
            title: "Tareas repetitivas",
            description:
              "Identificar operaciones que pueden automatizarse con reglas claras.",
          },
          {
            title: "Sistemas desconectados",
            description:
              "Reducir la introducción manual de datos entre herramientas, cuando sus interfaces lo permiten.",
          },
        ],
      },
      {
        title: "Soluciones que podemos desarrollar",
        items: [
          {
            title: "Herramientas de gestión",
            description:
              "Procesos, estados y datos adaptados a la operativa del negocio.",
          },
          {
            title: "Plataformas internas",
            description:
              "Espacios de trabajo para coordinar información y tareas.",
          },
          {
            title: "Automatizaciones e integraciones",
            description:
              "Flujos entre sistemas con controles de errores y trazabilidad.",
          },
          {
            title: "Portales de clientes",
            description:
              "Acceso a información y operaciones según permisos definidos.",
          },
          {
            title: "Sistemas operativos de negocio",
            description:
              "Aplicaciones que conectan distintas etapas de un proceso empresarial.",
          },
        ],
        intro:
          "Estos son tipos de proyecto que podemos abordar, no casos de éxito publicados.",
      },
      {
        title: "Beneficios que orientan el proyecto",
        items: [
          {
            title: "Menos fricción",
            description:
              "Diseñar alrededor de las tareas que las personas realizan cada día.",
          },
          {
            title: "Información útil",
            description:
              "Dar acceso a datos consistentes para tomar decisiones.",
          },
          {
            title: "Control del alcance",
            description:
              "Priorizar los cambios que aportan utilidad al proceso.",
          },
        ],
      },
      {
        title: "Integraciones y evolución",
        items: [
          {
            title: "Revisar interfaces",
            description:
              "Comprobamos APIs, restricciones y permisos antes de comprometer una integración.",
          },
          {
            title: "Proteger los datos",
            description:
              "Definimos accesos y tratamiento de información según las necesidades del proyecto.",
          },
          {
            title: "Evolucionar con criterio",
            description:
              "Documentamos decisiones y planificamos ampliaciones cuando tengan sentido.",
          },
        ],
      },
      {
        title: "Cómo valoramos el presupuesto",
        items: [
          {
            title: "Complejidad del proceso",
            description: "Reglas, excepciones y volumen de operaciones.",
          },
          {
            title: "Datos e integraciones",
            description:
              "Origen, calidad de los datos y capacidades de los sistemas existentes.",
          },
          {
            title: "Usuarios y soporte",
            description:
              "Roles, validaciones, despliegue y mantenimiento acordado.",
          },
        ],
      },
    ],
    process: [
      {
        title: "Analizar la operativa",
        description:
          "Escuchamos a quienes usan el proceso y localizamos las dificultades.",
      },
      {
        title: "Definir requisitos",
        description: "Acordamos flujos, reglas y criterios de aceptación.",
      },
      {
        title: "Desarrollar por fases",
        description:
          "Construimos y revisamos funcionalidades con prioridades claras.",
      },
      {
        title: "Implantar y evolucionar",
        description:
          "Planificamos puesta en marcha, documentación y siguientes mejoras.",
      },
    ],
    faqs: [
      {
        question: "¿Cuándo conviene software a medida?",
        answer:
          "Cuando un proceso importante requiere reglas o integraciones que las herramientas existentes no resuelven bien. Primero valoramos si una solución ya disponible puede ser suficiente.",
      },
      {
        question: "¿Se puede conectar con mis sistemas?",
        answer:
          "Depende de sus APIs, permisos y restricciones. Revisamos la viabilidad antes de definir el alcance.",
      },
      {
        question: "¿Es necesario hacerlo todo a la vez?",
        answer:
          "No. Podemos dividir el trabajo en fases útiles y revisar prioridades tras cada entrega.",
      },
      {
        question: "¿Incluye mantenimiento?",
        answer:
          "Las condiciones de soporte, corrección y evolución se definen en el acuerdo del proyecto.",
      },
    ],
    related: "aplicaciones-web-barcelona",
  },
  {
    ...serviceDefinitions.app,
    slug: "aplicaciones-web-barcelona",
    includes: ["UX de producto", "Área de usuarios", "Panel de administración", "API"],
    idealFor: "Servicios digitales para clientes o equipos que trabajan desde el navegador.",
    description:
      "Plataformas accesibles desde el navegador, con flujos y permisos bien definidos.",
    seoTitle: "Desarrollo de Aplicaciones Web en Barcelona | ASIVQUARK",
    seoDescription:
      "Desarrollamos aplicaciones web, plataformas SaaS y herramientas digitales adaptadas a las necesidades de tu negocio.",
    h1: "Desarrollo de aplicaciones web a medida",
    intro:
      "Una aplicación web permite realizar tareas desde el navegador: gestionar información, colaborar o prestar un servicio digital. Construimos la experiencia y la arquitectura alrededor de esos usos.",
    cta: "Hablemos de tu aplicación",
    sections: [
      {
        title: "Más allá de una página informativa",
        items: [
          {
            title: "Interacción y datos",
            description:
              "Una web corporativa explica un negocio; una aplicación permite trabajar con información y completar operaciones.",
          },
          {
            title: "Acceso desde navegador",
            description:
              "Los usuarios acceden a una plataforma centralizada sin instalar una aplicación de escritorio.",
          },
        ],
      },
      {
        title: "Cuándo tiene sentido una aplicación web",
        items: [
          {
            title: "Colaboración",
            description:
              "Varias personas necesitan trabajar sobre información compartida.",
          },
          {
            title: "Servicio digital",
            description:
              "Tu propuesta requiere que los usuarios realicen acciones y consulten datos.",
          },
          {
            title: "Acceso organizado",
            description:
              "Necesitas separar responsabilidades y permisos por tipo de usuario.",
          },
        ],
      },
      {
        title: "Tipos de aplicaciones",
        items: [
          {
            title: "Plataformas SaaS",
            description:
              "Productos digitales con funcionalidades para diferentes usuarios o empresas.",
          },
          {
            title: "Dashboards",
            description:
              "Paneles para consultar información y realizar operaciones.",
          },
          {
            title: "Portales privados",
            description:
              "Acceso a recursos y procesos con permisos específicos.",
          },
          {
            title: "Herramientas internas",
            description:
              "Aplicaciones de gestión adaptadas al trabajo del equipo.",
          },
          {
            title: "Usuarios y roles",
            description:
              "Flujos de acceso y autorización definidos según responsabilidades.",
          },
        ],
      },
      {
        title: "Arquitectura preparada para el uso real",
        items: [
          {
            title: "Seguridad desde el diseño",
            description:
              "Validación de entradas y comprobación de permisos en servidor.",
          },
          {
            title: "Rendimiento",
            description:
              "Estructura de datos y carga de recursos según los flujos más relevantes.",
          },
          {
            title: "Escalabilidad razonada",
            description:
              "Diseñamos para las necesidades previstas y revisamos capacidad con datos de uso; evitamos infraestructura sin una necesidad real.",
          },
        ],
      },
    ],
    process: [
      {
        title: "Diseñar los recorridos",
        description: "Definimos tareas, usuarios y pantallas necesarias.",
      },
      {
        title: "Acordar la arquitectura",
        description: "Revisamos datos, integraciones y requisitos de acceso.",
      },
      {
        title: "Construir y comprobar",
        description:
          "Desarrollamos funcionalidades y validamos los recorridos principales.",
      },
      {
        title: "Preparar la operación",
        description: "Acordamos despliegue, observabilidad y evolución.",
      },
    ],
    faqs: [
      {
        question: "¿Qué diferencia hay con software a medida?",
        answer:
          "Software a medida describe una solución adaptada al negocio. Una aplicación web es una forma de ofrecerla desde el navegador, con especial atención a la interfaz y los flujos de usuario.",
      },
      {
        question: "¿Puede tener usuarios con distintos permisos?",
        answer:
          "Sí, si forma parte del alcance. Los permisos se diseñan por rol y se verifican en servidor.",
      },
      {
        question: "¿Funciona en móvil?",
        answer:
          "Diseñamos una interfaz responsive. Las necesidades de trabajo sin conexión o de funciones nativas deben valorarse por separado.",
      },
      {
        question: "¿Puede empezar como MVP?",
        answer:
          "Sí. Una primera versión puede centrarse en el recorrido principal y ampliarse tras recoger información de uso.",
      },
    ],
    related: "software-a-medida-barcelona",
  },
  {
    ...serviceDefinitions.mvp,
    slug: "desarrollo-mvp",
    includes: ["Definición de alcance", "Prototipo", "Primera versión", "Métricas"],
    idealFor: "Emprendedores que necesitan poner a prueba una primera versión de su producto.",
    description:
      "Una primera versión útil para poner a prueba la propuesta de tu producto.",
    seoTitle: "Desarrollo de MVP para Startups y Emprendedores | ASIVQUARK",
    seoDescription:
      "Transformamos tu idea en un producto mínimo viable. Diseñamos y desarrollamos MVP para validar proyectos digitales y evolucionar.",
    h1: "Desarrollo de MVP para startups y emprendedores",
    intro:
      "Convertimos una idea en una primera versión con un propósito concreto. Definimos contigo qué necesitas aprender y qué recorrido debe funcionar para poder probarlo con usuarios.",
    cta: "Cuéntanos tu idea",
    sections: [
      {
        title: "Qué es un producto mínimo viable",
        items: [
          {
            title: "Una hipótesis concreta",
            description:
              "El MVP permite poner a prueba una propuesta con una experiencia funcional.",
          },
          {
            title: "Un alcance deliberado",
            description:
              "Mínimo significa centrado en lo esencial; la calidad del recorrido principal sigue siendo importante.",
          },
        ],
      },
      {
        title: "Por qué empezar con una versión reducida",
        items: [
          {
            title: "Priorizar la inversión",
            description:
              "Concentrar el desarrollo en la pregunta de negocio más relevante.",
          },
          {
            title: "Aprender del uso",
            description:
              "Observar qué entienden los usuarios y dónde encuentran dificultades.",
          },
          {
            title: "Revisar decisiones",
            description:
              "Cambiar prioridades antes de ampliar el producto completo.",
          },
        ],
      },
      {
        title: "Qué incluir en la primera versión",
        items: [
          {
            title: "Recorrido principal",
            description:
              "Las acciones necesarias para que el usuario reciba el valor propuesto.",
          },
          {
            title: "Datos imprescindibles",
            description:
              "La información y validaciones que necesita ese recorrido.",
          },
          {
            title: "Criterios de aprendizaje",
            description:
              "Definir cómo recoger feedback y qué decisiones se tomarán con él.",
          },
        ],
      },
      {
        title: "Qué conviene posponer",
        items: [
          {
            title: "Funciones secundarias",
            description:
              "Variantes y personalizaciones que no ayudan a validar la hipótesis inicial.",
          },
          {
            title: "Automatización completa",
            description:
              "Algunas tareas pueden resolverse manualmente mientras se comprueba su necesidad.",
          },
          {
            title: "Escala no demostrada",
            description:
              "Infraestructura compleja que todavía no exige el uso real del producto.",
          },
        ],
      },
      {
        title: "Después del lanzamiento",
        items: [
          {
            title: "Revisar evidencia",
            description:
              "Contrastamos feedback y uso con las preguntas iniciales.",
          },
          {
            title: "Elegir el siguiente paso",
            description:
              "Mejorar, ampliar o replantear el alcance según lo aprendido.",
          },
          {
            title: "Evolucionar la base",
            description:
              "Ajustamos arquitectura y capacidad cuando las necesidades lo justifican.",
          },
        ],
      },
    ],
    process: [
      {
        title: "Definir la hipótesis",
        description: "Aclaramos público, problema y propuesta de valor.",
      },
      {
        title: "Priorizar el alcance",
        description: "Elegimos el recorrido esencial y lo que queda fuera.",
      },
      {
        title: "Diseñar y desarrollar",
        description:
          "Construimos la primera versión y comprobamos su funcionamiento.",
      },
      {
        title: "Lanzar y aprender",
        description: "Planificamos pruebas con usuarios y próximas decisiones.",
      },
    ],
    faqs: [
      {
        question: "¿Puedo venir solo con una idea?",
        answer:
          "Sí. Empezamos por concretar el problema, el público y el recorrido que permitiría probar la propuesta.",
      },
      {
        question: "¿Un MVP garantiza validar el negocio?",
        answer:
          "No. Facilita pruebas y aprendizaje, pero la respuesta del mercado depende de factores que el desarrollo no puede garantizar.",
      },
      {
        question: "¿Cuánto tarda en desarrollarse?",
        answer:
          "Depende del alcance, los datos y las integraciones. Definimos una estimación después de acordar la primera versión.",
      },
      {
        question: "¿Se puede ampliar después?",
        answer:
          "Sí. Planificamos una base mantenible y revisamos las ampliaciones según el aprendizaje y las necesidades reales.",
      },
    ],
    related: "aplicaciones-web-barcelona",
  },
  automationService,
];
