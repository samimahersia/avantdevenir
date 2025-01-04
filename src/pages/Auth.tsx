import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInfoSection } from "@/components/auth/AuthInfoSection";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#1A1F2C] dark:from-gray-900 dark:to-gray-800">
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