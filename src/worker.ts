export interface Env {
  API_TOKEN: string;
  RATE_LIMIT_KV: KVNamespace;
}

const MAX_EMAILS_PER_MONTH = 10;

const ALLOWED_ORIGINS = [
  "https://a-b-h-i-n-a-v-1-9.github.io",
  "http://localhost:8080",
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";

    // --------------------------------------------------
    // HEALTH CHECK (GET)
    // --------------------------------------------------
    if (request.method === "GET") {
      return new Response("Portfolio proxy running", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // --------------------------------------------------
    // CORS PREFLIGHT
    // --------------------------------------------------
    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response("Forbidden", { status: 403 });
      }

      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // --------------------------------------------------
    // METHOD + ORIGIN VALIDATION
    // --------------------------------------------------
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    // --------------------------------------------------
    // PARSE JSON PAYLOAD
    // --------------------------------------------------
    let payload: { email?: string; message?: string };

    try {
      payload = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: "INVALID_JSON",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }

    const { email, message } = payload;

    if (!email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "MISSING_FIELDS",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }

    // --------------------------------------------------
    // RATE LIMIT (PER IP / MONTH)
    // --------------------------------------------------
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";

    const now = new Date();
    const monthKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
    const kvKey = `${ip}:${monthKey}`;

    const count = parseInt(
      (await env.RATE_LIMIT_KV.get(kvKey)) ?? "0",
      10
    );

    if (count >= MAX_EMAILS_PER_MONTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          limit: MAX_EMAILS_PER_MONTH,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }

    // TTL until end of month
    const endOfMonth = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      0,
      23,
      59,
      59
    );

    await env.RATE_LIMIT_KV.put(kvKey, String(count + 1), {
      expirationTtl: Math.floor(
        (endOfMonth.getTime() - now.getTime()) / 1000
      ),
    });

    // --------------------------------------------------
    // FORWARD TO WEB3FORMS
    // --------------------------------------------------
    const upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: env.API_TOKEN,

        // REQUIRED FIELDS (prevents 1101)
        subject: "New Contact from Portfolio Terminal",
        from_name: "Portfolio Terminal",
        name: "Portfolio Visitor",

        // CONTACT DATA
        email,
        reply_to: email,
        message,
      }),
    });

    const upstreamText = await upstream.text();

    let responseBody: any;
    try {
      responseBody = JSON.parse(upstreamText);
    } catch {
      responseBody = {
        success: false,
        error: "UPSTREAM_ERROR",
        message: upstreamText,
      };
    }

    return new Response(JSON.stringify(responseBody), {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
      },
    });
  },
};
