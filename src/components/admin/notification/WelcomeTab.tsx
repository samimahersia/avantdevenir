import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LogoSection from "./LogoSection";
import WelcomeTextSection from "./WelcomeTextSection";

interface WelcomeTabProps {
  userRole: string | null;
}

const WelcomeTab = ({ userRole }: WelcomeTabProps) => {
  const [welcomeText, setWelcomeText] = useState("");

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
    <div className="grid grid-cols-2 gap-6">
      <LogoSection userRole={userRole} />
      <WelcomeTextSection 
        userRole={userRole}
        welcomeText={welcomeText}
        onWelcomeTextChange={setWelcomeText}
      />
    </div>
  );
};

export default WelcomeTab;