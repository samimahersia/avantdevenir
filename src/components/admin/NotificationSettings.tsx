import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Info } from "lucide-react";
import NotificationHistory from "../NotificationHistory";
import NotificationPreferences from "../NotificationPreferences";
import RecentAppointments from "./holiday/RecentAppointments";
import WelcomeTab from "./notification/WelcomeTab";
import { useState } from "react";

const NotificationSettings = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

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
        <WelcomeTab userRole={userRole} />
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