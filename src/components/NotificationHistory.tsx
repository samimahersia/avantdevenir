import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const NotificationHistory = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notification-history"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notification_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{notification.title}</h3>
                <Badge
                  variant={notification.status === "sent" ? "success" : "destructive"}
                >
                  {notification.status === "sent" ? "Envoyé" : "Échec"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{notification.content}</p>
              <div className="text-xs text-muted-foreground">
                {notification.sent_at ? (
                  <span>
                    Envoyé le {format(new Date(notification.sent_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                ) : (
                  <span>Non envoyé</span>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune notification
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;