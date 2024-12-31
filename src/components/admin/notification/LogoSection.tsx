import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface LogoSectionProps {
  userRole: string | null;
}

const LogoSection = ({ userRole }: LogoSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const { data: logoData, refetch: refetchLogo } = useQuery({
    queryKey: ["site-logo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_assets')
        .select('url')
        .eq('key', 'logo')
        .maybeSingle();

      if (error) {
        console.error('Error fetching logo:', error);
        return null;
      }
      return data;
    }
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('site_assets')
        .upsert({
          key: 'logo',
          url: publicUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (dbError) throw dbError;

      await refetchLogo();
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Erreur lors de la mise à jour du logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8">
      {userRole === 'admin' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => document.getElementById('logo-upload')?.click()}
                disabled={isUploading}
              >
                <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modifier le logo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div 
        className="relative group w-full h-full rounded-lg p-4 cursor-pointer flex items-center justify-center"
        onClick={() => userRole === 'admin' && document.getElementById('logo-upload')?.click()}
      >
        <img 
          src={logoData?.url || "/placeholder.svg"} 
          alt="Logo" 
          className="max-w-[80%] max-h-[80%] w-auto h-auto object-contain transition-all duration-300 group-hover:scale-105"
        />
        
        {userRole === 'admin' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-blue-600 p-3 rounded-full shadow-xl">
              <Pencil className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      {userRole === 'admin' && (
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
          disabled={isUploading}
        />
      )}
    </div>
  );
};

export default LogoSection;