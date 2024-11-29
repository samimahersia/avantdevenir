import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID");
const ONESIGNAL_API_KEY = Deno.env.get("ONESIGNAL_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "AvantDeVenir <notifications@avantdevenir.com>",
      to: [to],
      subject,
      html: htmlContent,
    }),
  });
  return res.ok;
}

async function sendPushNotification(externalUserId: string, title: string, content: string) {
  const res = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${ONESIGNAL_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      include_external_user_ids: [externalUserId],
      contents: { en: content },
      headings: { en: title },
    }),
  });
  return res.ok;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, type, title, content, metadata } = await req.json() as NotificationRequest;

    // Get user preferences and email
    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("email_enabled, push_enabled")
      .eq("user_id", userId)
      .single();

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!preferences || !profile?.email) {
      throw new Error("User preferences or email not found");
    }

    // Create notification history entry
    const { data: notification } = await supabase
      .from("notification_history")
      .insert({
        user_id: userId,
        type,
        title,
        content,
        metadata,
      })
      .select()
      .single();

    // Send notifications based on preferences
    const results = await Promise.all([
      // Send email if enabled
      preferences.email_enabled
        ? sendEmail(profile.email, title, content)
        : Promise.resolve(false),
      // Send push notification if enabled
      preferences.push_enabled
        ? sendPushNotification(userId, title, content)
        : Promise.resolve(false),
    ]);

    // Update notification status
    await supabase
      .from("notification_history")
      .update({
        status: results.some(Boolean) ? "sent" : "failed",
        sent_at: results.some(Boolean) ? new Date().toISOString() : null,
      })
      .eq("id", notification.id);

    return new Response(
      JSON.stringify({ success: true, notificationId: notification.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);