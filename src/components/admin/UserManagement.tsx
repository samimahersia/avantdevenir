import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck, UserX, Lock, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { decryptData } from "@/utils/encryption";

interface EncryptedData {
  personalData?: {
    phoneNumber?: string;
    address?: string;
    birthDate?: string;
    nationality?: string;
  };
  documents?: {
    passportNumber?: string;
    idCardNumber?: string;
  };
}

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [decryptedData, setDecryptedData] = useState<EncryptedData | null>(null);

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

  const handleViewEncryptedData = async (user: any) => {
    setSelectedUser(user);
    setShowEncryptedData(true);
    
    try {
      const decrypted: EncryptedData = {
        personalData: user.encrypted_personal_data ? await decryptData(user.encrypted_personal_data) : undefined,
        documents: user.encrypted_documents ? await decryptData(user.encrypted_documents) : undefined
      };
      setDecryptedData(decrypted);
    } catch (error) {
      console.error("Error decrypting data:", error);
      toast.error("Erreur lors du décryptage des données");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "consulter":
        return "secondary";
      case "client":
        return "outline";
      default:
        return "destructive";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "consulter":
        return "Consultant";
      case "client":
        return "Client";
      case "banned":
        return "Banni";
      default:
        return role;
    }
  };

  return (
    <>
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
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleViewEncryptedData(user)}
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Données sensibles
                  </Button>
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
                  {user.role !== "consulter" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      onClick={() => handleUpdateUserRole(user.id, "consulter")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Définir consultant
                    </Button>
                  )}
                  {user.role !== "client" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      onClick={() => handleUpdateUserRole(user.id, "client")}
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Définir client
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

      <Dialog open={showEncryptedData} onOpenChange={setShowEncryptedData}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Données sensibles - {selectedUser?.first_name} {selectedUser?.last_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {decryptedData?.personalData && (
              <div>
                <h3 className="font-medium mb-2">Données personnelles</h3>
                <div className="space-y-2 text-sm">
                  {decryptedData.personalData.phoneNumber && (
                    <p>Téléphone: {decryptedData.personalData.phoneNumber}</p>
                  )}
                  {decryptedData.personalData.address && (
                    <p>Adresse: {decryptedData.personalData.address}</p>
                  )}
                  {decryptedData.personalData.birthDate && (
                    <p>Date de naissance: {decryptedData.personalData.birthDate}</p>
                  )}
                  {decryptedData.personalData.nationality && (
                    <p>Nationalité: {decryptedData.personalData.nationality}</p>
                  )}
                </div>
              </div>
            )}
            {decryptedData?.documents && (
              <div>
                <h3 className="font-medium mb-2">Documents</h3>
                <div className="space-y-2 text-sm">
                  {decryptedData.documents.passportNumber && (
                    <p>Numéro de passeport: {decryptedData.documents.passportNumber}</p>
                  )}
                  {decryptedData.documents.idCardNumber && (
                    <p>Numéro de carte d'identité: {decryptedData.documents.idCardNumber}</p>
                  )}
                </div>
              </div>
            )}
            {!decryptedData?.personalData && !decryptedData?.documents && (
              <p className="text-muted-foreground">Aucune donnée sensible enregistrée</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;