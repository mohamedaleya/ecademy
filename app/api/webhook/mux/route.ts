import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";

const webhookSignatureSecret = process.env.MUX_WEBHOOK_SIGNING_SECRET;
const mux = new Mux();

const verifyWebhookSignature = async (
  rawBody: string | Buffer,
  headers: Headers
) => {
  if (webhookSignatureSecret) {
    try {
      mux.webhooks.verifySignature(
        Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody,
        Object.fromEntries(headers.entries()),
        webhookSignatureSecret
      );
    } catch (e) {
      console.error("Error verifying webhook signature:", e);
      throw e;
    }
  } else {
    console.log(
      "Skipping webhook sig verification because no secret is configured"
    );
  }
  return true;
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    // console.log("Received webhook, raw body:", rawBody);

    try {
      await verifyWebhookSignature(rawBody, req.headers);
    } catch (e) {
      console.error("Error verifying webhook signature:", e);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const jsonBody = JSON.parse(rawBody);
    const { data, type } = jsonBody;

    if (type !== "video.asset.ready") {
      return NextResponse.json({ message: "Event received" }, { status: 200 });
    }

    const { id: assetId, playback_ids } = data;

    await db.muxData.updateMany({
      where: { assetId },
      data: {
        status: "ready",
        playbackId: playback_ids[0]?.id,
      },
    });

    console.log("Database updated successfully");
    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Mux webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
