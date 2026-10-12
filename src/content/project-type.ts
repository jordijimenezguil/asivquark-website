import { services, type Service } from "./services.ts";
export type PublicProjectType = Service["uiType"] | "otro";
export const projectOptions = [
  ...services.map(service => ({ value: service.uiType, label: service.title })),
  { value: "otro" as const, label: "Otro proyecto" },
];
export function parsePublicProjectType(values: readonly string[]): PublicProjectType {
  return values.length === 1 && projectOptions.some(option => option.value === values[0]) ? values[0] as PublicProjectType : "web";
}
export function projectTypeForContract(type: PublicProjectType): Service["query"] | "otro" {
  return type === "otro" ? "otro" : services.find(service => service.uiType === type)!.query;
}
export function parseContactProjectType(tipo: readonly string[], servicio: readonly string[]): PublicProjectType {
  if (servicio.length) {
    if (servicio.length !== 1 || tipo.length) return "web";
    if (servicio[0] === "otro") return "otro";
    return services.find(service => service.query === servicio[0])?.uiType ?? "web";
  }
  return parsePublicProjectType(tipo.map(value => value === "soft" ? "software" : value));
}
