import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const UserManagement = () => {
  const { data: users = [], refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast.success(`Rôle de l'utilisateur mis à jour avec succès`);
      refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800"
            >
              <div className="space-y-1 mb-4 sm:mb-0">
                <p className="font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Inscrit le {format(new Date(user.created_at), "d MMMM yyyy", { locale: fr })}
                </p>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Administrateur" : "Client"}
                </Badge>
              </div>
              <div className="flex gap-2">
                {user.role !== "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleUpdateUserRole(user.id, "admin")}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Promouvoir admin
                  </Button>
                )}
                {user.role === "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    onClick={() => handleUpdateUserRole(user.id, "client")}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Rétrograder
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleUpdateUserRole(user.id, "banned")}
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Bannir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;