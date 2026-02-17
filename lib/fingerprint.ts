// Simple browser fingerprint generator
// Combines multiple device characteristics to create a unique-ish identifier
// This survives cookie/localStorage clearing since it's based on device properties

export async function getDeviceFingerprint(): Promise<string> {
  const components: string[] = [];

  // Screen properties
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);
  components.push(`${window.devicePixelRatio || 1}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);
  components.push((navigator.languages || []).join(","));

  // Platform
  components.push(navigator.userAgent);
  components.push(navigator.hardwareConcurrency?.toString() || "0");
  components.push((navigator as unknown as { deviceMemory?: number }).deviceMemory?.toString() || "0");

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("سنا الرمضانية", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("fingerprint", 4, 35);
      components.push(canvas.toDataURL());
    }
  } catch { /* ignore */ }

  // WebGL renderer
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.push((gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
      }
    }
  } catch { /* ignore */ }

  // Hash all components
  const raw = components.join("|");
  const hash = await hashString(raw);
  return hash;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
