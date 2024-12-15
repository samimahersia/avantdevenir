import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeTab = ({ userRole }: { userRole: string | null }) => {
  const [welcomeText, setWelcomeText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', 'site-logo');

      const response = await fetch('/functions/v1/upload-site-asset', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Erreur lors de la mise à jour du logo");
    } finally {
      setIsUploading(false);
    }
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
          <Button onClick={() => setIsEditing(false)}>
            Enregistrer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex justify-center w-24 h-24 relative group">
              <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Logo du site"
                  className="w-full h-full object-cover"
                />
              </div>
              {userRole === 'admin' && (
                <label 
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  htmlFor="logo-upload"
                >
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            
            {/* Text Section */}
            <div className="flex-grow relative">
              {userRole === 'admin' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 transition-opacity"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 group">
                <p className="text-[1.15em] font-semibold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  Bienvenue sur AvantDeVenir
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Votre plateforme de gestion de rendez-vous consulaires
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};