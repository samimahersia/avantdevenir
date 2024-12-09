import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileSection } from "@/components/UserProfileSection";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MobileNavigation } from "@/components/MobileNavigation";
import { PageHeader } from "@/components/PageHeader";
import { DashboardContent } from "@/components/DashboardContent";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  console.log("Index component rendering");
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
    console.log("Checking initial session");
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check result:", session ? "Logged in" : "Not logged in");
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth");
          return;
        }
        
        setSession(session);
      } catch (err) {
        console.error("Session check error:", err);
        setError("Erreur lors de la vérification de la session");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event);
      if (!session) {
        console.log("Session ended, redirecting to auth");
        navigate("/auth");
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth and loading profile");
        setIsLoading(true);
        
        if (!session) {
          console.log("No active session");
          return;
        }

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => navigate("/auth")} 
            className="w-full md:w-auto"
          >
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    console.log("No session, redirecting to auth");
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[100vw] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <MobileNavigation 
            userType={userType} 
            setUserType={setUserType} 
            userRole={userRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            <UserProfileSection />
          </div>
        </div>

        <Card className="shadow-lg overflow-hidden">
          <PageHeader userType={userType} setUserType={setUserType} userRole={userRole} />
          <CardContent className="p-4 md:p-6">
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
