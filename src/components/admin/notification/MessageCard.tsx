import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "./types";

interface MessageCardProps {
  message: Message;
  onDelete: (id: string) => void;
  onPrint: (message: Message) => void;
  onSendResponse: (id: string, response: string) => void;
}

export const MessageCard = ({ message, onDelete, onPrint, onSendResponse }: MessageCardProps) => {
  const [response, setResponse] = useState("");

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">
            {message.profiles.first_name} {message.profiles.last_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(message.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrint(message)}
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mb-4">{message.content}</p>
      {message.admin_response ? (
        <div className="bg-muted p-4 rounded-md">
          <p className="font-semibold mb-2">Réponse :</p>
          <p>{message.admin_response}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            placeholder="Écrire une réponse..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <Button 
            onClick={() => {
              onSendResponse(message.id, response);
              setResponse("");
            }}
            disabled={!response}
          >
            Envoyer la réponse
          </Button>
        </div>
      )}
    </div>
  );
};