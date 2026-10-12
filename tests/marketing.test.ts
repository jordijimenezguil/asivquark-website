import test from "node:test";
import assert from "node:assert/strict";
import { parsePublicProjectType, projectTypeForContract } from "../src/content/project-type.ts";
import { services } from "../src/content/services.ts";
import { publicPaths } from "../src/config/navigation.ts";
import { attributionFromUrl } from "../src/features/leads/attribution.ts";
test("public type accepts only the four new values and defaults repeated or unknown values", () => {
 for (const type of ["web", "software", "app", "mvp"] as const) assert.equal(parsePublicProjectType([type]), type);
 for (const input of [[], ["aplicacion"], ["otro"], ["web", "mvp"], ["web", "web"], ["<script>"]]) assert.equal(parsePublicProjectType(input), "web");
 assert.equal(projectTypeForContract("app"), "aplicacion");
 for (const type of ["web", "software", "mvp"] as const) assert.equal(projectTypeForContract(type), type);
});
test("public routes and attribution use the definitive service paths without case details", () => {
 assert.equal(publicPaths.length, 9);
 assert.equal(new Set(publicPaths).size, 9);
 for(const service of services) {
  const path = `/servicios/${service.slug}/`;
  assert.ok(publicPaths.includes(path));
  assert.equal(attributionFromUrl(new URLSearchParams({ origen: path })).originPath, path);
 }
 assert.equal(attributionFromUrl(new URLSearchParams({ origen: "/diseno-web-barcelona/" })).originPath, undefined);
 assert.deepEqual(publicPaths.filter(path => path.startsWith("/proyectos")), ["/proyectos/"]);
});
