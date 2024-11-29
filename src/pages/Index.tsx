import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [userType, setUserType] = useState<"client" | "admin">("client");

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AvantDeVenir
          </CardTitle>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant={userType === "client" ? "default" : "outline"}
              onClick={() => setUserType("client")}
              className="w-full sm:w-auto"
            >
              Mode Client
            </Button>
            <Button
              size="lg"
              variant={userType === "admin" ? "default" : "outline"}
              onClick={() => setUserType("admin")}
              className="w-full sm:w-auto"
            >
              Mode Administrateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userType === "client" ? <ClientDashboard /> : <AdminDashboard />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;