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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          setProfile(null);
          return;
        }

        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Erreur lors du chargement du profil');
          return;
        }

        setProfile(existingProfile);
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
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 bg-[#FEF7CD] hover:bg-[#F5EDB3] text-[#8B6E44]"
        >
          <LogIn className="h-4 w-4" />
          Se connecter
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/auth?signup=true")}
          className="flex items-center gap-2 bg-[#D3E4FD] hover:bg-[#C3D4ED] text-[#4B5563]"
        >
          <UserPlus className="h-4 w-4" />
          S'inscrire
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-end">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-right">
          <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
          <p className="text-xs text-muted-foreground">{profile.role}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Déconnexion</span>
      </Button>
    </div>
  );
};