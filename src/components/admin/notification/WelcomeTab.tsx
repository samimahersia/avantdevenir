import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LogoSection from "./LogoSection";
import WelcomeTextSection from "./WelcomeTextSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagesTab from "./MessagesTab";
import SubscriptionTab from "./SubscriptionTab";

interface WelcomeTabProps {
  userRole: string | null;
}

const WelcomeTab = ({ userRole }: WelcomeTabProps) => {
  const [welcomeText, setWelcomeText] = useState("");
  const [activeTab, setActiveTab] = useState("welcome");

  useEffect(() => {
    const fetchWelcomeText = async () => {
      try {
        const { data: content, error: contentError } = await supabase
          .from('site_content')
          .select('content')
          .eq('key', 'login_welcome_text')
          .single();

        if (contentError) throw contentError;
        setWelcomeText(content?.content || "");
      } catch (error) {
        console.error("Error fetching welcome text:", error);
      }
    };

    fetchWelcomeText();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="welcome">Bienvenue</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="subscription">Abonnement</TabsTrigger>
      </TabsList>

      <TabsContent value="welcome" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <LogoSection userRole={userRole} />
          <WelcomeTextSection 
            userRole={userRole}
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
    </Tabs>
  );
};

export default WelcomeTab;