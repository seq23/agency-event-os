import { createEventFromFormSubmitAction } from "@/lib/actions/clientEventActions";
import { SectionCard } from "@/components/shared/SectionCard";

export function EventPersistencePanel({ agencyId, clientId }: { agencyId: string; clientId: string }) {
  return (
    <SectionCard title="Create event" eyebrow="Supabase persistence">
      <form className="grid gap-3 md:grid-cols-2" action={createEventFromFormSubmitAction}>
        <input type="hidden" name="agencyId" value={agencyId} />
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="status" value="draft" />
        <input type="hidden" name="timezone" value="America/Chicago" />
        <input type="hidden" name="registrationEnabled" value="true" />
        <input type="hidden" name="venueEnabled" value="true" />
        <input type="hidden" name="replayEnabled" value="true" />
        <input type="hidden" name="reportingEnabled" value="true" />
        <label className="text-sm font-medium text-slate-700">
          Event name
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="name" required aria-label="Event name" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Slug
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="slug" required aria-label="Event slug" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Type
          <select className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="eventType" defaultValue="virtual_summit" aria-label="Event type">
            <option value="virtual_summit">Virtual summit</option>
            <option value="webinar">Webinar</option>
            <option value="demo_day">Demo day</option>
            <option value="sponsor_expo">Sponsor expo</option>
            <option value="paid_workshop">Paid workshop</option>
            <option value="executive_roundtable">Executive roundtable</option>
            <option value="community_event">Community event</option>
            <option value="course_launch">Course launch</option>
            <option value="internal_town_hall">Internal town hall</option>
            <option value="hybrid_support">Hybrid support</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Start
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="startAt" type="datetime-local" aria-label="Start time" />
        </label>
        <button className="md:col-span-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="submit">
          Create event
        </button>
      </form>
    </SectionCard>
  );
}
