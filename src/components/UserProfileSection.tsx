import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

export const UserProfileSection = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) return null;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      return data as Profile;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching profile:', error);
        toast.error("Erreur lors du chargement du profil");
      },
      onSettled: () => {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Promu administrateur avec succès');
    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast.error('Erreur lors de la promotion');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-end gap-2">
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Se connecter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/auth?tab=register')}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>S'inscrire</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-end">
      {profile.role !== 'admin' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePromoteToAdmin}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          <span>Devenir Admin</span>
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Se déconnecter</span>
      </Button>
    </div>
  );
};