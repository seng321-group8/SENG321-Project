import { useState } from "react";

/**
 * "Takvime ekle" button. Downloads the .ics for a CONFIRMED appointment from
 * GET /api/appointments/:id/ics/ (only the student and the advisor of that appointment may call it).
 * The file opens directly in Apple/Google/Outlook calendar apps.
 */
export default function AddToCalendarButton({ appointment, baseUrl = "/api" }) {
  const [state, setState] = useState("idle"); // idle | loading | error

  if (!appointment || appointment.status !== "CONFIRMED") return null; // only confirmed appointments

  async function download() {
    setState("loading");
    try {
      const res = await fetch(`${baseUrl}/appointments/${appointment.id}/ics/`, { credentials: "include" });
      if (!res.ok) throw new Error(String(res.status));
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `randevu-${appointment.id}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={download}
        disabled={state === "loading"}
        className="rounded-md bg-sky-800 px-3 py-2 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-60"
      >
        {state === "loading" ? "Hazırlanıyor…" : "Takvime ekle"}
      </button>
      {state === "error" && (
        <span role="alert" className="text-xs text-red-700">
          Takvim dosyası indirilemedi. Lütfen tekrar deneyin.
        </span>
      )}
    </div>
  );
}
