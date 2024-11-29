import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord Administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bienvenue dans l'espace administrateur. Ici vous pourrez bientôt gérer tous les rendez-vous.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;