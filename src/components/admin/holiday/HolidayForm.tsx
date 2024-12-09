import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fr } from "date-fns/locale";

interface HolidayFormProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  description: string;
  setDescription: (description: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const HolidayForm = ({
  selectedDate,
  setSelectedDate,
  description,
  setDescription,
  isSubmitting,
  onSubmit
}: HolidayFormProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Fixer l'heure à midi pour éviter les problèmes de fuseau horaire
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);
      setSelectedDate(normalizedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Date du jour férié</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
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
  );
};

export default HolidayForm;