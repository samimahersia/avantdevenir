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
      console.log("Tentative de connexion avec:", values.email);

      // First, check if the user exists
      const { data: userExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();

      if (!userExists) {
        console.log("Utilisateur non trouvé dans la base de données");
        toast.error("Aucun compte trouvé avec cet email");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Erreur de connexion détaillée:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
          return;
        }

        if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
          return;
        }

        toast.error(`Erreur de connexion: ${error.message}`);
        return;
      }

      if (data?.session) {
        console.log("Session créée avec succès:", {
          user: data.session.user.id,
          email: data.session.user.email
        });
        toast.success("Connexion réussie !");
        navigate("/");
      } else {
        console.error("Session non créée après connexion réussie");
        toast.error("Erreur inattendue lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur inattendue lors de la connexion:", error);
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