import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Abonnements</CardTitle>
          <CardDescription>
            Gérez les abonnements et les paramètres de facturation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette fonctionnalité sera bientôt disponible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;