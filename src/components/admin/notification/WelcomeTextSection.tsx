import { WelcomeText } from "@/components/auth/WelcomeText";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from "react";

interface WelcomeTextSectionProps {
  userRole: string | null;
  welcomeText: string;
  onWelcomeTextChange: (text: string) => void;
}

const WelcomeTextSection = ({ userRole, welcomeText, onWelcomeTextChange }: WelcomeTextSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    toast.info("Mode édition activé");
  };

  return (
    <div className="relative p-6 border rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 h-full">
      <div className="bg-white/90 p-4 rounded-lg">
        <WelcomeText
          welcomeText={welcomeText}
          userRole={userRole}
          onWelcomeTextChange={(text) => {
            onWelcomeTextChange(text);
            setIsEditing(false);
          }}
        />
      </div>
      
      {userRole === 'admin' && !isEditing && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white hover:bg-white/90 shadow-lg"
                onClick={handleEdit}
              >
                <Pencil className="h-5 w-5 text-blue-600" />
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

export default WelcomeTextSection;