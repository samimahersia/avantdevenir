import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LogoSectionProps {
  userRole: string | null;
}

const LogoSection = ({ userRole }: LogoSectionProps) => {
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg");

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Erreur lors de la mise à jour du logo");
    }
  };

  return (
    <div className="relative p-6 border rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
      {/* Zone principale avec le logo */}
      <div className="flex justify-center items-center min-h-[200px] bg-white/30 rounded-lg p-4">
        <div 
          className="relative group bg-white rounded-lg p-4 cursor-pointer"
          onClick={() => userRole === 'admin' && document.getElementById('logo-upload')?.click()}
        >
          {/* Image du logo */}
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="w-32 h-32 object-contain transition-opacity duration-300 group-hover:opacity-50"
          />
          
          {/* Overlay avec icône au survol */}
          {userRole === 'admin' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-blue-600 p-3 rounded-full shadow-xl">
                <Pencil className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton d'édition en haut à droite */}
      {userRole === 'admin' && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Pencil className="h-5 w-5 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifier le logo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
        </>
      )}
    </div>
  );
};

export default LogoSection;