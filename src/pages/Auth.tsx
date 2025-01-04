import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInfoSection } from "@/components/auth/AuthInfoSection";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Checking existing session...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast.error("Erreur lors de la vérification de la session");
          return;
        }

        if (session) {
          console.log("Active session found, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }

        console.log("No active session found");
      } catch (error) {
        console.error("Unexpected error during auth check:", error);
        toast.error("Une erreur inattendue est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      
      if (session) {
        console.log("New session detected, redirecting to dashboard");
        navigate("/dashboard");
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <AuthHeader />
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mt-8">
          <div className="h-full">
            <AuthInfoSection userRole={null} />
          </div>
          <div>
            <AuthForm activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;