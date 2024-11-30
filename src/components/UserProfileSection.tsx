import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

export const UserProfileSection = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (!ignore) {
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        if (!sessionData.session) {
          if (!ignore) {
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role')
          .eq('id', sessionData.session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error("Erreur lors du chargement du profil");
          if (!ignore) {
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        if (!ignore) {
          setProfile(profileData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("Erreur lors du chargement du profil");
        if (!ignore) {
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

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

      setProfile(prev => prev ? { ...prev, role: 'admin' } : null);
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