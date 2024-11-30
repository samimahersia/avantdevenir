import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileSection } from "@/components/UserProfileSection";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ServiceSelector from "@/components/appointment/ServiceSelector";

const Index = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [selectedConsulate, setSelectedConsulate] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
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

  const { data: consulates = [], isLoading: isLoadingConsulates } = useQuery({
    queryKey: ["consulates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulates")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading || isLoadingConsulates) {
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
        <div className="flex justify-end items-center mb-6">
          <UserProfileSection />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6 p-0">
            <div className="max-w-full mx-auto space-y-6">
              <div className="relative w-full h-80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f"
                  alt="Agenda professionnel"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <div className="px-6">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AvantDeVenir
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button
                    size="lg"
                    variant={userType === "client" ? "default" : "outline"}
                    onClick={() => setUserType("client")}
                    className="w-full sm:w-auto"
                  >
                    Mode Client
                  </Button>
                  {userRole === "admin" && (
                    <Button
                      size="lg"
                      variant={userType === "admin" ? "default" : "outline"}
                      onClick={() => setUserType("admin")}
                      className="w-full sm:w-auto"
                    >
                      Mode Administrateur
                    </Button>
                  )}
                </div>

                {userType === "client" && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mt-6">
                    <div className="w-full sm:w-1/2">
                      <Select 
                        value={selectedConsulate} 
                        onValueChange={setSelectedConsulate}
                      >
                        <SelectTrigger className="bg-[#D3E4FD] border-[#D3E4FD] hover:bg-[#C3D4ED]">
                          <SelectValue placeholder="Sélectionnez un consulat" />
                        </SelectTrigger>
                        <SelectContent>
                          {consulates.map((consulate) => (
                            <SelectItem key={consulate.id} value={consulate.id}>
                              {consulate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <ServiceSelector
                        selectedService={selectedService}
                        onServiceSelect={setSelectedService}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {userType === "client" ? (
              <ClientDashboard 
                selectedConsulate={selectedConsulate} 
                selectedService={selectedService}
              />
            ) : userRole === "admin" ? (
              <AdminDashboard />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;