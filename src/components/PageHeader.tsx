import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface PageHeaderProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
}

export const PageHeader = ({ userType, setUserType, userRole }: PageHeaderProps) => {
  return (
    <CardHeader className="text-center pb-3 p-0">
      <div className="max-w-full mx-auto space-y-3">
        <div className="relative w-full h-40 md:h-48 lg:h-80 overflow-hidden rounded-t-lg shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f"
            alt="Agenda professionnel"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent shadow-2xl"></div>
        </div>
        
        <div className="px-2 md:px-6">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 md:mb-4">
            AvantDeVenir
          </CardTitle>
          
          <div className="hidden md:flex flex-col sm:flex-row justify-center gap-4 mt-4 md:mt-6 mb-6 md:mb-8">
            {userRole !== "admin" && (
              <Button
                size="lg"
                variant={userType === "client" ? "default" : "outline"}
                onClick={() => setUserType("client")}
                className="w-full sm:w-auto"
              >
                Mode Client
              </Button>
            )}
            {userRole === "admin" && (
              <Button
                size="lg"
                variant={userType === "admin" ? "default" : "outline"}
                onClick={() => setUserType("admin")}
                className="w-full sm:w-auto"
              >
                Mode Administrateur
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};