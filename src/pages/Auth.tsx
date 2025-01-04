import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInfoSection } from "@/components/auth/AuthInfoSection";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          setUserRole(profile?.role || null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (!isLoading) {
      fetchUserRole();
    }
  }, [isLoading]);

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[100vw] mx-auto relative">
        <AuthHeader />
        <AuthInfoSection userRole={userRole} />
        <AuthForm activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Auth;