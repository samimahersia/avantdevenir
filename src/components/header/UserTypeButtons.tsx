import { Button } from "@/components/ui/button";

interface UserTypeButtonsProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
}

export const UserTypeButtons = ({ userType, setUserType, userRole }: UserTypeButtonsProps) => {
  return (
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
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
        >
          Mode Administrateur
        </Button>
      )}
    </div>
  );
};