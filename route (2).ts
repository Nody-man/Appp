import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8110817965:AAEhP7KST4SZzTCywGNGg_au_O96APXxQcs";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const webhookUrl = `${protocol}://${host}/api/telegram-webhook`;

  try {
    // Set the webhook
    const setRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["callback_query"],
        }),
      }
    );
    const setData = await setRes.json();

    // Get webhook info
    const infoRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`
    );
    const infoData = await infoRes.json();

    return NextResponse.json({
      webhookUrl,
      setWebhook: setData,
      webhookInfo: infoData,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to setup webhook", details: String(err) },
      { status: 500 }
    );
  }
}
