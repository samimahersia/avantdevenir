import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Info, CreditCard } from "lucide-react";
import NotificationHistory from "../NotificationHistory";
import NotificationPreferences from "../NotificationPreferences";
import RecentAppointments from "./holiday/RecentAppointments";
import LogoSection from "./notification/LogoSection";
import WelcomeTextSection from "./notification/WelcomeTextSection";
import SubscriptionTab from "./notification/SubscriptionTab";
import MessagesTab from "./notification/MessagesTab";
import { useState } from "react";

const NotificationSettings = () => {
  const [welcomeText, setWelcomeText] = useState(
    "Bienvenue sur AvantDeVenir, votre plateforme de gestion de rendez-vous consulaires. Notre service simplifie la prise de rendez-vous et la gestion de vos démarches administratives."
  );

  return (
    <Tabs defaultValue="welcome" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="welcome" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Bienvenue
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Abonnement
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Préférences
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Historique
        </TabsTrigger>
        <TabsTrigger value="schedules" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Planification
        </TabsTrigger>
      </TabsList>

      <TabsContent value="welcome" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <LogoSection userRole="admin" />
          <WelcomeTextSection 
            userRole="admin"
            welcomeText={welcomeText}
            onWelcomeTextChange={setWelcomeText}
          />
        </div>
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionTab />
      </TabsContent>
      
      <TabsContent value="preferences">
        <NotificationPreferences />
      </TabsContent>

      <TabsContent value="history">
        <NotificationHistory />
      </TabsContent>

      <TabsContent value="schedules">
        <RecentAppointments />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSettings;