import { useState } from "react";
import { ShieldCheck, Loader2, AlertTriangle, Copy, Check } from "lucide-react";
import { useElectionTicket } from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/context/LanguageContext"; 

export function ElectionTicketPanel() {
  const { translations } = useLanguage();
  const t = translations.profile.election;

  const [confirmed, setConfirmed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract error handling states from the hook
  const { data, isLoading, isError, error } = useElectionTicket(requested);

  const handleCopy = async () => {
    if (data?.ticket) {
      await navigator.clipboard.writeText(data.ticket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Attempt to extract the backend's specific error message, fallback to localized generic error
  const errorMessage = t.alreadyGotError;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-2 text-lg font-semibold text-gray-900">{t.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{t.description}</p>
      </div>

      {/* ERROR STATE */}
      {isError && (
        <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-200 text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-red-600 mb-2" />
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* PRE-REQUEST STATE: Warnings & Confirmation */}
      {!data?.ticket && !requested && !isError && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-2">
              <AlertTriangle className="h-5 w-5" />
              {t.warningTitle}
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-amber-900">
              <li>{t.warning1}</li>
              <li className="font-semibold">{t.warning2}</li>
              <li className="font-bold underline">{t.warning3}</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer rounded-lg border p-3 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 select-none px-2">
              {t.confirmCheckbox}
            </span>
          </label>

          <button
            onClick={() => setRequested(true)}
            disabled={!confirmed}
            className={`w-full rounded-md px-6 py-3 text-sm font-medium text-white transition-colors ${
              confirmed
                ? "bg-blue-600 hover:bg-blue-700 shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {t.generateBtn}
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">{t.generating}</p>
        </div>
      )}

      {/* SUCCESS STATE: Display Ticket */}
      {data?.ticket && !isError && (
        <div className="mt-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6">
            <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">
              {t.ticketLabel}
            </p>
            <div className="font-mono text-3xl font-black text-gray-900 tracking-widest break-all">
              {data.ticket}
            </div>
            
            <button
              onClick={handleCopy}
              className="mx-auto mt-4 flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  {t.copyBtn}
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs font-bold text-red-600">
            {t.saveWarning}
          </p>
        </div>
      )}
    </div>
  );
}