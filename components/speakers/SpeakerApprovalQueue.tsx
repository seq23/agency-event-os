import { getEventApprovalQueue } from "@/services/approval-ops";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
export function SpeakerApprovalQueue({eventId}:{eventId:string}){const items=getEventApprovalQueue(eventId).filter(i=>i.itemType.startsWith("speaker_"));return <SectionCard title="Speaker approval queue" eyebrow="Assets, scripts, decks"><div className="space-y-3">{items.map(item=><div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-semibold">{item.title}</p><StatusBadge status={item.status} tone="warn"/></div><p className="mt-1 text-sm text-slate-600">{item.lastComment}</p></div>)}</div></SectionCard>}
