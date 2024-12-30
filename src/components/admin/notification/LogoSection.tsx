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
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  return (
    <div className="relative p-6 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex justify-center items-center h-full">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="h-24 w-auto object-contain"
        />
      </div>
      
      {userRole === 'admin' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white hover:bg-red-100 border border-red-200"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modifier le logo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
        />
      )}
    </div>
  );
};

export default LogoSection;