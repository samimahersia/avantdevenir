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

  const handleImageClick = () => {
    if (userRole === 'admin') {
      document.getElementById('logo-upload')?.click();
    }
  };

  return (
    <div className="relative p-6 border rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
      <div className="flex justify-center items-center h-full bg-white/20 rounded-lg p-4">
        <div 
          className="relative group cursor-pointer w-40 h-40 flex items-center justify-center bg-white/90 rounded-lg"
          onClick={handleImageClick}
        >
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="max-h-32 max-w-32 object-contain p-2 transition-all duration-300 group-hover:opacity-30"
          />
          {userRole === 'admin' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-blue-600 p-4 rounded-full shadow-lg">
                <Pencil className="h-10 w-10 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {userRole === 'admin' && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white shadow-lg hover:bg-gray-100"
                  onClick={handleImageClick}
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