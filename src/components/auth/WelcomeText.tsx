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

  const renderWelcomeText = (text: string) => {
    const lines = text.split('\n');
    if (lines.length === 0) return null;

    return (
      <>
        <p className="text-[1.15em] font-semibold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
          {lines[0]}
        </p>
        {lines.slice(1).map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </>
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
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
          <Button onClick={handleSaveText}>
            Enregistrer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-sm">
      <div className="text-center text-gray-600 dark:text-gray-300 whitespace-pre-line font-sans">
        {renderWelcomeText(welcomeText)}
      </div>
      {userRole === 'admin' && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};