import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthLogin, LoginFormValues, loginSchema } from "@/hooks/use-auth-login";
import { LoginFormFields } from "./LoginFormFields";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { isLoading, handleLogin } = useAuthLogin();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Soumission du formulaire avec les valeurs:", values);
    await handleLogin(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoginFormFields form={form} />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Connexion en cours...</span>
            </div>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </Form>
  );
}