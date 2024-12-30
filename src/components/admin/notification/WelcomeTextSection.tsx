import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeTextSectionProps {
  userRole: string | null;
  welcomeText: string;
  onWelcomeTextChange: (text: string) => void;
}

const WelcomeTextSection = ({ userRole, welcomeText, onWelcomeTextChange }: WelcomeTextSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(welcomeText);

  const handleEdit = () => {
    setEditedText(welcomeText);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          key: 'welcome_text',
          content: editedText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      onWelcomeTextChange(editedText);
      setIsEditing(false);
      toast.success("Texte de bienvenue mis à jour avec succès");
    } catch (error) {
      console.error('Error updating welcome text:', error);
      toast.error("Erreur lors de la mise à jour du texte");
    }
  };

  return (
    <div className="relative p-6 border rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
      <div className="bg-white/90 p-4 rounded-lg">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={5}
              className="w-full p-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="text-gray-600 whitespace-pre-line">
              {welcomeText}
            </div>
            {userRole === 'admin' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white hover:bg-white/90"
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
        )}
      </div>
    </div>
  );
};

export default WelcomeTextSection;