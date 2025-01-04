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
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log("Starting login process");
      
      await cleanupExistingSession();
      const session = await authenticateUser(values);
      
      if (session) {
        await persistSession(session);
        onLoginSuccess();
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

// Fonctions utilitaires privées
const cleanupExistingSession = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
};

const authenticateUser = async (values: LoginFormValues) => {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    handleAuthError(error);
    return null;
  }

  return session;
};

const handleAuthError = (error: any) => {
  console.error("Login error:", error);
  if (error.message === "Invalid login credentials") {
    toast.error("Email ou mot de passe incorrect");
  } else if (error.message.includes("Email not confirmed")) {
    toast.error("Veuillez confirmer votre email avant de vous connecter");
  } else {
    toast.error("Erreur lors de la connexion");
  }
  throw error;
};

const persistSession = async (session: any) => {
  console.log("Login successful, session established");
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
};

const onLoginSuccess = () => {
  toast.success("Connexion réussie");
  window.location.href = "/";
};