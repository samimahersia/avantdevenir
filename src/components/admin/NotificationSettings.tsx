import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Info, Pencil, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import NotificationHistory from "../NotificationHistory";
import NotificationPreferences from "../NotificationPreferences";
import RecentAppointments from "./holiday/RecentAppointments";

const NotificationSettings = () => {
  const [welcomeText, setWelcomeText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchWelcomeText();
    checkUserRole();
  }, []);

  const fetchWelcomeText = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'login_welcome_text')
        .single();

      if (error) throw error;
      if (data) setWelcomeText(data.content);
    } catch (error) {
      console.error('Error fetching welcome text:', error);
      toast.error("Erreur lors du chargement du texte de bienvenue");
    }
  };

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      }
    }
  };

  const handleSaveText = async () => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content: editedText })
        .eq('key', 'login_welcome_text');

      if (error) throw error;

      setWelcomeText(editedText);
      setIsEditing(false);
      toast.success("Texte de bienvenue mis à jour avec succès");
    } catch (error) {
      console.error('Error updating welcome text:', error);
      toast.error("Erreur lors de la mise à jour du texte");
    }
  };

  const handleEdit = () => {
    setEditedText(welcomeText);
    setIsEditing(true);
  };

  return (
    <Tabs defaultValue="welcome" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="welcome" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Bienvenue
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Historique
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Préférences
        </TabsTrigger>
        <TabsTrigger value="schedules">Horaires</TabsTrigger>
      </TabsList>
      
      <TabsContent value="welcome">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={5}
                    className="w-full p-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveText}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex justify-center">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Image className="h-16 w-16 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Text Section */}
                    <div className="flex-grow">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        {welcomeText.split('\n').map((line, index) => (
                          <div key={index} className="flex items-center justify-between group">
                            <p className={index === 0 ? "text-[1.15em] font-semibold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent" : "text-gray-600 dark:text-gray-300"}>
                              {line}
                            </p>
                            {userRole === 'admin' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleEdit}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <NotificationHistory />
      </TabsContent>
      
      <TabsContent value="preferences">
        <NotificationPreferences />
      </TabsContent>

      <TabsContent value="schedules">
        <Card>
          <CardContent className="pt-6">
            <RecentAppointments />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSettings;