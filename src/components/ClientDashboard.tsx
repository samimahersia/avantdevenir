import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord Client</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace client. Ici vous pourrez bientôt gérer vos rendez-vous.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;