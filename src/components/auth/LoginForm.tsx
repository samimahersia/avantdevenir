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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <LoginFormFields form={form} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Connexion en cours..."
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Se connecter
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;