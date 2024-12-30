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
  const [welcomeText, setWelcomeText] = useState("");
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
    const fetchInitialData = async () => {
      try {
        const { data: content, error: contentError } = await supabase
          .from('site_content')
          .select('content')
          .eq('key', 'login_welcome_text')
          .single();

        if (contentError) throw contentError;
        setWelcomeText(content?.content || "");

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
        console.error("Error fetching initial data:", error);
      }
    };

    if (!isLoading) {
      fetchInitialData();
    }
  }, [isLoading]);

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
          AvantDeVenir.com
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <LogoSection userRole={userRole} />
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg p-6">
              <WelcomeText
                welcomeText={welcomeText}
                userRole={userRole}
                onWelcomeTextChange={setWelcomeText}
              />
            </div>
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