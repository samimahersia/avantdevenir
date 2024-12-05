import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

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

  const { data: profile } = useQuery({
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

      if (error) throw error;
      return profile as Profile;
    },
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
      
      // First check if we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // If no session exists, just navigate to auth page
        navigate("/auth");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate("/auth")}
        >
          <LogOut className="h-4 w-4" />
          Connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-red-600 font-medium">
          {profile.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}