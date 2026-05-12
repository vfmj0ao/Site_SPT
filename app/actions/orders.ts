"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(256),
  customerEmail: z.string().trim().email().max(320),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(99),
      })
    )
    .min(1)
    .max(50),
});

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; message: string };

function mergeItems(
  items: { productId: string; quantity: number }[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const it of items) {
    map.set(it.productId, (map.get(it.productId) ?? 0) + it.quantity);
  }
  return map;
}

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos. Verifique nome, e-mail e itens." };
  }

  const { customerName, customerEmail, items } = parsed.data;
  const email = customerEmail.trim().toLowerCase();
  const merged = mergeItems(items);

  try {
    const created = await getDb().transaction(async (tx) => {
      const lines: {
        productId: string;
        quantity: number;
        unitPriceCents: number;
      }[] = [];
      let totalCents = 0;

      for (const [productId, quantity] of merged) {
        const [updated] = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${quantity}` })
          .where(
            and(eq(products.id, productId), gte(products.stock, quantity))
          )
          .returning({
            id: products.id,
            priceCents: products.priceCents,
          });

        if (!updated) {
          throw new Error("Estoque insuficiente ou produto indisponível.");
        }

        lines.push({
          productId,
          quantity,
          unitPriceCents: updated.priceCents,
        });
        totalCents += updated.priceCents * quantity;
      }

      const [created] = await tx
        .insert(orders)
        .values({
          customerName: customerName.trim(),
          customerEmail: email,
          totalCents,
        })
        .returning({ id: orders.id });

      if (!created) {
        throw new Error("Não foi possível criar o pedido.");
      }

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: created.id,
          productId: l.productId,
          quantity: l.quantity,
          unitPriceCents: l.unitPriceCents,
        }))
      );

      return created;
    });

    return { ok: true, orderId: created.id };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro ao processar o pedido.";
    return { ok: false, message };
  }
}

export async function getOrderById(orderId: string) {
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

export async function getOrdersByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || normalized.length > 320) return [];

  return getDb()
    .select()
    .from(orders)
    .where(eq(orders.customerEmail, normalized))
    .orderBy(desc(orders.createdAt));
}
