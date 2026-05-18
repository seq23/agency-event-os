import { classifyNetworkQuality, createBrowserDiagnosticResult } from "./browserDiagnosticsService";
import type { BrowserDiagnosticResult } from "@/types/browserDiagnostics";

type BrowserConnection = {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
};

export function getBrowserCompatibilityResult(): BrowserDiagnosticResult {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return createBrowserDiagnosticResult({
      kind: "browser_compatibility",
      label: "Browser compatibility",
      status: "blocked",
      severity: "critical",
      summary: "Browser diagnostics must run in a real browser session.",
      recommendedAction: "Open the testing console in the participant browser before showtime.",
    });
  }

  const hasMediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);
  const hasAudioContext = Boolean(window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  const hasPermissions = Boolean(navigator.permissions?.query);

  if (!hasMediaDevices || !hasAudioContext) {
    return createBrowserDiagnosticResult({
      kind: "browser_compatibility",
      label: "Browser compatibility",
      status: "fail",
      severity: "critical",
      summary: "This browser is missing required media APIs for live diagnostics.",
      recommendedAction: "Switch to a current Chrome, Edge, Safari, or Firefox browser before joining the event.",
      metadata: { hasMediaDevices, hasAudioContext, hasPermissions },
    });
  }

  return createBrowserDiagnosticResult({
    kind: "browser_compatibility",
    label: "Browser compatibility",
    status: hasPermissions ? "pass" : "warn",
    severity: hasPermissions ? "low" : "medium",
    summary: hasPermissions ? "Browser supports required media APIs." : "Browser supports media APIs, but permission introspection is limited.",
    recommendedAction: hasPermissions ? "Proceed to camera and microphone checks." : "Proceed manually and confirm permissions directly in the browser UI.",
    metadata: { hasMediaDevices, hasAudioContext, hasPermissions },
  });
}

export function getNetworkQualityResult(): BrowserDiagnosticResult {
  if (typeof navigator === "undefined") {
    return classifyNetworkQuality({});
  }

  const connection = (navigator as Navigator & { connection?: BrowserConnection; mozConnection?: BrowserConnection; webkitConnection?: BrowserConnection }).connection
    ?? (navigator as Navigator & { mozConnection?: BrowserConnection }).mozConnection
    ?? (navigator as Navigator & { webkitConnection?: BrowserConnection }).webkitConnection;

  return classifyNetworkQuality({
    downlinkMbps: connection?.downlink,
    effectiveType: connection?.effectiveType,
    rttMs: connection?.rtt,
    saveData: connection?.saveData,
  });
}

export async function requestCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera diagnostics are not supported in this browser.");
  }
  return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
}

export async function requestMicrophoneStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone diagnostics are not supported in this browser.");
  }
  return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
}

export function stopMediaStream(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
