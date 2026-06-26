import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function notifyTelegram(fields: {
  name: string;
  brand_name: string;
  contact: string;
  monthly_orders: string;
  source: string;
}): Promise<void> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const text =
    `🔔 <b>Novo lead — Kanglu Landing!</b>\n\n` +
    `👤 <b>Nome:</b> ${fields.name}\n` +
    `🏢 <b>Marca:</b> ${fields.brand_name}\n` +
    `📱 <b>Contato:</b> ${fields.contact}\n` +
    `📦 <b>Pedidos/mês:</b> ${fields.monthly_orders}\n` +
    `📍 <b>Variante:</b> ${fields.source}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, brand_name, contact, monthly_orders, source } = body;

    if (!name || !brand_name || !contact || !monthly_orders || !source) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("demo_leads").insert({
      name,
      brand_name,
      contact,
      monthly_orders,
      source,
    });

    if (error) throw error;

    // Notificação Telegram — fire-and-forget: falha silenciosa não afeta o lead
    notifyTelegram({ name, brand_name, contact, monthly_orders, source }).catch(
      () => {}
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erro ao salvar. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
