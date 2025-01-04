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
    <div className="relative">
      <HeaderImage />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80">
        <div className="h-full flex flex-col justify-end pb-6">
          <div className="px-2 md:px-6">
            <div className="flex items-center justify-center">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#B794F4] to-[#D6BCFA] bg-clip-text text-transparent mb-3 md:mb-4 bg-white">
                AvantDeVenir
              </CardTitle>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
              <AboutSection userRole={userRole} />
              <UserTypeButtons 
                userType={userType}
                setUserType={setUserType}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};