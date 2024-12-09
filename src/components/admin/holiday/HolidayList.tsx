import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Pencil } from "lucide-react";

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
                  onClick={() => onEdit(holiday)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(holiday.id)}
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
  );
};

export default HolidayList;