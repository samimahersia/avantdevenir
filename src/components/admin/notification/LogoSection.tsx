import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface LogoSectionProps {
  userRole: string | null;
}

const LogoSection = ({ userRole }: LogoSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // Récupérer le logo actuel depuis site_assets
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

      // First check if user is admin
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

      // 1. Upload the file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      // 3. Update or insert the record in site_assets table
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
    <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg p-6">
      <div className="flex justify-center items-center min-h-[200px] rounded-lg p-4">
        <div 
          className="relative group bg-white/50 dark:bg-gray-700/50 rounded-lg p-4 cursor-pointer"
          onClick={() => userRole === 'admin' && document.getElementById('logo-upload')?.click()}
        >
          <img 
            src={logoData?.url || "/placeholder.svg"} 
            alt="Logo" 
            className="w-32 h-32 object-contain transition-opacity duration-300 group-hover:opacity-50"
          />
          
          {userRole === 'admin' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-blue-600 p-3 rounded-full shadow-xl">
                <Pencil className="h-8 w-8 text-white" strokeWidth={2.5} />
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
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
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

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
            disabled={isUploading}
          />
        </>
      )}
    </div>
  );
};

export default LogoSection;