import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Profile {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: string;
  date: string;
  profiles: Profile;
}

const TechnicalSupport = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: issues = [], isLoading } = useQuery<Issue[]>({
    queryKey: ["appointments", "issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          title,
          description,
          status,
          date,
          profiles:client_id (
            email,
            first_name,
            last_name
          )
        `)
        .or('status.eq.refuse,description.ilike.%problème%,description.ilike.%erreur%')
        .order('created_at', { ascending: false })
        .returns<Issue[]>();

      if (error) throw error;
      return data;
    },
  });

  const filteredIssues = issues.filter((issue) => {
    const searchString = searchTerm.toLowerCase();
    const clientName = `${issue.profiles?.first_name} ${issue.profiles?.last_name}`.toLowerCase();
    const clientEmail = issue.profiles?.email?.toLowerCase() || "";
    
    return (
      clientName.includes(searchString) ||
      clientEmail.includes(searchString) ||
      issue.description?.toLowerCase().includes(searchString) ||
      issue.title.toLowerCase().includes(searchString)
    );
  });

  const handleResolveIssue = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'approuve' })
        .eq('id', appointmentId);

      if (error) throw error;
      toast.success("Le problème a été résolu avec succès");
    } catch (error) {
      console.error('Error resolving issue:', error);
      toast.error("Erreur lors de la résolution du problème");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "approuve":
        return <Badge variant="success" className="bg-green-100 text-green-800">Approuvé</Badge>;
      case "refuse":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Technique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Rechercher par nom, email ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p>Chargement des problèmes...</p>
            ) : filteredIssues.length === 0 ? (
              <p>Aucun problème trouvé</p>
            ) : (
              filteredIssues.map((issue) => (
                <Card key={issue.id} className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        {getStatusBadge(issue.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Client: {issue.profiles?.first_name} {issue.profiles?.last_name} ({issue.profiles?.email})
                      </p>
                      <p className="text-sm">
                        Date: {format(new Date(issue.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                      {issue.description && (
                        <p className="text-sm mt-2">{issue.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.status !== 'approuve' && (
                        <Button
                          onClick={() => handleResolveIssue(issue.id)}
                          variant="outline"
                          className="whitespace-nowrap"
                        >
                          Résoudre le problème
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSupport;