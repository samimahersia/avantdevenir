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
  type: "new" | "status_update" | "reminder";
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

const getEmailTemplate = (type: string, data: any) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const templates = {
    new: {
      subject: "Confirmation de votre demande de rendez-vous",
      html: `
        <h2>Confirmation de votre demande de rendez-vous</h2>
        <p>Bonjour ${data.clientName},</p>
        <p>Nous avons bien reçu votre demande de rendez-vous pour le ${formatDate(data.date)}.</p>
        <p><strong>Détails du rendez-vous :</strong></p>
        <ul>
          <li>Titre : ${data.title}</li>
          ${data.description ? `<li>Description : ${data.description}</li>` : ''}
        </ul>
        <p>Nous examinerons votre demande dans les plus brefs délais et vous tiendrons informé(e) de sa validation.</p>
        <p>Cordialement,<br>L'équipe AvantDeVenir</p>
      `
    },
    approuve: {
      subject: "Votre rendez-vous a été approuvé",
      html: `
        <h2>Rendez-vous confirmé</h2>
        <p>Bonjour ${data.clientName},</p>
        <p>Nous avons le plaisir de vous confirmer votre rendez-vous pour le ${formatDate(data.date)}.</p>
        <p><strong>Détails du rendez-vous :</strong></p>
        <ul>
          <li>Titre : ${data.title}</li>
          ${data.description ? `<li>Description : ${data.description}</li>` : ''}
        </ul>
        <p>Nous avons hâte de vous recevoir !</p>
        <p>Cordialement,<br>L'équipe AvantDeVenir</p>
      `
    },
    refuse: {
      subject: "Mise à jour de votre demande de rendez-vous",
      html: `
        <h2>Mise à jour de votre demande de rendez-vous</h2>
        <p>Bonjour ${data.clientName},</p>
        <p>Nous sommes désolés de vous informer que nous ne pourrons pas honorer votre demande de rendez-vous pour le ${formatDate(data.date)}.</p>
        <p><strong>Détails du rendez-vous :</strong></p>
        <ul>
          <li>Titre : ${data.title}</li>
          ${data.description ? `<li>Description : ${data.description}</li>` : ''}
        </ul>
        <p>N'hésitez pas à reprendre rendez-vous à une autre date qui vous conviendrait mieux.</p>
        <p>Cordialement,<br>L'équipe AvantDeVenir</p>
      `
    },
    reminder: {
      subject: "Rappel de votre rendez-vous",
      html: `
        <h2>Rappel de votre rendez-vous</h2>
        <p>Bonjour ${data.clientName},</p>
        <p>Nous vous rappelons votre rendez-vous prévu pour demain, le ${formatDate(data.date)}.</p>
        <p><strong>Détails du rendez-vous :</strong></p>
        <ul>
          <li>Titre : ${data.title}</li>
          ${data.description ? `<li>Description : ${data.description}</li>` : ''}
        </ul>
        <p>Au plaisir de vous recevoir,<br>L'équipe AvantDeVenir</p>
      `
    }
  };

  return templates[type as keyof typeof templates];
};

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
    const emailType = type === "status_update" ? appointment.status : type;
    
    const template = getEmailTemplate(emailType, {
      clientName,
      date: appointment.date,
      title: appointment.title,
      description: appointment.description
    });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AvantDeVenir <onboarding@resend.dev>",
        to: [appointment.profiles.email],
        subject: template.subject,
        html: template.html,
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