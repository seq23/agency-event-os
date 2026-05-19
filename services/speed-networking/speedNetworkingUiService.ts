import type { SpeedNetworkingEntry, SpeedNetworkingMatch } from "@/types/speedNetworkingEngine";

export function buildNetworkingUiState(input: {
  entry?: SpeedNetworkingEntry;
  match?: SpeedNetworkingMatch;
  now?: string;
}) {
  if (!input.entry) {
    return { state: "not_joined" as const, label: "Join networking" };
  }

  if (input.match && (input.match.status === "created" || input.match.status === "active")) {
    return { state: "matched" as const, label: "Join matched room", matchId: input.match.id };
  }

  if (input.entry.status === "waiting") {
    return { state: "waiting" as const, label: "Waiting for match" };
  }

  return { state: "inactive" as const, label: "Return to queue" };
}

export function getRemainingMatchSeconds(match: SpeedNetworkingMatch, now = new Date()) {
  return Math.max(Math.floor((new Date(match.expiresAt).getTime() - now.getTime()) / 1000), 0);
}
