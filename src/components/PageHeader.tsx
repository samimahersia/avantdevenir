import { CardTitle } from "@/components/ui/card";
import { UserTypeButtons } from "./header/UserTypeButtons";
import { HeaderImage } from "./header/HeaderImage";
import { AboutSection } from "./header/AboutSection";

interface PageHeaderProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
}

export const PageHeader = ({ userType, setUserType, userRole }: PageHeaderProps) => {
  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex items-center justify-center">
        <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-8">
          AvantDeVenir
        </CardTitle>
      </div>
      
      <div className="w-full flex flex-col items-center gap-8">
        <div className="w-full max-w-3xl">
          <HeaderImage 
            src="/images/consulate-service.jpg"
            alt="Service consulaire"
          />
        </div>
        
        <div className="w-full max-w-3xl">
          <AboutSection userRole={userRole} />
        </div>
      </div>
      
      <UserTypeButtons 
        userType={userType}
        setUserType={setUserType}
        userRole={userRole}
      />
    </div>
  );
};