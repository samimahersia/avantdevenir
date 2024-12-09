import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import HolidayForm from "./holiday/HolidayForm";
import HolidayList from "./holiday/HolidayList";
import EditHolidayDialog from "./holiday/EditHolidayDialog";

const HolidayManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: holidays = [], refetch } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consulate_holidays")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    setIsSubmitting(true);
    try {
      // Normaliser la date pour la stocker sans l'heure
      const dateToStore = selectedDate.toISOString().split('T')[0];
      console.log("Date being stored:", dateToStore);

      const { error } = await supabase
        .from("consulate_holidays")
        .insert({
          date: dateToStore,
          description: description.trim() || null
        });

      if (error) throw error;

      toast.success("Jour férié ajouté avec succès");
      setSelectedDate(undefined);
      setDescription("");
      refetch();
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("Erreur lors de l'ajout du jour férié");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      const { error } = await supabase
        .from("consulate_holidays")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Jour férié supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Erreur lors de la suppression du jour férié");
    }
  };

  const handleEditHoliday = (holiday: any) => {
    setEditingHoliday(holiday);
    setDescription(holiday.description || "");
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingHoliday) return;

    try {
      const { error } = await supabase
        .from("consulate_holidays")
        .update({
          description: description.trim() || null
        })
        .eq("id", editingHoliday.id);

      if (error) throw error;

      toast.success("Jour férié modifié avec succès");
      setShowEditDialog(false);
      setEditingHoliday(null);
      setDescription("");
      refetch();
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error("Erreur lors de la modification du jour férié");
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HolidayForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            description={description}
            setDescription={setDescription}
            isSubmitting={isSubmitting}
            onSubmit={handleAddHoliday}
          />

          <div className="space-y-6">
            <HolidayList
              holidays={holidays}
              onDelete={handleDeleteHoliday}
              onEdit={handleEditHoliday}
            />
          </div>
        </div>

        <EditHolidayDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          description={description}
          setDescription={setDescription}
          onSave={handleSaveEdit}
        />
      </CardContent>
    </Card>
  );
};

export default HolidayManagement;