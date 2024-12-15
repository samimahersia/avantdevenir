import { useState, useEffect } from "react";
import { WelcomeText } from "@/components/auth/WelcomeText";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeTabProps {
  userRole: string | null;
}

const WelcomeTab = ({ userRole }: WelcomeTabProps) => {
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    const fetchWelcomeText = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'login_welcome_text')
        .single();

      if (error) {
        console.error('Error fetching welcome text:', error);
        return;
      }

      if (data) {
        setWelcomeText(data.content);
      }
    };

    fetchWelcomeText();
  }, []);

  return (
    <div className="space-y-4">
      <WelcomeText
        welcomeText={welcomeText}
        userRole={userRole}
        onWelcomeTextChange={setWelcomeText}
      />
    </div>
  );
};

export default WelcomeTab;