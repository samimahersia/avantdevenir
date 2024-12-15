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
    <div className="space-y-4 relative p-4 border rounded-lg bg-white dark:bg-gray-800">
      <WelcomeText
        welcomeText={welcomeText}
        userRole={userRole}
        onWelcomeTextChange={setWelcomeText}
      />
      {userRole === 'admin' && !isEditing && (
        <Button
          variant="default"
          size="sm"
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      )}
    </div>
  );
};

export default WelcomeTab;