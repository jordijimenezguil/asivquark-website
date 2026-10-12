import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const command = process.argv[2];
if (!["process", "cleanup"].includes(command)) {
  console.error("Uso: pnpm leads:process | pnpm leads:cleanup [--execute]");
  process.exitCode = 1;
} else {
  const { getPrisma } = await import("../src/lib/prisma");
  let connected: ReturnType<typeof getPrisma> | undefined;
  try {
    const db = getPrisma();
    connected = db;
    if (command === "process") {
      const { processLeadOutbox } =
        await import("../src/features/leads/outbox");
      console.info(JSON.stringify(await processLeadOutbox({ limit: 20 })));
    } else {
      const now = new Date();
      if (!process.argv.includes("--execute")) {
        console.info(
          JSON.stringify({
            expiredLeads: await db.lead.count({
              where: { expiresAt: { lte: now } },
            }),
            expiredRateBuckets: await db.leadRateBucket.count({
              where: { expiresAt: { lte: now } },
            }),
            executed: false,
          }),
        );
      } else {
        const result = await db.$transaction(async (tx) => {
          const leads = await tx.lead.deleteMany({
            where: {
              expiresAt: { lte: now },
              emails: { none: { status: "SENDING", lockedUntil: { gt: now } } },
            },
          });
          const buckets = await tx.leadRateBucket.deleteMany({
            where: { expiresAt: { lte: now } },
          });
          return {
            deletedLeads: leads.count,
            deletedRateBuckets: buckets.count,
            executed: true,
          };
        });
        console.info(JSON.stringify(result));
      }
    }
  } catch {
    console.error(
      "No se pudo completar la operación de leads. Revisa configuración y estado de la base, sin publicar credenciales.",
    );
    process.exitCode = 1;
  } finally {
    await connected?.$disconnect();
  }
}
