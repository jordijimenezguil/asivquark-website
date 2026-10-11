import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

type Snapshot = {
  tables: Record<
    string,
    {
      name: string;
      columns: Record<
        string,
        {
          name: string;
          type: string;
          primaryKey: boolean;
          notNull: boolean;
          default?: string | boolean;
        }
      >;
      indexes: Record<
        string,
        { name: string; columns: { expression: string }[] }
      >;
      uniqueConstraints: Record<string, { name: string; columns: string[] }>;
      foreignKeys: Record<
        string,
        {
          name: string;
          columnsFrom: string[];
          columnsTo: string[];
          tableTo: string;
          onDelete: string;
          onUpdate: string;
        }
      >;
    }
  >;
};

test("baseline retains the historical SQL without altering existing objects", () => {
  assert.equal(
    readFileSync("prisma/migrations/0_init/migration.sql", "utf8").trim(),
    readFileSync("drizzle/0000_warm_whiplash.sql", "utf8").trim(),
  );
});

test("Prisma SQL preserves physical schema against the historical snapshot offline", () => {
  const snapshot = JSON.parse(
    readFileSync("drizzle/meta/0000_snapshot.json", "utf8"),
  ) as Snapshot;
  // No datasource connection: Prisma compares empty schema to a schema file.
  const sql = execFileSync(
    "pnpm",
    [
      "exec",
      "prisma",
      "migrate",
      "diff",
      "--from-empty",
      "--to-schema",
      "prisma/schema.prisma",
      "--script",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const tables = new Map(
    [...sql.matchAll(/CREATE TABLE "([^"]+)" \(([\s\S]*?)\n\);/g)].map(
      (match) => [match[1], match[2]],
    ),
  );
  assert.equal(tables.size, Object.keys(snapshot.tables).length);
  for (const table of Object.values(snapshot.tables)) {
    const body = tables.get(table.name);
    assert.ok(body, `Missing table ${table.name}`);
    const columns = new Map(
      [...body.matchAll(/^\s+"([^"]+)" (.+),?$/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );
    assert.equal(columns.size, Object.keys(table.columns).length);
    for (const column of Object.values(table.columns)) {
      const definition = columns.get(column.name);
      assert.ok(definition, `Missing column ${table.name}.${column.name}`);
      const type =
        column.type === "timestamp"
          ? "TIMESTAMP(6)"
          : column.type.toUpperCase();
      assert.ok(
        definition.startsWith(type),
        `Type changed for ${table.name}.${column.name}`,
      );
      assert.equal(definition.includes("NOT NULL"), column.notNull);
      if (column.primaryKey)
        assert.ok(body.includes(`PRIMARY KEY ("${column.name}")`));
      if (column.default !== undefined) {
        const expected = String(column.default).replace(
          /^now\(\)$/i,
          "CURRENT_TIMESTAMP",
        );
        assert.ok(definition.includes(`DEFAULT ${expected}`));
      } else assert.ok(!definition.includes("DEFAULT"));
    }
    for (const index of Object.values(table.indexes)) {
      const names = index.columns
        .map((column) => `"${column.expression}"`)
        .join(", ");
      assert.ok(
        sql.includes(
          `CREATE INDEX "${index.name}" ON "${table.name}"(${names})`,
        ),
      );
    }
    for (const unique of Object.values(table.uniqueConstraints)) {
      assert.ok(
        sql.includes(
          `CREATE UNIQUE INDEX "${unique.name}" ON "${table.name}"(${unique.columns.map((name) => `"${name}"`).join(", ")})`,
        ),
      );
    }
    for (const fk of Object.values(table.foreignKeys)) {
      assert.ok(
        sql.includes(
          `ADD CONSTRAINT "${fk.name}" FOREIGN KEY (${fk.columnsFrom.map((name) => `"${name}"`).join(", ")}) REFERENCES "${fk.tableTo}"(${fk.columnsTo.map((name) => `"${name}"`).join(", ")}) ON DELETE ${fk.onDelete.toUpperCase()} ON UPDATE ${fk.onUpdate.toUpperCase()}`,
        ),
      );
    }
  }
});
