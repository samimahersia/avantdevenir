import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

interface AuthFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AuthForm = ({ activeTab, setActiveTab }: AuthFormProps) => {
  return (
    <Card className="mt-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          {activeTab === "login" ? "Connexion" : "Inscription"}
        </CardTitle>
        <CardDescription className="text-center font-bold italic text-gray-600 dark:text-gray-400">
          {activeTab === "login"
            ? "Connectez-vous à votre compte"
            : "Créez votre compte"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 dark:bg-gray-700/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Inscription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};