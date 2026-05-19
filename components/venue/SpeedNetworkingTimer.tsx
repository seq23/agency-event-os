export function SpeedNetworkingTimer({ secondsRemaining }: { secondsRemaining: number }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  return <p className="text-4xl font-semibold tabular-nums">{minutes}:{seconds}</p>;
}
