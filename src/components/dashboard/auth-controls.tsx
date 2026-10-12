"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { safeReturnPath } from "@/features/crm/schema";
export function LoginForm({ returnTo, expired }: {
    returnTo: string;
    expired: boolean;
}) {
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState(expired ? "La sesión ha expirado. Inicia sesión de nuevo." : "");
    return <form className="space-y-5" onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            setMessage("");
            const form = new FormData(e.currentTarget);
            try {
                const result = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) });
                if (result.error)
                    setMessage(result.error.status === 429 ? "Demasiados intentos. Espera unos minutos." : result.error.status >= 500 ? "Error temporal. Vuelve a intentarlo." : "Credenciales incorrectas.");
                else
                    window.location.assign(safeReturnPath(returnTo));
            }
            catch {
                setMessage("Error temporal. Vuelve a intentarlo.");
            }
            finally {
                setPending(false);
            }
        }}><label className="block">Email<input className="form-input mt-2" name="email" type="email" autoComplete="username" required maxLength={254}/></label><label className="block">Contraseña<input className="form-input mt-2" name="password" type="password" autoComplete="current-password" required maxLength={128}/></label><p role="status">{message}</p><button className="crm-button w-full" disabled={pending}>{pending ? "Iniciando sesión…" : "Iniciar sesión"}</button></form>;
}
export function LogoutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    return <div><button className="min-h-11 cursor-pointer underline underline-offset-4" disabled={pending} onClick={async () => {
            setPending(true);
            setError("");
            try {
                const result = await authClient.signOut();
                if (result.error)
                    throw new Error();
                router.replace("/login/");
                router.refresh();
            }
            catch {
                setError("No hemos podido cerrar la sesión.");
                setPending(false);
            }
        }}>{pending ? "Cerrando sesión…" : "Cerrar sesión"}</button><p role="alert">{error}</p></div>;
}
