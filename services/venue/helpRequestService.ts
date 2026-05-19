export function buildHelpRequestDraft(input: {
  agencyId: string;
  eventId: string;
  attendeeId?: string;
  topic: string;
  subject: string;
  message: string;
}) {
  return {
    ...input,
    status: "open" as const,
    createdAt: new Date().toISOString(),
  };
}

export function routeHelpTopic(topic: string) {
  if (topic.toLowerCase().includes("video") || topic.toLowerCase().includes("audio")) return "technical";
  if (topic.toLowerCase().includes("sponsor") || topic.toLowerCase().includes("expo")) return "expo";
  if (topic.toLowerCase().includes("network")) return "networking";
  return "producer_support";
}
