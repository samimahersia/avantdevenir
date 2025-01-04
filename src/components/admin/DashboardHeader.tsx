interface DashboardHeaderProps {
  planType: "free" | "premium";
}

const DashboardHeader = ({ planType }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Tableau de Bord
        </h2>
      </div>
    </div>
  );
};

export default DashboardHeader;