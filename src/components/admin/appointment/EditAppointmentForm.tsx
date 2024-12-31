import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditAppointmentFormProps {
  appointment: {
    title: string;
    description: string;
  };
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
}

export const EditAppointmentForm = ({ appointment, onSubmit }: EditAppointmentFormProps) => {
  const [formData, setFormData] = useState({
    title: appointment.title,
    description: appointment.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <Button type="submit">Enregistrer</Button>
    </form>
  );
};