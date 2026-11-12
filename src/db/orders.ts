import { db } from './index.ts';
import { orders } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateOrderParams {
  orderCode: string;
  userId?: number;
  userUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMethod: string;
  status?: string;
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
  couponCode?: string;
  estimatedDelivery?: string;
  itemsJson: string;
}

export async function createOrder(params: CreateOrderParams) {
  try {
    const result = await db.insert(orders).values({
      orderCode: params.orderCode,
      userId: params.userId || null,
      userUid: params.userUid || null,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail || null,
      deliveryAddress: params.deliveryAddress,
      city: params.city,
      state: params.state,
      pinCode: params.pinCode,
      paymentMethod: params.paymentMethod,
      status: params.status || 'Confirmed',
      subtotal: params.subtotal,
      discount: params.discount || 0,
      shipping: params.shipping || 0,
      total: params.total,
      couponCode: params.couponCode || null,
      estimatedDelivery: params.estimatedDelivery || null,
      itemsJson: params.itemsJson,
    }).returning();

    return result[0];
  } catch (error) {
    console.error("Database createOrder failed:", error);
    throw new Error("Failed to create order in database", { cause: error });
  }
}

export async function getOrdersByUser(userUid?: string, userEmail?: string) {
  try {
    if (userUid) {
      return await db.select().from(orders).where(eq(orders.userUid, userUid)).orderBy(desc(orders.createdAt));
    }
    if (userEmail) {
      return await db.select().from(orders).where(eq(orders.customerEmail, userEmail)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(30);
  } catch (error) {
    console.error("Database getOrders failed:", error);
    throw new Error("Failed to fetch orders from database", { cause: error });
  }
}
