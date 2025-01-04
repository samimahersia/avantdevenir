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
    <div className="flex flex-col items-center gap-8 bg-white dark:bg-gray-800 p-6 rounded-lg relative">
      <div className="w-full text-center">
        <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
          AvantDeVenir.com
        </CardTitle>
      </div>
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-start justify-center">
        <HeaderImage 
          src="/images/consulate-service.jpg"
          alt="Service consulaire"
        />
        <div className="flex-1">
          <AboutSection userRole={userRole} />
        </div>
      </div>
      
      <div className="w-full">
        <UserTypeButtons 
          userType={userType}
          setUserType={setUserType}
          userRole={userRole}
        />
      </div>
    </div>
  );
};