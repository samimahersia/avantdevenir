import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageList from "./MessageList";
import MessageForm from "../MessageForm";

interface Message {
  id: string;
  content: string;
  created_at: string;
  admin_response?: string;
}

interface MessageSectionProps {
  messages: Message[];
  onDelete: (messageId: string) => void;
}

const MessageSection = ({ messages, onDelete }: MessageSectionProps) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-xl md:text-2xl font-semibold">
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6 space-y-4">
        <MessageList messages={messages} onDelete={onDelete} />
        <MessageForm />
      </CardContent>
    </Card>
  );
};

export default MessageSection;