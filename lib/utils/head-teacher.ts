const DURATION_DAYS = {
  "1d": 1,
  "3d": 3,
  "7d": 7,
  "15d": 15,
  "30d": 30,
} as const;

export type HeadTeacherDuration = keyof typeof DURATION_DAYS;

export function expiresAtForDuration(duration: HeadTeacherDuration) {
  const days = DURATION_DAYS[duration];
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires.toISOString();
}

export function durationLabel(duration: string | null) {
  if (!duration) return null;
  return duration;
}
