import { NextRequest, NextResponse } from "next/server";
import { db, pool } from "@/db";
import { orders } from "@/db/schema";
import { PRICE_MAP, PRODUCTS, formatSom } from "@/lib/i18n";

const DELIVERY_FEE = 10000;
const FREE_DELIVERY_MIN = 100000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text: string, replyMarkup?: object): Promise<number | null> {
  try {
    const body: Record<string, unknown> = {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.ok ? data.result.message_id : null;
  } catch {
    console.error("Failed to send Telegram message");
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, deliveryMethod, address, items } = body;

    if (!customerName || !phone || !deliveryMethod || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (deliveryMethod === "delivery" && !address) {
      return NextResponse.json({ error: "Address required for delivery" }, { status: 400 });
    }

    // Server-side price recalculation — never trust client prices
    let subtotal = 0;
    const validatedItems: { productId: string; quantity: number; name: string; price: number }[] = [];

    for (const item of items) {
      const price = PRICE_MAP[item.productId];
      if (!price || !item.quantity || item.quantity < 1 || item.quantity > 100) {
        return NextResponse.json({ error: `Invalid item: ${item.productId}` }, { status: 400 });
      }
      const prod = PRODUCTS.find((p) => p.id === item.productId);
      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        name: prod?.name.ru || item.productId,
        price,
      });
      subtotal += price * item.quantity;
    }

    const deliveryFee = deliveryMethod === "pickup" ? 0 : (subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE);
    const totalAmount = subtotal + deliveryFee;

    // Save order to database
    const [order] = await db.insert(orders).values({
      customerName,
      phone,
      deliveryMethod,
      address: deliveryMethod === "delivery" ? address : null,
      items: validatedItems,
      totalAmount,
    }).returning();

    // Send Telegram notification
    const itemLines = validatedItems
      .map((i) => `  • ${i.name} × ${i.quantity}`)
      .join("\n");

    const deliveryText = deliveryMethod === "delivery"
      ? `🚚 Доставка: ${address}`
      : "📍 Самовывоз";

    const msgText = [
      `🍊 <b>Новый заказ #${order.id}</b>`,
      "",
      `👤 ${customerName}`,
      `📞 ${phone}`,
      deliveryText,
      "",
      `<b>Товары:</b>`,
      itemLines,
      "",
      `<b>Итого: ${formatSom(totalAmount, "ru")}</b>`,
    ].join("\n");

    const replyMarkup = {
      inline_keyboard: [
        [{ text: "✅ Подтвердить заказ", callback_data: `confirm_${order.id}` }],
      ],
    };

    const messageId = await sendTelegramMessage(msgText, replyMarkup);

    // Save telegram message reference
    if (messageId) {
      try {
        await pool.query(
          "UPDATE orders SET telegram_message_id = $1, telegram_chat_id = $2 WHERE id = $3",
          [messageId, TELEGRAM_CHAT_ID, order.id]
        );
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ id: order.id, total: totalAmount }, { status: 201 });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
