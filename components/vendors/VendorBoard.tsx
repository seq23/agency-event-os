import { getRuntimeData, getEvent, getVendorAssignmentsForEvent } from "@/lib/runtime/getRuntimeData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function VendorDirectory() {
  const data = getRuntimeData();

  return (
    <SectionCard title="Vendor directory" eyebrow="External services">
      <div className="grid gap-4 md:grid-cols-2">
        {data.vendors.map((vendor) => (
          <div key={vendor.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{vendor.name}</p>
                <p className="text-sm text-slate-500">{vendor.serviceCategory}</p>
              </div>
              <StatusBadge status={vendor.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{vendor.primaryContactName} · {vendor.primaryContactEmail}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function EventVendorBoard({ eventId }: { eventId: string }) {
  const data = getRuntimeData();
  const event = getEvent(eventId);
  const assignments = getVendorAssignmentsForEvent(event.id);

  return (
    <SectionCard title={`${event.name} vendors`} eyebrow="Deliverables">
      <div className="space-y-3">
        {assignments.map((assignment) => {
          const vendor = data.vendors.find((item) => item.id === assignment.vendorId);
          return (
            <div key={assignment.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{vendor?.name}</p>
                  <p className="text-sm text-slate-500">{assignment.serviceCategory} · due {assignment.dueAt}</p>
                </div>
                <StatusBadge status={assignment.status} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{assignment.sharedNotes}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
