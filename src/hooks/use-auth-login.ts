import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
        console.error("Supabase login error:", error);
        handleAuthError(error);
        return;
      }

      if (data.session) {
        console.log("Login successful, redirecting to home");
        toast.success("Connexion réussie");
        navigate("/");
      } else {
        console.error("No session after successful login");
        toast.error("Erreur lors de la connexion");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast.error("Erreur inattendue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
};

const handleAuthError = (error: any) => {
  console.error("Auth error details:", error);
  
  switch (error.message) {
    case "Invalid login credentials":
      toast.error("Email ou mot de passe incorrect");
      break;
    case "Email not confirmed":
      toast.error("Veuillez confirmer votre email avant de vous connecter");
      break;
    default:
      toast.error("Erreur lors de la connexion: " + error.message);
  }
};