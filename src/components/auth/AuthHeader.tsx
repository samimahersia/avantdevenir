import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export const AuthHeader = () => {
  return (
    <>
      <ThemeSwitcher />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center mb-8">
        AvantDeVenir.com
      </h1>
    </>
  );
};