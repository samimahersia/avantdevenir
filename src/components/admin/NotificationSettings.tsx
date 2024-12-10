import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Info } from "lucide-react";
import NotificationHistory from "../NotificationHistory";
import NotificationPreferences from "../NotificationPreferences";
import RecentAppointments from "./holiday/RecentAppointments";

const NotificationSettings = () => {
  return (
    <Tabs defaultValue="welcome" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="welcome" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Bienvenue
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Historique
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Préférences
        </TabsTrigger>
        <TabsTrigger value="schedules">Horaires</TabsTrigger>
      </TabsList>
      
      <TabsContent value="welcome">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Bienvenue dans les paramètres de notification</h3>
            <p className="text-muted-foreground">
              Cette section vous permet de gérer vos préférences de notification et de consulter l'historique 
              des notifications reçues. Vous pouvez également configurer les horaires de disponibilité pour 
              les rendez-vous.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Fonctionnalités disponibles :</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Consultation de l'historique des notifications</li>
                <li>Configuration des préférences de notification</li>
                <li>Gestion des horaires de disponibilité</li>
                <li>Suivi des rendez-vous récents</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <NotificationHistory />
      </TabsContent>
      
      <TabsContent value="preferences">
        <NotificationPreferences />
      </TabsContent>

      <TabsContent value="schedules">
        <Card>
          <CardContent className="pt-6">
            <RecentAppointments />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSettings;