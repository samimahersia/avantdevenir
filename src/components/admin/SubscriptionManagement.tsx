import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SubscriptionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: subscriptionPlans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("max_consulates");
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subscriptionInfo } = useQuery({
    queryKey: ["subscription-info"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      return data;
    }
  });

  const handleUpgrade = async (priceId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { price_id: priceId }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Une erreur est survenue lors de la création de la session de paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de l'abonnement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans?.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li>Organismes max : {plan.max_consulates}</li>
                    <li>Services par organisme : {plan.max_services_per_consulate}</li>
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgrade(plan.price_id)}
                    disabled={isLoading}
                  >
                    {plan.name === "Gratuit" ? "Plan actuel" : "Passer au premium"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {subscriptionInfo && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Utilisation actuelle</h3>
              <p>Organismes : {subscriptionInfo.currentConsulatesCount} / {subscriptionInfo.subscription?.max_consulates}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;