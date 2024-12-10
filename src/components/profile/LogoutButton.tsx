import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Déconnexion</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Déconnexion</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}