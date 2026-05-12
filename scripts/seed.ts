import { config as loadEnv } from "dotenv";

import { getDb } from "../db";
import { products } from "../db/schema";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const seedProducts = [
  {
    slug: "notebook-14",
    name: 'Notebook 14" — 16 GB RAM',
    description:
      "Ultrabook para estudos e desenvolvimento. SSD 512 GB, tela antirreflexo.",
    priceCents: 329900,
    stock: 12,
  },
  {
    slug: "mouse-sem-fio",
    name: "Mouse sem fio ergonômico",
    description: "Sensor preciso, bateria de longa duração, conexão USB receiver.",
    priceCents: 8990,
    stock: 40,
  },
  {
    slug: "teclado-mecanico",
    name: "Teclado mecânico compacto",
    description: "Switches táteis, layout ABNT2, iluminação branca.",
    priceCents: 45900,
    stock: 18,
  },
  {
    slug: "monitor-27",
    name: "Monitor 27\" QHD",
    description: "IPS 100 Hz, bordas finas, ideal para produtividade.",
    priceCents: 139900,
    stock: 7,
  },
  {
    slug: "webcam-hd",
    name: "Webcam Full HD",
    description: "Microfone estéreo, encaixe universal em monitores e notebooks.",
    priceCents: 24900,
    stock: 25,
  },
];

async function main() {
  const db = getDb();
  for (const p of seedProducts) {
    await db.insert(products).values(p).onConflictDoNothing({ target: products.slug });
  }
  console.log("Seed concluído (produtos inseridos ou ignorados se o slug já existir).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
