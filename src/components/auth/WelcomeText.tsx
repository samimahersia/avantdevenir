import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeTextProps {
  welcomeText: string;
  userRole: string | null;
  onWelcomeTextChange: (text: string) => void;
}

export const WelcomeText = ({ welcomeText, userRole, onWelcomeTextChange }: WelcomeTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  const handleEdit = () => {
    setEditedText(welcomeText);
    setIsEditing(true);
  };

  const handleSaveText = async () => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content: editedText })
        .eq('key', 'login_welcome_text');

      if (error) throw error;

      onWelcomeTextChange(editedText);
      setIsEditing(false);
      toast.success("Texte de bienvenue mis à jour avec succès");
    } catch (error) {
      console.error('Error updating welcome text:', error);
      toast.error("Erreur lors de la mise à jour du texte");
    }
  };

  if (isEditing) {
    return (
      <div className="h-full p-8 space-y-4">
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          rows={8}
          className="w-full resize-none"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveText}>
            Enregistrer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full p-8">
      <div className="text-center text-gray-600 dark:text-gray-300 whitespace-pre-line font-sans">
        {welcomeText}
      </div>
      {userRole === 'admin' && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </Button>
      )}
    </div>
  );
};