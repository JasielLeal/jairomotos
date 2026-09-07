import { redirect } from "next/navigation";
import { formatDate } from "@/lib/format";
import { verifySession } from "@/lib/dal";
import { getOverviewData } from "@/app/dashboard/lib/get-overview-data";
import { StatsGrid } from "@/app/dashboard/components/stats-grid";
import { RevenueTrendCard } from "@/app/dashboard/components/revenue-trend-card";
import { InvoiceStatusCard } from "@/app/dashboard/components/invoice-status-card";
import { RecentInvoicesCard } from "@/app/dashboard/components/recent-invoices-card";
import { TopPerformersCard } from "@/app/dashboard/components/top-performers-card";
import { LowStockCard } from "@/app/dashboard/components/low-stock-card";

export default async function DashboardOverviewPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/dashboard/estoque");
  }

  const data = await getOverviewData();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Visão Geral
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo do mês atual — {formatDate(new Date())}
        </p>
      </div>

      <StatsGrid data={data} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueTrendCard points={data.revenueTrend.points} />
        <InvoiceStatusCard
          breakdown={data.invoiceStatusBreakdown}
          totalInvoicedCents={data.totalInvoicedCents}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentInvoicesCard invoices={data.recentInvoices} />
        <TopPerformersCard performers={data.topPerformers} />
      </div>

      <LowStockCard products={data.lowStockProducts} />
    </div>
  );
}
