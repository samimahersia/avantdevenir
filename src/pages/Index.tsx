import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Calendar, Building } from "lucide-react";
import { UserProfileSection } from "@/components/UserProfileSection";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [selectedConsulate, setSelectedConsulate] = useState<string>();
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <UserProfileSection />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AvantDeVenir
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
              <div className="max-w-md mx-auto">
                <Select value={selectedConsulate} onValueChange={setSelectedConsulate}>
                  <SelectTrigger className="w-full">
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
            )}
          </CardHeader>

          <CardContent>
            {userType === "client" ? (
              <Tabs defaultValue="appointments" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appointments" className="space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Rendez-vous</span>
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="space-x-2">
                    <UserCircle className="h-4 w-4" />
                    <span>Profil</span>
                  </TabsTrigger>
                  <TabsTrigger value="consulate" className="space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Consulat</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                  <ClientDashboard selectedConsulate={selectedConsulate} />
                </TabsContent>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mon Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Gérez vos informations personnelles ici.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="consulate">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations du Consulat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedConsulate ? (
                        <div className="space-y-4">
                          {consulates.find(c => c.id === selectedConsulate) ? (
                            <>
                              <h3 className="font-semibold">
                                {consulates.find(c => c.id === selectedConsulate)?.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {consulates.find(c => c.id === selectedConsulate)?.address}
                              </p>
                              <p className="text-muted-foreground">
                                {consulates.find(c => c.id === selectedConsulate)?.city}, {consulates.find(c => c.id === selectedConsulate)?.country}
                              </p>
                            </>
                          ) : (
                            <p>Chargement des informations...</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Veuillez sélectionner un consulat pour voir ses informations.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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