import LogoSection from "@/components/admin/notification/LogoSection";
import { WelcomeText } from "@/components/auth/WelcomeText";

interface AuthInfoSectionProps {
  userRole: string | null;
}

export const AuthInfoSection = ({ userRole }: AuthInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <LogoSection userRole={userRole} />
      </div>
      <div className="flex-1 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm border border-gray-100/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <WelcomeText userRole={userRole} />
      </div>
    </div>
  );
};