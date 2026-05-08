export interface QaSettings {
  enabled: boolean;
  scenario: string;
  speed: number;
}

export function getQaSettings(search: string): QaSettings {
  const params = new URLSearchParams(search);
  const enabled = params.get("qa") === "1";
  const scenario = params.get("scenario") ?? "happy";
  const parsedSpeed = Number(params.get("speed") ?? "1");
  const speed = Number.isFinite(parsedSpeed) && parsedSpeed > 0 ? parsedSpeed : 1;

  return {
    enabled,
    scenario,
    speed: Math.max(0.05, Math.min(speed, 2)),
  };
}
