import { serviceDefinitions } from "../config/services.ts";
import type { Service } from "./services";
export const automationService: Service = {
  ...serviceDefinitions.automatizacion,
  slug: "automatizacion-procesos-ia",
  includes: ["Análisis del proceso", "Integraciones y workflows", "IA cuando aporta valor", "Validación y supervisión"],
  idealFor: "Empresas con tareas repetitivas, información dispersa o herramientas que necesitan conectarse.",
  description: "Optimizamos procesos empresariales mediante automatizaciones, integraciones y soluciones de inteligencia artificial.",
  seoTitle: "Automatización de Procesos e IA en Barcelona | ASIVQUARK",
  seoDescription: "Automatizamos procesos, conectamos herramientas e integramos inteligencia artificial para mejorar la eficiencia de empresas en Barcelona y toda España.",
  h1: "Automatización de procesos e inteligencia artificial para empresas",
  intro: "Eliminamos tareas repetitivas, conectamos tus herramientas y desarrollamos soluciones de automatización e IA adaptadas a los procesos de tu negocio.",
  cta: "Analicemos tu proceso",
  sections: [
    {
      title: "¿Tu empresa pierde tiempo en tareas que podrían automatizarse?",
      intro: "Muchas empresas dedican tiempo a copiar información, actualizar herramientas, procesar documentos o repetir operaciones que podrían resolverse mediante software e integraciones.",
      items: [
        { title: "Introducción manual de datos", description: "Copiar el mismo dato en varios lugares consume tiempo y favorece errores. Una integración puede trasladarlo con validaciones y reglas definidas." },
        { title: "Herramientas que no se comunican", description: "Los equipos trabajan con información distinta. Podemos valorar conexiones entre sus sistemas para compartir datos según sus interfaces y permisos." },
        { title: "Procesamiento repetitivo de documentos", description: "Leer y registrar documentos uno a uno ralentiza la operativa. Reglas y extracción asistida pueden preparar información para su revisión." },
        { title: "Solicitudes y correos que requieren clasificación", description: "Separar y derivar cada entrada manualmente dificulta la gestión. Un flujo con reglas o clasificación asistida puede dirigirla al equipo adecuado." },
        { title: "Informes elaborados manualmente", description: "Reunir datos cada semana repite el mismo esfuerzo. Un proceso programado puede recopilar y transformar las fuentes disponibles." },
        { title: "Procesos administrativos poco eficientes", description: "Los traspasos entre personas y herramientas pueden generar esperas. Revisamos el flujo para identificar qué pasos conviene conectar o automatizar." },
      ],
    },
    {
      title: "¿Qué podemos automatizar en tu negocio?",
      items: [
        { title: "Automatización de tareas repetitivas", description: "Diseñamos flujos de trabajo que ejecutan automáticamente operaciones recurrentes y reducen la necesidad de intervención manual." },
        { title: "Integración entre aplicaciones", description: "Conectamos herramientas y plataformas mediante APIs para compartir información y evitar duplicidades." },
        { title: "Procesamiento inteligente de documentos", description: "Desarrollamos soluciones que ayudan a extraer, clasificar y organizar información de documentos mediante reglas e inteligencia artificial." },
        { title: "Automatización comercial", description: "Conectamos formularios, sistemas de gestión y procesos de seguimiento para simplificar operaciones comerciales." },
        { title: "Asistentes internos con IA", description: "Exploramos asistentes especializados que permiten consultar información y documentación empresarial con controles adecuados de acceso y supervisión." },
        { title: "Informes y flujos de datos", description: "Automatizamos la recopilación, transformación y presentación de información procedente de distintos sistemas." },
      ],
    },
    {
      title: "No todos los procesos necesitan inteligencia artificial",
      intro: "Elegimos la tecnología adecuada para cada proceso. Si una automatización sencilla resuelve el problema, no necesitas añadir inteligencia artificial.",
      items: [
        { title: "Automatización tradicional", description: "Integraciones entre sistemas, reglas de negocio, envío de notificaciones, sincronización de datos, procesos programados y workflows. Cuando las entradas y las reglas están bien definidas, se puede resolver sin IA." },
        { title: "Automatización con IA", description: "Clasificación de textos, extracción de información documental, procesamiento de lenguaje, análisis de contenido, asistentes basados en conocimiento e interpretación de información no estructurada. Los resultados pueden requerir validación y supervisión humana." },
      ],
    },
    {
      title: "Menos tareas manuales. Más tiempo para tu negocio.",
      intro: "Estos son beneficios potenciales. Su alcance depende del proceso, la calidad de los datos y la forma de implantar y supervisar la solución.",
      items: [
        { title: "Reducir trabajo repetitivo", description: "Dedicar menos intervención manual a operaciones recurrentes y reservar tiempo para tareas que requieren criterio." },
        { title: "Mejorar la consistencia de los procesos", description: "Aplicar reglas definidas y comprobar excepciones con un procedimiento claro." },
        { title: "Evitar duplicidades", description: "Reducir la repetición de datos y operaciones entre herramientas conectadas." },
        { title: "Centralizar información", description: "Organizar los datos necesarios para trabajar sin reconstruirlos en cada paso." },
        { title: "Agilizar operaciones", description: "Simplificar traspasos y tareas administrativas cuando la integración es viable." },
        { title: "Facilitar el crecimiento de los sistemas", description: "Documentar flujos y conexiones para valorar nuevas necesidades sin perder control." },
      ],
    },
    {
      title: "Ejemplos de procesos que podemos ayudarte a mejorar",
      intro: "Posibles aplicaciones ilustrativas, no proyectos realizados ni casos de éxito de ASIVQUARK.",
      items: [
        { title: "Gestión de solicitudes comerciales", description: "Centralizar formularios, clasificar solicitudes y conectar los datos con sistemas comerciales." },
        { title: "Procesamiento de facturas y documentos", description: "Extraer información de documentos y preparar su revisión antes de incorporarla a un sistema de gestión." },
        { title: "Integración entre aplicaciones", description: "Sincronizar información entre herramientas utilizadas por distintos departamentos." },
        { title: "Consultas sobre documentación interna", description: "Crear asistentes que permitan localizar información dentro de documentos autorizados." },
        { title: "Elaboración de informes", description: "Recopilar datos periódicamente y generar informes estructurados." },
      ],
    },
    {
      title: "Soluciones que se adaptan a tus herramientas",
      intro: "Analizamos las herramientas que ya utiliza tu empresa y valoramos la forma más adecuada de conectarlas. La viabilidad depende de las interfaces disponibles, los permisos y las restricciones de cada plataforma.",
      items: [
        { title: "APIs, webhooks e integraciones personalizadas", description: "Intercambiar información y reaccionar a cambios mediante conexiones ajustadas a los sistemas disponibles." },
        { title: "Procesos programados, bases de datos y plataformas de automatización", description: "Coordinar tareas recurrentes y flujos de datos con la solución adecuada al volumen y al mantenimiento previsto." },
        { title: "Modelos de IA cuando corresponde", description: "Valorar modelos para información no estructurada cuando aporten utilidad, considerando sus límites, costes y condiciones de tratamiento de datos." },
      ],
    },
    {
      title: "Automatización con control y seguridad",
      intro: "Diseñamos según el riesgo del proceso y las necesidades técnicas y de privacidad del proyecto. La automatización y la IA no garantizan por sí solas cumplimiento normativo ni resultados perfectos.",
      items: [
        { title: "Protección de información y permisos", description: "Definir qué datos necesita cada flujo, quién puede acceder y qué proveedores intervienen. El tratamiento de datos personales debe revisarse en el contexto concreto." },
        { title: "Validación y registro de operaciones", description: "Comprobar resultados, gestionar errores y registrar operaciones relevantes de forma proporcionada para poder revisar el funcionamiento." },
        { title: "Supervisión humana", description: "Establecer revisión cuando las decisiones o el riesgo lo requieran. Los modelos de IA pueden equivocarse; no se presupone precisión perfecta ni se delegan todas las decisiones." },
      ],
    },
  ],
  process: [
    { title: "Análisis", description: "Entendemos cómo funciona actualmente tu proceso y dónde aparecen tareas repetitivas o cuellos de botella." },
    { title: "Propuesta", description: "Definimos qué partes conviene automatizar y qué tecnología puede resolverlas." },
    { title: "Desarrollo", description: "Construimos las integraciones, workflows o herramientas necesarias." },
    { title: "Validación", description: "Probamos los flujos con escenarios reales y revisamos los resultados." },
    { title: "Evolución", description: "Preparamos la solución para incorporar mejoras y adaptaciones futuras." },
  ],
  faqs: [
    { question: "¿Qué procesos se pueden automatizar en una empresa?", answer: "Tareas repetitivas con entradas y pasos identificables: sincronización de datos, clasificación de solicitudes, preparación de documentos o informes. Revisamos excepciones, permisos y riesgos antes de proponer una solución." },
    { question: "¿Necesito inteligencia artificial para automatizar tareas?", answer: "No. Muchas tareas se resuelven con reglas, APIs y procesos programados. La IA se valora cuando el proceso necesita interpretar texto o información no estructurada y sus resultados pueden validarse adecuadamente." },
    { question: "¿Se pueden conectar las aplicaciones que ya utilizo?", answer: "Depende de sus APIs, webhooks, permisos y restricciones. Analizamos las herramientas existentes y su viabilidad; no prometemos conectar cualquier plataforma." },
    { question: "¿Cuánto cuesta automatizar un proceso empresarial?", answer: "El coste depende de la complejidad, el número de integraciones, el volumen y calidad de los datos, el mantenimiento y las necesidades de seguridad. Definimos el alcance antes de preparar un presupuesto, sin tarifas universales." },
    { question: "¿Se puede empezar automatizando una sola tarea?", answer: "Sí. Un flujo acotado permite comprobar utilidad y excepciones antes de ampliar la solución. Priorizamos tareas concretas con criterios de validación acordados." },
    { question: "¿Es posible integrar IA en un software existente?", answer: "Puede ser viable según su arquitectura y las interfaces disponibles. Revisamos accesos, tratamiento de datos, costes y supervisión para decidir si un modelo aporta valor al caso concreto." },
    { question: "¿Trabajáis con empresas de Barcelona?", answer: "Sí. ASIVQUARK está en Barcelona y trabaja también con empresas de toda España mediante comunicación remota y revisiones organizadas." },
  ],
  related: "software-a-medida-barcelona",
};
