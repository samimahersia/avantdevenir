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
        <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#D3E4FD] to-[#33C3F0] bg-clip-text text-transparent mb-3 md:mb-4">
          AvantDeVenir
        </CardTitle>
      </div>
      
      <HeaderImage 
        src="/images/consulate-service.jpg"
        alt="Service consulaire"
      />
      
      <AboutSection userRole={userRole} />
      
      <UserTypeButtons 
        userType={userType}
        setUserType={setUserType}
        userRole={userRole}
      />
    </div>
  );
};