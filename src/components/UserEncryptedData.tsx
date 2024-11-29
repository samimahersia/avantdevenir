import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { encryptData } from "@/utils/encryption";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const UserEncryptedData = () => {
  const [personalData, setPersonalData] = useState({
    phoneNumber: "",
    address: "",
    birthDate: "",
    nationality: ""
  });

  const [documents, setDocuments] = useState({
    passportNumber: "",
    idCardNumber: ""
  });

  const { data: profile, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const encryptedPersonalData = await encryptData(personalData);
      const encryptedDocuments = await encryptData(documents);

      const { error } = await supabase
        .from("profiles")
        .update({
          encrypted_personal_data: encryptedPersonalData,
          encrypted_documents: encryptedDocuments
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast.success("Données sensibles mises à jour avec succès");
      refetch();
    } catch (error) {
      console.error("Error updating encrypted data:", error);
      toast.error("Erreur lors de la mise à jour des données sensibles");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Données Sensibles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Données personnelles</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  value={personalData.phoneNumber}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={personalData.address}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={personalData.birthDate}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationalité</Label>
                <Input
                  id="nationality"
                  value={personalData.nationality}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, nationality: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Documents</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="passportNumber">Numéro de passeport</Label>
                <Input
                  id="passportNumber"
                  value={documents.passportNumber}
                  onChange={(e) => setDocuments(prev => ({ ...prev, passportNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="idCardNumber">Numéro de carte d'identité</Label>
                <Input
                  id="idCardNumber"
                  value={documents.idCardNumber}
                  onChange={(e) => setDocuments(prev => ({ ...prev, idCardNumber: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Button type="submit">Enregistrer les données sensibles</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserEncryptedData;