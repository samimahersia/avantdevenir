import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, UserPlus, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', values.email)
        .maybeSingle();

      if (existingUser) {
        toast.error("Un compte existe déjà avec cet email");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez vérifier votre email pour confirmer votre compte");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      form.reset();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Jean" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Dupont" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="email@exemple.com" className="pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Inscription en cours..."
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> S'inscrire
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;