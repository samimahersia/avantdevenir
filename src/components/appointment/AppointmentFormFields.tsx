import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const AppointmentFormFields = ({
  title,
  setTitle,
  description,
  setDescription,
}: AppointmentFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-left">Titre du rendez-vous *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Consultation initiale"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'objet de votre rendez-vous..."
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default AppointmentFormFields;