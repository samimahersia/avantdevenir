import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck, UserX, Lock, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { decryptData } from "@/utils/encryption";
import { Input } from "@/components/ui/input";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [decryptedData, setDecryptedData] = useState<EncryptedData | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

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

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast.success("Informations de l'utilisateur mises à jour avec succès");
      setShowEditDialog(false);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erreur lors de la mise à jour des informations");
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
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Administrateur" : "Client"}
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Modifier
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <Input
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;