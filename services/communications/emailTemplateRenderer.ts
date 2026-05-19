export function renderEventEmailTemplate(input: { templateKey: string; eventName: string; actionUrl: string; recipientName?: string }) {
  const title = input.templateKey.replaceAll("_", " ");
  const greeting = input.recipientName ? `Hi ${input.recipientName},` : "Hello,";
  const text = `${greeting}\n\n${title} for ${input.eventName}.\n\nOpen: ${input.actionUrl}`;
  const html = `<p>${greeting}</p><h1>${title}</h1><p>${input.eventName}</p><p><a href="${input.actionUrl}">Open event workspace</a></p>`;
  return { subject: `${title}: ${input.eventName}`, text, html };
}
