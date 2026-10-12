import nextEnv from "@next/env";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { hashPassword } from "better-auth/crypto";
nextEnv.loadEnvConfig(process.cwd());
// Credentials are read through a private file descriptor, never argv or environment.
const command = process.argv[2];
if (!["create", "reset-password"].includes(command) || process.stdin.isTTY) {
    console.error("Uso: pnpm admin:account create|reset-password < /ruta/privada/cuenta.json");
    process.exitCode = 1;
}
else {
    const { getPrisma } = await import("../src/lib/prisma");
    let db: ReturnType<typeof getPrisma> | undefined;
    try {
        const input = z.strictObject({ email: z.email().transform(s => s.toLowerCase()), name: z.string().trim().min(1).max(100), password: z.string().min(12).max(128) }).parse(JSON.parse(readFileSync(0, "utf8")));
        db = getPrisma();
        const password = await hashPassword(input.password);
        await db.$transaction(async (tx) => {
            const existing = await tx.user.findUnique({ where: { email: input.email }, select: { id: true, role: true } });
            if (existing && existing.role !== "admin")
                throw new Error("REFUSE_PROMOTION");
            if (command === "create") {
                if (existing)
                    return;
                const id = randomUUID();
                await tx.user.create({ data: { id, name: input.name, email: input.email, role: "admin", accounts: { create: { id: randomUUID(), accountId: id, providerId: "credential", password } } } });
            }
            else {
                if (!existing)
                    throw new Error("NOT_FOUND");
                const result = await tx.account.updateMany({ where: { userId: existing.id, providerId: "credential" }, data: { password } });
                if (result.count !== 1)
                    throw new Error("INVALID_ACCOUNT");
                await tx.session.deleteMany({ where: { userId: existing.id } });
            }
        });
        console.info("Operación administrativa completada.");
    }
    catch {
        console.error("Operación rechazada. Revisa el destino, los datos y el rol existente en el entorno privado.");
        process.exitCode = 1;
    }
    finally {
        await db?.$disconnect();
    }
}
