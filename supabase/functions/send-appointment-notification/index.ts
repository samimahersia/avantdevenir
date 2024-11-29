import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailNotification {
  appointmentId: string;
  type: "new" | "status_update";
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, type }: EmailNotification = await req.json();

    // Fetch appointment and user details
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(`
        *,
        profiles:client_id (
          email,
          first_name,
          last_name
        )
      `)
      .eq("id", appointmentId)
      .single();

    if (appointmentError) throw appointmentError;
    if (!appointment) throw new Error("Appointment not found");

    const clientName = `${appointment.profiles.first_name} ${appointment.profiles.last_name}`;
    const appointmentDate = new Date(appointment.date).toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let subject = "";
    let html = "";

    if (type === "new") {
      subject = "Nouveau rendez-vous créé";
      html = `
        <h2>Nouveau rendez-vous créé</h2>
        <p>Bonjour ${clientName},</p>
        <p>Votre rendez-vous a bien été créé pour le ${appointmentDate}.</p>
        <p>Titre: ${appointment.title}</p>
        ${appointment.description ? `<p>Description: ${appointment.description}</p>` : ""}
        <p>Nous vous recontacterons rapidement pour confirmer ce rendez-vous.</p>
      `;
    } else if (type === "status_update") {
      const statusText = appointment.status === "approuve" ? "approuvé" : "refusé";
      subject = `Rendez-vous ${statusText}`;
      html = `
        <h2>Mise à jour de votre rendez-vous</h2>
        <p>Bonjour ${clientName},</p>
        <p>Votre rendez-vous prévu le ${appointmentDate} a été ${statusText}.</p>
        <p>Titre: ${appointment.title}</p>
        ${appointment.description ? `<p>Description: ${appointment.description}</p>` : ""}
        ${appointment.status === "approuve" 
          ? "<p>Nous avons hâte de vous recevoir !</p>" 
          : "<p>N'hésitez pas à reprendre rendez-vous à une autre date.</p>"}
      `;
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Rendez-vous <onboarding@resend.dev>",
        to: [appointment.profiles.email],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await emailRes.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-appointment-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);