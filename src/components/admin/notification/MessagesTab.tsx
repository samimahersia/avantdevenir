import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCard } from "./MessageCard";
import { Message } from "./types";

const MessagesTab = () => {
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            id
          )
        `)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }

      return data as Message[];
    },
  });

  const handleDelete = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_deleted: true })
        .eq("id", messageId);

      if (error) throw error;

      toast.success("Message supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Erreur lors de la suppression du message");
    }
  };

  const handlePrint = (message: Message) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Message Client", 14, 20);

    const tableData = [
      ["Date", format(new Date(message.created_at), "dd/MM/yyyy HH:mm", { locale: fr })],
      ["Client", `${message.profiles.first_name} ${message.profiles.last_name}`],
      ["Email", message.profiles.email],
      ["Message", message.content],
      ["Réponse", message.admin_response || "Pas de réponse"]
    ];

    autoTable(doc, {
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40 },
        1: { cellWidth: 150 }
      },
    });

    doc.save(`message-${message.id}.pdf`);
    toast.success("PDF généré avec succès");
  };

  const handleSendResponse = async (messageId: string, response: string) => {
    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return;

      // Update message with admin response
      const { error: updateError } = await supabase
        .from("messages")
        .update({ admin_response: response })
        .eq("id", messageId);

      if (updateError) throw updateError;

      // Create notification for the client
      const { error: notificationError } = await supabase
        .from("notification_history")
        .insert({
          user_id: message.profiles.id,
          type: "message_response",
          title: "Réponse à votre message",
          content: `L'administrateur a répondu à votre message : ${response}`,
          status: "sent",
          sent_at: new Date().toISOString(),
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
        toast.error("Erreur lors de l'envoi de la notification");
      }

      toast.success("Réponse envoyée avec succès");
      refetch();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages des clients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onDelete={handleDelete}
            onPrint={handlePrint}
            onSendResponse={handleSendResponse}
          />
        ))}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground">
            Aucun message pour le moment
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesTab;