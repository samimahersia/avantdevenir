import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  planType: "free" | "premium";
}

const DashboardHeader = ({ planType }: DashboardHeaderProps) => {
  const handleSave = () => {
    const element = document.createElement('a');
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    element.download = `sauvegarde-site-${date}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    toast.success("Site sauvegardé avec succès");
  };

  const planInfo = planType === "free" 
    ? "(1 organisme et 3 services / Gratuit)"
    : "(1 organisme et 6 services / 120.00€ par an)";

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Tableau de Bord {planInfo}
        </h2>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Sauvegarder le site</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sauvegarder le site</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DashboardHeader;