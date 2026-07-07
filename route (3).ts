import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const { callback_query } = update;
    const data = callback_query.data as string;
    const chatId = callback_query.message?.chat?.id;
    const messageId = callback_query.message?.message_id;

    if (!data?.startsWith("confirm_") || !chatId || !messageId) {
      return NextResponse.json({ ok: true });
    }

    const orderId = parseInt(data.replace("confirm_", ""), 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ ok: true });
    }

    // Check current status first — ignore repeat taps / retries
    const { rows } = await pool.query("SELECT status FROM orders WHERE id = $1", [orderId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: true });
    }
    if (rows[0].status === "confirmed") {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callback_query.id,
          text: "Уже подтверждено",
        }),
      });
      return NextResponse.json({ ok: true });
    }

    // Update order status in database
    await pool.query("UPDATE orders SET status = 'confirmed' WHERE id = $1", [orderId]);

    // Edit the original message to show confirmed status
    const originalText = callback_query.message?.text || "";
    const newText = originalText + "\n\n✅ <b>Заказ подтверждён!</b>";

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: [] },
      }),
    });

    // Answer the callback query
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callback_query.id,
        text: "✅ Заказ подтверждён!",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
