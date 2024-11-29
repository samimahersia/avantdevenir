import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NotificationPreferences = () => {
  const [reminderHours, setReminderHours] = useState<number>(24);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setEmailEnabled(data.email_enabled);
        setPushEnabled(data.push_enabled);
        setReminderHours(data.reminder_before_hours);
      }
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("notification_preferences")
        .update({
          email_enabled: emailEnabled,
          push_enabled: pushEnabled,
          reminder_before_hours: reminderHours,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Préférences de notification mises à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des préférences");
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Notifications par email</Label>
            <Switch
              id="email-notifications"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Notifications push</Label>
            <Switch
              id="push-notifications"
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-hours">
              Rappel avant rendez-vous (heures)
            </Label>
            <Input
              id="reminder-hours"
              type="number"
              min="1"
              max="72"
              value={reminderHours}
              onChange={(e) => setReminderHours(Number(e.target.value))}
            />
          </div>
        </div>

        <Button 
          onClick={() => updatePreferences.mutate()}
          disabled={updatePreferences.isPending}
        >
          Enregistrer les préférences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;