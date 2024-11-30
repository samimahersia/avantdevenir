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

const ServiceManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 15,
    max_concurrent: 3,
  });

  const { data: services = [], refetch } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  const handleOpenDialog = (service?: any) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || "",
        duration: service.duration,
        max_concurrent: service.max_concurrent,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        duration: 15,
        max_concurrent: 3,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(formData)
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Service modifié avec succès");
      } else {
        const { error } = await supabase
          .from("services")
          .insert([formData]);

        if (error) throw error;
        toast.success("Service ajouté avec succès");
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        const { error } = await supabase
          .from("services")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Service supprimé avec succès");
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
        <CardTitle>Gestion des Services</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un service
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Durée: {service.duration} minutes, Max concurrent: {service.max_concurrent}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(service)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleDelete(service.id)}
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
              {editingService ? "Modifier le service" : "Ajouter un service"}
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
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Durée (minutes)</label>
              <Input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rendez-vous simultanés maximum</label>
              <Input
                type="number"
                min="1"
                value={formData.max_concurrent}
                onChange={(e) =>
                  setFormData({ ...formData, max_concurrent: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingService ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceManagement;