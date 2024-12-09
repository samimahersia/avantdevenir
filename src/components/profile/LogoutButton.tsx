import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/auth", { replace: true });
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/auth", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Déconnexion..." : "Déconnexion"}
    </Button>
  );
}