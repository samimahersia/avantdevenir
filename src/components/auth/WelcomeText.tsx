import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeTextProps {
  userRole: string | null;
}

export const WelcomeText = ({ userRole }: WelcomeTextProps) => {
  const { data: welcomeText = "" } = useQuery({
    queryKey: ['welcome-text'],
    queryFn: async () => {
      const { data: content, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'login_welcome_text')
        .single();

      if (error) throw error;
      return content?.content || "";
    }
  });

  return (
    <div className="p-6 rounded-lg">
      <div className="p-4 rounded-lg">
        <div className="text-black whitespace-pre-line text-center">
          {welcomeText}
        </div>
      </div>
    </div>
  );
};