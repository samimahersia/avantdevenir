import LogoSection from "@/components/admin/notification/LogoSection";
import { WelcomeText } from "@/components/auth/WelcomeText";

interface AuthInfoSectionProps {
  userRole: string | null;
}

export const AuthInfoSection = ({ userRole }: AuthInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-[0.3] bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <LogoSection userRole={userRole} />
      </div>
      <div className="flex-[0.7] bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <WelcomeText userRole={userRole} />
      </div>
    </div>
  );
};