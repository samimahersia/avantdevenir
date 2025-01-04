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

      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession?.session) {
        await supabase.auth.signOut();
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Erreur de connexion:", {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect. Veuillez réessayer.");
          return;
        }

        if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez confirmer votre email avant de vous connecter");
          return;
        }

        toast.error("Erreur lors de la connexion. Veuillez réessayer plus tard.");
        return;
      }

      if (data?.session) {
        console.log("Connexion réussie:", {
          userId: data.session.user.id,
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