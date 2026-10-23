import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const command = process.argv[2];
if (command !== "process") {
  console.error("Uso: pnpm leads:process");
  process.exitCode = 1;
} else {
  const { getPrisma } = await import("../src/lib/prisma");
  let connected: ReturnType<typeof getPrisma> | undefined;
  try {
    const db = getPrisma();
    connected = db;
    const { processLeadOutbox } = await import("../src/features/leads/outbox");
    console.info(JSON.stringify(await processLeadOutbox({ limit: 20 })));
  } catch {
    console.error(
      "No se pudo completar la operación de leads. Revisa configuración y estado de la base, sin publicar credenciales.",
    );
    process.exitCode = 1;
  } finally {
    await connected?.$disconnect();
  }
}
