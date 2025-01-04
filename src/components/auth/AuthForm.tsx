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
    <Card className="mt-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
          {activeTab === "login" ? "Connexion" : "Inscription"}
        </CardTitle>
        <CardDescription className="text-center font-bold italic text-gray-600">
          {activeTab === "login"
            ? "Connectez-vous à votre compte"
            : "Créez votre compte"}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-white">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white">
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