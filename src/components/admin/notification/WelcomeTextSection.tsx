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
    <div className="relative p-6 border rounded-lg bg-white dark:bg-gray-800 h-full">
      <WelcomeText
        welcomeText={welcomeText}
        userRole={userRole}
        onWelcomeTextChange={(text) => {
          onWelcomeTextChange(text);
          setIsEditing(false);
        }}
      />
      
      {userRole === 'admin' && !isEditing && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 hover:bg-red-100"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4 text-red-600" />
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