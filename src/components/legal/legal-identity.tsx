import { legalEntity } from "@/config/legal";
export function LegalIdentity() {
  const rows = [["Titular", legalEntity.legalName], ["Identificación fiscal", legalEntity.taxId], ["Domicilio legal", legalEntity.legalAddress], ["Contacto legal", legalEntity.legalEmail], ["Contacto de privacidad", legalEntity.privacyEmail ?? legalEntity.legalEmail], ["Datos registrales", legalEntity.registry.information], ["Autorización administrativa", legalEntity.authorization.information], ["Delegado de protección de datos", legalEntity.dpo.information]];
  return <dl className="space-y-4">{rows.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>)}</dl>;
}
