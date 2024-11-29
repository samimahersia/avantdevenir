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
        if (!session?.user) {
          setProfile(null);
          return;
        }

        // First, try to get the existing profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata.first_name,
                last_name: session.user.user_metadata.last_name,
                role: 'client'
              }])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              toast.error('Erreur lors de la création du profil');
              return;
            }
            
            setProfile(newProfile);
          } else {
            console.error('Error fetching profile:', profileError);
            toast.error('Erreur lors du chargement du profil');
            return;
          }
        } else {
          setProfile(existingProfile);
        }
      } catch (error) {
        console.error('Error in getProfile:', error);
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