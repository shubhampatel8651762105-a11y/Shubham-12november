import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderCode: text('order_code').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  deliveryAddress: text('delivery_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  paymentMethod: text('payment_method').notNull(),
  status: text('status').notNull().default('Confirmed'),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').notNull().default(0),
  shipping: integer('shipping').notNull().default(0),
  total: integer('total').notNull(),
  couponCode: text('coupon_code'),
  estimatedDelivery: text('estimated_delivery'),
  itemsJson: text('items_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
