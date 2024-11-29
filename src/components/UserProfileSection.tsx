import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const UserProfileSection = () => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Erreur lors de la récupération du profil:', fetchError);
          toast.error('Erreur lors du chargement du profil');
          return;
        }

        if (existingProfile) {
          setProfile(existingProfile);
          return;
        }

        // Création ou mise à jour du profil avec l'ID exact de l'authentification
        const { data: newProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert([{
            id: session.user.id,
            email: session.user.email,
            role: 'client'
          }])
          .select('*')
          .single();

        if (upsertError) {
          console.error('Erreur lors de la création du profil:', upsertError);
          toast.error('Erreur lors de la création du profil');
          return;
        }

        setProfile(newProfile);
      } catch (error) {
        console.error('Erreur dans getProfile:', error);
        toast.error('Erreur lors du chargement du profil');
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (!profile) {
    return (
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Authentification
        </Button>
        <Button
          onClick={() => navigate("/auth?mode=signup")}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          S'inscrire
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>
          {profile.first_name?.[0]}{profile.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="font-medium">
          {profile.first_name} {profile.last_name}
        </p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </div>
  );
};