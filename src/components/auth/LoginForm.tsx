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
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log("Form submitted with values:", values);
    try {
      await handleLogin(values);
    } catch (error) {
      console.error("Login error in form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LoginFormFields form={form} />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connexion en cours...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Se connecter</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;