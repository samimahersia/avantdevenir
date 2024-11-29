import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationHistory from "../NotificationHistory";
import NotificationPreferences from "../NotificationPreferences";

const NotificationSettings = () => {
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList>
        <TabsTrigger value="history">Historique</TabsTrigger>
        <TabsTrigger value="preferences">Préférences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history">
        <NotificationHistory />
      </TabsContent>
      
      <TabsContent value="preferences">
        <NotificationPreferences />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSettings;