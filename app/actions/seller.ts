"use server";

import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

import { getDb } from "@/db";
import { orderItems, orders, products, stockAdjustments } from "@/db/schema";

async function requireSeller(): Promise<void> {
  const pin = process.env.VENDEDOR_PIN?.trim();
  if (!pin) return;
  const c = (await cookies()).get("tpo_vendedor");
  if (c?.value !== "1") {
    throw new Error("Sessão do vendedor inválida. Inicie sessão em /vendedor/login.");
  }
}

const adjustStockSchema = z.object({
  productId: z.string().uuid(),
  newStock: z.number().int().min(0).max(1_000_000),
  reason: z.string().trim().min(3).max(500),
});

const updateProductSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().trim().min(2).max(256),
  description: z.string().trim().min(4).max(2000),
  priceCents: z.number().int().min(0).max(100_000_000),
});

export type SellerActionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function sellerAdjustStock(input: unknown): Promise<SellerActionResult> {
  await requireSeller();
  const parsed = adjustStockSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos para ajuste de stock." };
  }
  const { productId, newStock, reason } = parsed.data;

  try {
    await getDb().transaction(async (tx) => {
      const [row] = await tx
        .select({ stock: products.stock })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (!row) {
        throw new Error("Produto não encontrado.");
      }

      await tx.insert(stockAdjustments).values({
        productId,
        previousStock: row.stock,
        newStock,
        reason,
      });

      await tx
        .update(products)
        .set({ stock: newStock })
        .where(eq(products.id, productId));
    });
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro ao registar ajuste de stock.";
    return { ok: false, message };
  }
}

export async function sellerUpdateProduct(input: unknown): Promise<SellerActionResult> {
  await requireSeller();
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos para atualização do produto." };
  }
  const { productId, name, description, priceCents } = parsed.data;

  try {
    const [updated] = await getDb()
      .update(products)
      .set({ name, description, priceCents })
      .where(eq(products.id, productId))
      .returning({ id: products.id });

    if (!updated) {
      return { ok: false, message: "Produto não encontrado." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Erro ao atualizar produto." };
  }
}

export async function getSellerOverview() {
  await requireSeller();

  const db = getDb();

  const orderTotals = await db
    .select({ totalCents: orders.totalCents })
    .from(orders);
  const orderCount = orderTotals.length;
  const revenueCents = orderTotals.reduce((acc, r) => acc + r.totalCents, 0);

  const lowStock = await db
    .select({
      id: products.id,
      name: products.name,
      stock: products.stock,
    })
    .from(products)
    .where(lte(products.stock, 5))
    .orderBy(asc(products.stock));

  const recentAdjustments = await db
    .select({
      id: stockAdjustments.id,
      previousStock: stockAdjustments.previousStock,
      newStock: stockAdjustments.newStock,
      reason: stockAdjustments.reason,
      createdAt: stockAdjustments.createdAt,
      productName: products.name,
    })
    .from(stockAdjustments)
    .innerJoin(products, eq(stockAdjustments.productId, products.id))
    .orderBy(desc(stockAdjustments.createdAt))
    .limit(8);

  const recentOrders = await db
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(6);

  return {
    orderCount,
    revenueCents,
    lowStock,
    recentAdjustments,
    recentOrders,
  };
}

export async function getSellerProducts() {
  await requireSeller();
  return getDb().select().from(products).orderBy(asc(products.name));
}

export async function getSellerOrders() {
  await requireSeller();
  return getDb()
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt));
}

export async function getSellerOrderById(orderId: string) {
  await requireSeller();
  const [order] = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;

  const items = await getDb()
    .select({
      quantity: orderItems.quantity,
      unitPriceCents: orderItems.unitPriceCents,
      productName: products.name,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  return { order, items };
}

export async function getSellerReportData(fromIso: string, toIso: string) {
  await requireSeller();
  const fromDate = new Date(fromIso);
  const toDate = new Date(toIso);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error("Datas inválidas.");
  }
  if (fromDate > toDate) {
    throw new Error("A data inicial deve ser anterior à final.");
  }

  const db = getDb();

  const rows = await db
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(
      and(gte(orders.createdAt, fromDate), lte(orders.createdAt, toDate))
    )
    .orderBy(desc(orders.createdAt));

  const orderCount = rows.length;
  const revenueCents = rows.reduce((acc, r) => acc + r.totalCents, 0);

  const adjustments = await db
    .select({
      createdAt: stockAdjustments.createdAt,
      productName: products.name,
      previousStock: stockAdjustments.previousStock,
      newStock: stockAdjustments.newStock,
      reason: stockAdjustments.reason,
    })
    .from(stockAdjustments)
    .innerJoin(products, eq(stockAdjustments.productId, products.id))
    .where(
      and(
        gte(stockAdjustments.createdAt, fromDate),
        lte(stockAdjustments.createdAt, toDate)
      )
    )
    .orderBy(desc(stockAdjustments.createdAt));

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    orders: rows,
    orderCount,
    revenueCents,
    adjustments,
  };
}
