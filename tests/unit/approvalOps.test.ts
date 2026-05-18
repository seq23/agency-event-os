import { describe, expect, it } from "vitest";
import { assetApprovalMatrix, getApprovalSummary, getEventApprovalQueue } from "@/services/approval-ops";
describe("approval ops",()=>{it("returns approval items",()=>{const items=getEventApprovalQueue("event-summit");const summary=getApprovalSummary("event-summit");expect(items.length).toBeGreaterThan(0);expect(summary.blocking).toBeGreaterThan(0);});it("includes matrix rules",()=>{expect(assetApprovalMatrix.some(r=>r.assetType==="speaker_deck"&&r.producerLocksFinalUse)).toBe(true);});});
