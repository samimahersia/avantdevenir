import { CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderImage } from "./header/HeaderImage";
import { AboutSection } from "./header/AboutSection";
import { UserTypeButtons } from "./header/UserTypeButtons";

interface PageHeaderProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
}

export const PageHeader = ({ userType, setUserType, userRole }: PageHeaderProps) => {
  return (
    <CardHeader className="text-center pb-3 p-0">
      <div className="max-w-full mx-auto space-y-3">
        <div className="relative flex flex-col md:flex-row gap-4">
          <HeaderImage 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe"
            alt="Calendrier professionnel"
          />
          <AboutSection userRole={userRole} />
        </div>
        
        <div className="px-2 md:px-6">
          <div className="flex items-center justify-center">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#D6BCFA] to-[#E5DEFF] bg-clip-text text-transparent mb-3 md:mb-4">
              AvantDeVenir
            </CardTitle>
          </div>
          
          <UserTypeButtons 
            userType={userType}
            setUserType={setUserType}
            userRole={userRole}
          />
        </div>
      </div>
    </CardHeader>
  );
};