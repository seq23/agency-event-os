import { updateAttendeeProfileAction } from "@/lib/actions/attendeeProfileActions";
import { getCurrentAttendeeProfile } from "@/services/attendees/attendeeSessionService";

export async function EditAttendeeProfilePanel({ eventId }: { eventId: string }) {
  const profile = await getCurrentAttendeeProfile(eventId);
  if (!profile) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4" data-testid="attendee-profile-panel">
      <h2 className="text-lg font-black text-slate-950">Attendee profile</h2>
      <p className="mt-1 text-sm text-slate-600">{profile.name} · {profile.title} · {profile.company}</p>
      <p className="mt-2 text-xs text-slate-500">Profile editing is event-scoped. This identity does not create platform, crew, sponsor, operator, or admin access.</p>
      <form action={updateAttendeeProfileAction} className="mt-4 grid gap-3" data-testid="edit-attendee-profile-form">
        <input type="hidden" name="eventId" value={eventId} />
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-xs font-bold text-slate-600">Name<input name="name" defaultValue={profile.name} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="text-xs font-bold text-slate-600">Company / affiliation<input name="company" defaultValue={profile.company} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="text-xs font-bold text-slate-600">Title / role<input name="title" defaultValue={profile.title} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-bold text-slate-600">Website<input name="personalWebsite" defaultValue={profile.personalWebsite || ""} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="text-xs font-bold text-slate-600">Social links<textarea name="socialLinks" defaultValue={(profile.socialLinks || []).join("\n")} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="text-xs font-bold text-slate-600">Topics of interest<textarea name="topicsOfInterest" defaultValue={(profile.topicsOfInterest || []).join("\n")} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="text-xs font-bold text-slate-600">Networking goals<textarea name="networkingGoals" defaultValue={profile.networkingGoals || ""} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="networkingOptIn" defaultChecked={profile.networkingOptIn} /> Include me in the people directory and networking queue.</label>
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Save event-scoped profile</button>
      </form>
    </section>
  );
}
