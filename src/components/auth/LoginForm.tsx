import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LogIn } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormFields } from "./LoginFormFields";
import { useAuthLogin, loginSchema, type LoginFormValues } from "@/hooks/use-auth-login";

const LoginForm = () => {
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
    if (isLoading) return; // Prevent multiple submissions
    console.log("Form submitted with values:", values);
    await handleLogin(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LoginFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-11" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-white">Connexion en cours...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              <span>Se connecter</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;