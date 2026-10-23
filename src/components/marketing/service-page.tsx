import { WebDesignPage } from "./web-design-page";
import Link from "next/link";
import { services, type Service } from "@/content/services";
import { FAQAccordion, ProcessSteps, ServiceHero } from "./commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
const inclusionDescriptions: Record<string, string> = {
 "Diseño a medida": "Una experiencia visual y unos recorridos adaptados a tu negocio.",
 "Gestor de contenidos": "Contenido editable según las necesidades y el alcance acordado.",
 "SEO técnico": "Estructura, metadata y rendimiento preparados desde el inicio.",
 "Formulario conectado": "Una vía clara para recibir y gestionar solicitudes.",
 "Análisis de procesos": "Entendemos cómo trabajáis y dónde puede ayudar una herramienta propia.",
 "Integraciones": "Conexiones con otros sistemas tras revisar sus API y viabilidad.",
 "Roles y permisos": "Acceso a datos y operaciones según cada perfil.",
 "Mantenimiento": "Un alcance de soporte y evolución acordado para tu herramienta.",
 "UX de producto": "Flujos útiles y claros para las personas que usan el servicio.",
 "Área de usuarios": "Acceso y funciones definidos para cada usuario.",
 "Panel de administración": "Herramientas para gestionar la actividad del servicio.",
 "API": "Interfaces para conectar los datos y operaciones necesarios.",
 "Definición de alcance": "Priorizamos el recorrido principal que necesitas validar.",
 "Prototipo": "Contrastamos la experiencia antes de construir la primera versión.",
 "Primera versión": "Una base funcional centrada en la propuesta de valor.",
 "Métricas": "Acordamos qué observar para aprender del uso real.",
};
const situations = {
 web: ["Tu negocio ha cambiado y tu web ya no lo explica", "En móvil cuesta encontrar lo importante", "Tus visitas no encuentran una vía de contacto clara", "Actualizar el contenido depende siempre de alguien"],
 software: ["Tus procesos clave dependen de hojas de cálculo", "Usas herramientas que no se conectan entre sí", "Repites tareas manuales cada día", "Tu software no crece al ritmo del equipo"],
 app: ["Tus usuarios necesitan operar desde el navegador", "Cada perfil necesita accesos y permisos distintos", "Tu servicio depende de tareas por email", "No tienes un panel para gestionar la actividad"],
 automatizacion: ["Tus herramientas necesitan conectarse", "Las tareas repetitivas consumen tiempo"],
 mvp: ["Tienes una idea y necesitas concretar el primer paso", "La lista de funcionalidades no deja de crecer", "Necesitas probar la propuesta con usuarios", "Quieres aprender antes de invertir en el producto completo"],
};
export function ServicePage({ service }: { service: Service }) {
 if (service.uiType === "web") return <WebDesignPage />;
 const related = services.find(item => item.slug === service.related)!;
 return <><ServiceHero service={service} /><Section><Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]"><h2 className="section-title">¿Te suena alguna de estas situaciones?</h2><div className="grid gap-4 sm:grid-cols-2">{situations[service.uiType].map(item => <div key={item} className="rounded-[14px] border border-line bg-paper-soft p-6"><span aria-hidden="true" className="text-violet">↗</span><h3 className="mt-4 font-bold leading-relaxed">{item}</h3></div>)}</div></Container></Section><Section className="bg-paper-soft"><Container><h2 className="section-title">Qué incluye</h2><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{service.includes.map((item) => <div key={item} className="border-t border-violet pt-5"><h3 className="text-lg font-bold">{item}</h3><p className="mt-3 text-sm leading-relaxed text-ink-500">{inclusionDescriptions[item]}</p></div>)}</div></Container></Section><ProcessSteps items={service.process} /><FAQAccordion items={service.faqs.slice(0,3)} /><Section space="sm"><Container><p className="text-ink-500">Explora también <Link href={related.href} className="font-semibold text-violet underline underline-offset-4">{related.title.toLowerCase()}</Link> o consulta nuestro <Link href="/proyectos/" className="font-semibold text-violet underline underline-offset-4">listado de proyectos</Link>.</p></Container></Section>{["software", "app"].includes(service.uiType) && <Section space="sm"><Container><p className="text-ink-500">Si necesitas conectar herramientas o reducir tareas manuales en procesos existentes, explora <Link href="/automatizacion-procesos-ia/" className="font-semibold text-violet underline underline-offset-4">automatización de procesos e IA</Link>.</p></Container></Section>}</>;
}
