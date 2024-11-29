import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Calendar, Building, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Index = () => {
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [selectedConsulate, setSelectedConsulate] = useState<string>();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const { data: consulates = [] } = useQuery({
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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* User Profile and Auth Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {profile && (
              <>
                <Avatar>
                  <AvatarFallback>
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-medium">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            )}
          </div>
          {!profile && (
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/auth")}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Authentification
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                S'inscrire
              </Button>
            </div>
          )}
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
              <Button
                size="lg"
                variant={userType === "admin" ? "default" : "outline"}
                onClick={() => setUserType("admin")}
                className="w-full sm:w-auto"
              >
                Mode Administrateur
              </Button>
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
                      {/* Profile component will be implemented later */}
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
            ) : (
              <AdminDashboard />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;