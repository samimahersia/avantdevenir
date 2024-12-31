import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Abonnements</CardTitle>
        <CardDescription>
          Gérez les paramètres d'abonnement et de facturation
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

export default SubscriptionTab;