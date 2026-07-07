import { pgTable, serial, text, integer, timestamp, json } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  deliveryMethod: text("delivery_method").notNull(), // 'delivery' | 'pickup'
  address: text("address"),
  items: json("items")
    .$type<{ productId: string; quantity: number; name: string; price: number }[]>()
    .notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  telegramMessageId: integer("telegram_message_id"),
  telegramChatId: text("telegram_chat_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
