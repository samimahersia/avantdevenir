import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export const AuthHeader = () => {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0">
        <ThemeSwitcher />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-400 bg-clip-text text-transparent text-center mb-8 drop-shadow-lg">
        AvantDeVenir.com
      </h1>
    </div>
  );
};