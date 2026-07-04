/**
 * Общий доступ к DeviceOrientation (DESIGN.md §4.5).
 * iOS 13+ отдаёт данные только после requestPermission() по клику и на HTTPS —
 * поэтому enableGyro() зовут либо сразу (Android), либо из кнопки ( ENABLE MOTION ).
 */

type GyroState = { beta: number; gamma: number };
type GyroFn = (g: GyroState) => void;

type DOEWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const listeners = new Set<GyroFn>();
let attached = false;

function onOrientation(e: DeviceOrientationEvent) {
  const state = { beta: e.beta ?? 0, gamma: e.gamma ?? 0 };
  listeners.forEach((fn) => fn(state));
}

export function gyroNeedsPermission(): boolean {
  return (
    typeof window !== "undefined" &&
    "DeviceOrientationEvent" in window &&
    typeof (DeviceOrientationEvent as DOEWithPermission).requestPermission ===
      "function"
  );
}

export async function enableGyro(): Promise<boolean> {
  if (attached) return true;
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
    return false;
  }
  if (gyroNeedsPermission()) {
    try {
      const res = await (
        DeviceOrientationEvent as DOEWithPermission
      ).requestPermission!();
      if (res !== "granted") return false;
    } catch {
      return false;
    }
  }
  window.addEventListener("deviceorientation", onOrientation);
  attached = true;
  return true;
}

export function isGyroEnabled(): boolean {
  return attached;
}

export function subscribeGyro(fn: GyroFn): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
