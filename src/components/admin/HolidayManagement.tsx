import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Trash, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const HolidayManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch holidays
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

  // Fetch recent appointments
  const { data: recentAppointments = [] } = useQuery({
    queryKey: ["recent-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("date, title")
        .order("date", { ascending: false })
        .limit(5);
      
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
      const { error } = await supabase
        .from("consulate_holidays")
        .insert({
          date: format(selectedDate, "yyyy-MM-dd"),
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
      <CardHeader>
        <CardTitle>Gestion des jours fériés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleAddHoliday} className="space-y-4">
            <div className="space-y-2">
              <Label>Date du jour férié</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Jour de l'an"
              />
            </div>

            <Button type="submit" disabled={!selectedDate || isSubmitting}>
              {isSubmitting ? "En cours..." : "Ajouter le jour férié"}
            </Button>
          </form>

          <div className="space-y-6">
            <Card className="bg-[#E8F5E9]">
              <CardHeader>
                <CardTitle className="text-lg">Jours fériés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="p-2 bg-white/50 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(holiday.date), "dd MMMM yyyy", { locale: fr })}
                        </p>
                        {holiday.description && (
                          <p className="text-sm text-gray-600">{holiday.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditHoliday(holiday)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {holidays.length === 0 && (
                    <p className="text-gray-600 text-sm">Aucun jour férié enregistré</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Derniers créneaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded-md"
                    >
                      <p className="font-medium">
                        {format(new Date(appointment.date), "dd MMMM yyyy à HH:mm", { locale: fr })}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                    </div>
                  ))}
                  {recentAppointments.length === 0 && (
                    <p className="text-gray-600 text-sm">Aucun rendez-vous récent</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le jour férié</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Jour de l'an"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default HolidayManagement;