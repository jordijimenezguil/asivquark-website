import { services, type Service } from "./services.ts";
export function parsePublicProjectType(values: readonly string[]): Service["uiType"] {
 return values.length === 1 && services.some(service => service.uiType === values[0]) ? values[0] as Service["uiType"] : "web";
}
export function projectTypeForContract(type: Service["uiType"]): Service["query"] {
 return services.find(service => service.uiType === type)!.query;
}
