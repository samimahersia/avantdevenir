import { useState, useEffect } from "react";
import { WelcomeText } from "@/components/auth/WelcomeText";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface WelcomeTabProps {
  userRole: string | null;
}

const WelcomeTab = ({ userRole }: WelcomeTabProps) => {
  const [welcomeText, setWelcomeText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bienvenue</h3>
        {userRole === 'admin' && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <WelcomeText
        welcomeText={welcomeText}
        userRole={userRole}
        onWelcomeTextChange={setWelcomeText}
      />
    </div>
  );
};

export default WelcomeTab;