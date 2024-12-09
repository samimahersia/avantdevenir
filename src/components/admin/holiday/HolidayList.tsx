import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Holiday {
  id: string;
  date: string;
  description?: string;
}

interface HolidayListProps {
  holidays: Holiday[];
  onDelete: (id: string) => void;
  onEdit: (holiday: Holiday) => void;
}

const HolidayList = ({ holidays, onDelete, onEdit }: HolidayListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Jours fériés configurés</h3>
      {holidays.length === 0 ? (
        <p className="text-muted-foreground">Aucun jour férié configuré</p>
      ) : (
        <div className="space-y-2">
          {holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(holiday.date), "EEEE d MMMM yyyy", { locale: fr })}
                </p>
                {holiday.description && (
                  <p className="text-sm text-muted-foreground">{holiday.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(holiday)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(holiday.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HolidayList;