import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ServiceForm from "./service/ServiceForm";
import ServiceList from "./service/ServiceList";

const ServiceManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

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

  const handleSubmit = async (formData: any) => {
    try {
      if (editingService) {
        // Mise à jour du service
        const { error: serviceError } = await supabase
          .from("services")
          .update({
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            max_concurrent: formData.max_concurrent
          })
          .eq("id", editingService.id);

        if (serviceError) throw serviceError;

        // Mise à jour des liens avec les consulats
        const { error: deleteError } = await supabase
          .from("consulate_services")
          .delete()
          .eq("service_id", editingService.id);

        if (deleteError) throw deleteError;

        if (formData.consulateIds.length > 0) {
          const { error: insertError } = await supabase
            .from("consulate_services")
            .insert(
              formData.consulateIds.map((consulateId: string) => ({
                service_id: editingService.id,
                consulate_id: consulateId
              }))
            );

          if (insertError) throw insertError;
        }

        toast.success("Service modifié avec succès");
      } else {
        // Création du service
        const { data: newService, error: serviceError } = await supabase
          .from("services")
          .insert([{
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            max_concurrent: formData.max_concurrent
          }])
          .select()
          .single();

        if (serviceError) throw serviceError;

        // Création des liens avec les consulats
        if (formData.consulateIds.length > 0) {
          const { error: insertError } = await supabase
            .from("consulate_services")
            .insert(
              formData.consulateIds.map((consulateId: string) => ({
                service_id: newService.id,
                consulate_id: consulateId
              }))
            );

          if (insertError) throw insertError;
        }

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
        <Button onClick={() => {
          setEditingService(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un service
        </Button>
      </CardHeader>
      <CardContent>
        <ServiceList 
          services={services}
          onEdit={(service) => {
            setEditingService(service);
            setIsDialogOpen(true);
          }}
          onDelete={handleDelete}
        />
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Modifier le service" : "Ajouter un service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={editingService}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceManagement;