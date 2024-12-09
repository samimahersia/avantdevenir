import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

export function UserProfileSection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(false);
      }
    }
  });

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier d'abord s'il y a une session active
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Si pas de session, rediriger directement vers la page d'authentification
        navigate("/auth", { replace: true });
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erreur lors de la déconnexion");
        return;
      }
      
      // Attendre un court instant pour s'assurer que la session est bien détruite
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success("Déconnexion réussie");
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
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
        <span className="text-sm text-blue-500 font-medium">
          {profile.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? "Déconnexion..." : "Déconnexion"}
        </Button>
      </div>
    </div>
  );
}