import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const MessagesTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <CardTitle>Messages</CardTitle>
        </div>
        <CardDescription>
          Gérez vos messages et communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Cette fonctionnalité sera bientôt disponible.
        </p>
      </CardContent>
    </Card>
  );
};

export default MessagesTab;