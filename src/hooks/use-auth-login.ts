import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useAuthLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Starting login process with email:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
        
        // Gestion spécifique de l'erreur "email non confirmé"
        if (error.message.includes("Email not confirmed")) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: values.email,
          });

          if (resendError) {
            console.error("Error resending confirmation email:", resendError);
            toast.error("Erreur lors du renvoi de l'email de confirmation");
            return;
          }

          toast.warning(
            "Votre email n'est pas confirmé. Un nouvel email de confirmation vient d'être envoyé.",
            { duration: 6000 }
          );
          return;
        }

        // Autres types d'erreurs
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error("Erreur de connexion");
        }
        return;
      }

      if (data.session) {
        console.log("Login successful, redirecting to home");
        toast.success("Connexion réussie");
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
};