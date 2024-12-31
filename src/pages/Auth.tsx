import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { WelcomeText } from "@/components/auth/WelcomeText";
import { AuthLoader } from "@/components/auth/AuthLoader";
import LogoSection from "@/components/admin/notification/LogoSection";

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
      <div className="max-w-[100vw] mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center mb-8">
          AvantDeVenir.com
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
          <div className="h-[200px] bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <LogoSection userRole={userRole} />
          </div>
          
          <div className="h-[200px] bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <WelcomeText userRole={userRole} />
          </div>
        </div>
        
        <Card className="mt-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {activeTab === "login" ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center font-bold italic">
              {activeTab === "login"
                ? "Connectez-vous à votre compte"
                : "Créez votre compte"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;