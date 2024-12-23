import { useState, useEffect } from "react";
import { WelcomeText } from "@/components/auth/WelcomeText";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleEdit = () => {
    setIsEditing(true);
    toast.info("Mode édition activé");
  };

  return (
    <div className="space-y-4 relative p-4 border rounded-lg bg-white dark:bg-gray-800">
      <WelcomeText
        welcomeText={welcomeText}
        userRole={userRole}
        onWelcomeTextChange={setWelcomeText}
      />
      {userRole === 'admin' && !isEditing && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Modifier le texte de bienvenue</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modifier le texte de bienvenue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default WelcomeTab;