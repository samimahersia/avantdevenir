import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  admin_response?: string;
}

interface MessageListProps {
  messages: Message[];
  onDelete: (messageId: string) => void;
}

const MessageList = ({ messages, onDelete }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="p-4 rounded-lg border bg-card">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(message.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-left">{message.content}</p>
            {message.admin_response && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Réponse de l'administrateur:</p>
                <p className="text-sm mt-1 text-left">{message.admin_response}</p>
              </div>
            )}
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="text-center text-muted-foreground">
          Aucun message
        </p>
      )}
    </div>
  );
};

export default MessageList;