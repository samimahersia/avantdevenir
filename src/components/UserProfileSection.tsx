import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LogIn, UserPlus, Mail, Shield } from "lucide-react";
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
          .maybeSingle();

        if (!existingProfile && !profileError) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
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
        } else if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          toast.error('Erreur lors du chargement du profil');
          return;
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

  const handlePromoteToAdmin = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, role: 'admin' });
      toast.success('Promu administrateur avec succès');
    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast.error('Erreur lors de la promotion');
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
          Authentification
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
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Déconnexion</span>
      </Button>
    </div>
  );
};