import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(supabaseUrl!, supabaseKey!);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all approved appointments for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("status", "approuve")
      .gte("date", tomorrow.toISOString())
      .lt("date", dayAfterTomorrow.toISOString());

    if (error) throw error;

    console.log(`Found ${appointments.length} appointments for tomorrow`);

    // Send reminder for each appointment
    const results = await Promise.all(
      appointments.map(async (appointment) => {
        try {
          const response = await fetch(`${supabaseUrl}/functions/v1/send-appointment-notification`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appointmentId: appointment.id,
              type: "reminder",
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send reminder for appointment ${appointment.id}`);
          }

          return { id: appointment.id, success: true };
        } catch (error) {
          console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
          return { id: appointment.id, success: false, error: error.message };
        }
      })
    );

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-appointment-reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);