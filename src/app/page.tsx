import SalesDashboard from "@/components/SalesDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SalesDashboard />
      </div>
    </div>
  );
}

