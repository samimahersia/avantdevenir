import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ProfileEmail } from "./profile/ProfileEmail";
import { LogoutButton } from "./profile/LogoutButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

export function UserProfileSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: profile, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("No session found");
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.session.user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          await supabase.auth.signOut();
          navigate("/auth");
          throw new Error("Session expired");
        }
        throw error;
      }
      return profile as Profile;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching profile:', error);
        toast.error("Erreur lors du chargement du profil");
      }
    }
  });

  const handleSave = () => {
    // Créer un élément <a> temporaire
    const element = document.createElement('a');
    
    // Obtenir tout le contenu HTML de la page
    const htmlContent = document.documentElement.outerHTML;
    
    // Créer un Blob avec le contenu HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Créer une URL pour le Blob
    element.href = URL.createObjectURL(blob);
    
    // Définir le nom du fichier
    const date = new Date().toISOString().split('T')[0];
    element.download = `sauvegarde-site-${date}.html`;
    
    // Simuler un clic pour déclencher le téléchargement
    document.body.appendChild(element);
    element.click();
    
    // Nettoyer
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    
    toast.success("Site sauvegardé avec succès");
  };

  if (isError || !profile) {
    return (
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="gap-2 text-white"
          onClick={() => navigate("/auth")}
        >
          <LogOut className="h-4 w-4" />
          {t("auth.login")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Sauvegarder le site</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sauvegarder le site</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ProfileEmail profile={profile} />
        <LogoutButton />
      </div>
    </div>
  );
}