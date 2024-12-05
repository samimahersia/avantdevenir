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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Bienvenue
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
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
                      brand: '#4F46E5',
                      brandAccent: '#4338CA',
                      inputBackground: 'white',
                      inputBorder: '#E5E7EB',
                      inputBorderHover: '#D1D5DB',
                      inputBorderFocus: '#4F46E5',
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
                  button: 'w-full px-4 py-2 text-sm font-medium',
                  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
                  input: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
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
                  },
                  sign_up: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Créez un mot de passe',
                    button_label: "S'inscrire",
                    loading_button_label: 'Inscription en cours...',
                  },
                  forgotten_password: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    button_label: 'Réinitialiser le mot de passe',
                    loading_button_label: 'Envoi en cours...',
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