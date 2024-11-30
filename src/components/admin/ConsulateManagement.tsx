import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ConsulateManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConsulate, setEditingConsulate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
  });

  const { data: consulates = [], refetch } = useQuery({
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

  const handleOpenDialog = (consulate?: any) => {
    if (consulate) {
      setEditingConsulate(consulate);
      setFormData({
        name: consulate.name,
        address: consulate.address,
        city: consulate.city,
        country: consulate.country,
        timezone: consulate.timezone,
      });
    } else {
      setEditingConsulate(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        country: "",
        timezone: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConsulate) {
        const { error } = await supabase
          .from("consulates")
          .update(formData)
          .eq("id", editingConsulate.id);

        if (error) throw error;
        toast.success("Consulat modifié avec succès");
      } else {
        const { error } = await supabase
          .from("consulates")
          .insert([formData]);

        if (error) throw error;
        toast.success("Consulat ajouté avec succès");
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce consulat ?")) {
      try {
        const { error } = await supabase
          .from("consulates")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Consulat supprimé avec succès");
        refetch();
      } catch (error) {
        console.error("Error:", error);
        toast.error("Une erreur est survenue");
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Consulats</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un consulat
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consulates.map((consulate) => (
            <div
              key={consulate.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{consulate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {consulate.address}, {consulate.city}, {consulate.country}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(consulate)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleDelete(consulate.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingConsulate ? "Modifier le consulat" : "Ajouter un consulat"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Adresse</label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pays</label>
              <Input
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fuseau horaire</label>
              <Input
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({ ...formData, timezone: e.target.value })
                }
                required
                placeholder="Europe/Paris"
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingConsulate ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ConsulateManagement;