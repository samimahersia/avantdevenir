import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MobileNavigation } from "@/components/MobileNavigation";
import { PageHeader } from "@/components/PageHeader";
import { DashboardContent } from "@/components/DashboardContent";
import { UserProfileSection } from "@/components/UserProfileSection";

const Index = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [selectedConsulate, setSelectedConsulate] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("No session found, redirecting to auth...");
          navigate("/auth");
          return;
        }
        
        console.log("Session found:", session);
        setSession(session);
      } catch (err) {
        console.error("Session check error:", err);
        setError("Erreur lors de la vérification de la session");
        navigate("/auth");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      if (!session) {
        console.log("No session in auth state change, redirecting to auth...");
        navigate("/auth");
        return;
      }
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        if (!session) {
          return;
        }

        console.log("Checking user profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("Erreur lors du chargement du profil");
          return;
        }

        console.log("Profile loaded:", profile);
        setUserRole(profile?.role || null);
        
        if (userType === "admin" && profile?.role !== "admin") {
          setUserType("client");
          toast.error("Vous n'avez pas les droits d'accès au mode administrateur");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur de vérification d'authentification");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      checkAuth();
    }
  }, [session, userType]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center w-full max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => navigate("/auth")} 
            className="w-full"
          >
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center w-full max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log("No session in render, redirecting to auth...");
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <MobileNavigation 
            userType={userType} 
            setUserType={setUserType} 
            userRole={userRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <div className="flex items-center gap-4">
            <UserProfileSection />
          </div>
        </div>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-600/80">
          <PageHeader userType={userType} setUserType={setUserType} userRole={userRole} />
          <CardContent className="p-4 sm:p-6">
            <DashboardContent 
              userType={userType}
              userRole={userRole}
              selectedConsulate={selectedConsulate}
              setSelectedConsulate={setSelectedConsulate}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
