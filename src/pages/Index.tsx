import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [selectedConsulate, setSelectedConsulate] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          navigate("/auth");
          return;
        }

        if (!session) {
          console.log("No active session found, redirecting to auth");
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/auth");
      }
    };

    checkSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const sessionResponse = await supabase.auth.getSession();
        const session = sessionResponse.data.session;
        
        if (!session) {
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Erreur lors du chargement du profil");
          return;
        }

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

    checkAuth();
  }, [userType, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
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
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <UserProfileSection />
          </div>
        </div>

        <Card className="shadow-lg">
          <PageHeader userType={userType} setUserType={setUserType} userRole={userRole} />
          <CardContent>
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