import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [userType, setUserType] = useState<"client" | "admin">("client");

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">AvantDeVenir</CardTitle>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant={userType === "client" ? "default" : "outline"}
              onClick={() => setUserType("client")}
            >
              Mode Client
            </Button>
            <Button
              variant={userType === "admin" ? "default" : "outline"}
              onClick={() => setUserType("admin")}
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