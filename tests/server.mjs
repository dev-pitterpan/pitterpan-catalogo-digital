import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
const port = "3188";
const child = spawn(process.execPath, ["scripts/run-next.ts", "start"], {
  env: {
    ...process.env,
    PORT: port,
    CATALOG_DATA_SOURCE: "json",
    DATABASE_URL: "",
    NEXT_TELEMETRY_DISABLED: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
child.stderr.on("data", (chunk) => {
  logs += chunk;
});
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Servidor não iniciou: ${logs}`)),
      30_000,
    );
    child.stdout.on("data", (chunk) => {
      if (/ready/i.test(String(chunk))) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Servidor encerrou (${code}): ${logs}`));
    });
  });
  const get = (path, options = {}) =>
    fetch(`http://127.0.0.1:${port}${path}`, {
      redirect: "manual",
      ...options,
    });
  for (const path of [
    "/",
    "/natal/",
    "/api/health/",
    "/api/catalogs/natal/",
    "/assets/images/brand/pitter-pan-logo.svg",
  ])
    assert.equal((await get(path)).status, 200, path);
  const home = await (await get("/")).text();
  assert.match(home, /Buscar produtos por nome ou SKU/);
  assert.match(home, /Datas especiais/);
  assert.doesNotMatch(home, /0 departamentos/);
  const search = await get("/todos/?q=8936");
  assert.equal(search.status, 200);
  const results = await search.text();
  assert.match(results, /value="8936"/);
  assert.match(results, /Máscara de Látex com Capuz Frank/i);
  assert.equal(
    (
      await get("/api/cart/", {
        method: "POST",
        body: JSON.stringify({ ids: [] }),
        headers: { "Content-Type": "application/json" },
      })
    ).status,
    200,
  );
  for (const path of [
    "/gestor/vendas/",
    "/api/admin/sales/",
    "/api/auth/login/",
    "/api/cron/sales/",
    "/api/webhooks/shopify/sales/",
  ])
    assert.equal((await get(path)).status, 404, path);
  console.log(
    "Catálogo independente: páginas, recursos e ausência de rotas privadas OK.",
  );
} finally {
  child.kill("SIGTERM");
  if (child.exitCode === null) await once(child, "exit");
}
