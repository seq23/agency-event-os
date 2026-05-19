import { EventPortfolioTabs } from "@/components/events/EventPortfolioTabs";
import { EventReadinessSummary } from "@/components/events/EventReadinessSummary";
import { EventRiskPanel } from "@/components/events/EventRiskPanel";
import { EventPersistencePanel } from "@/components/persistence/EventPersistencePanel";
import { getRuntimeData } from "@/lib/runtime/getRuntimeData";

export async function EventPortfolio() {
  const data = getRuntimeData();
  return (
    <div className="space-y-6">
      <EventPersistencePanel agencyId={data.agencies[0]?.id ?? "00000000-0000-0000-0000-000000000001"} clientId={data.clients[0]?.id ?? "00000000-0000-0000-0000-000000000101"} />
      <EventReadinessSummary />
      <EventRiskPanel />
      <EventPortfolioTabs />
    </div>
  );
}
