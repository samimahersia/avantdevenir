import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Bienvenue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connectez-vous pour accéder à votre espace personnel
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-semibold">
              Connexion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#6366f1',
                      brandAccent: '#4f46e5',
                      inputBackground: 'white',
                      inputBorder: '#e5e7eb',
                      inputBorderHover: '#d1d5db',
                      inputBorderFocus: '#6366f1',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.5rem',
                      buttonBorderRadius: '0.5rem',
                      inputBorderRadius: '0.5rem',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'w-full px-4 py-2.5 text-sm font-medium transition-colors',
                  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5',
                  input: 'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:border-gray-600',
                  loader: 'border-indigo-500',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Votre mot de passe',
                    button_label: 'Se connecter',
                    loading_button_label: 'Connexion en cours...',
                    social_provider_text: 'Continuer avec {{provider}}',
                    link_text: "Vous avez déjà un compte ? Connectez-vous",
                  },
                  sign_up: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Créez un mot de passe',
                    button_label: "S'inscrire",
                    loading_button_label: 'Inscription en cours...',
                    social_provider_text: 'Continuer avec {{provider}}',
                    link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                  },
                  forgotten_password: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    button_label: 'Réinitialiser le mot de passe',
                    loading_button_label: 'Envoi en cours...',
                    link_text: 'Mot de passe oublié ?',
                  },
                  update_password: {
                    password_label: 'Nouveau mot de passe',
                    password_input_placeholder: 'Votre nouveau mot de passe',
                    button_label: 'Mettre à jour le mot de passe',
                    loading_button_label: 'Mise à jour en cours...',
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;