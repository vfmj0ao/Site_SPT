import { asc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { products, type Product } from "@/db/schema";

export async function getProducts(): Promise<Product[]> {
  return getDb().select().from(products).orderBy(asc(products.name));
}

export async function getProductBySlug(slug: string) {
  const [row] = await getDb()
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return row ?? null;
}
