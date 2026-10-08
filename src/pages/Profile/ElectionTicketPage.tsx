import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Vote,
  Ticket,
  Calendar,
  Clock,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useElectionPublicStatistics,
  useElectionTicket,
} from "@/features/election/hooks/useElection";
function TicketFetcher({ ticketT }: { ticketT: any }) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useElectionTicket();

  const ticketCode = data?.data?.ticket || data?.ticket;

  const handleCopy = async () => {
    if (ticketCode) {
      await navigator.clipboard.writeText(ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin [color:var(--primary-color)]" />
        <p className="text-base font-medium text-gray-600">
          {ticketT.generating}
        </p>
      </div>
    );
  }

  if (isError || !ticketCode) {
    return (
      <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 text-center">
        <AlertTriangle className="mx-auto h-6 w-6 text-red-600 mb-2" />
        <p className="text-sm font-medium text-red-800">
          {ticketT.alreadyGotError}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center animate-in fade-in zoom-in duration-500">
      <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-8 shadow-inner">
        <p className="text-sm font-bold text-green-800 uppercase tracking-widest mb-3">
          {ticketT.ticketLabel}
        </p>
        <div className="font-mono text-4xl sm:text-5xl font-black text-gray-900 tracking-[0.2em] break-all mb-6">
          {ticketCode}
        </div>

        <button
          onClick={handleCopy}
          className="mx-auto flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto min-w-[200px]"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-600">{ticketT.copied}</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5 text-gray-500" />
              {ticketT.copyBtn}
            </>
          )}
        </button>
      </div>
      <p className="mt-4 text-sm font-bold text-red-600 max-w-lg mx-auto">
        {ticketT.saveWarning}
      </p>
    </div>
  );
}
export default function ElectionTicketPage() {
  const { language, translations } = useLanguage();
  const isAr = language === "ar";

  const pageT = translations.election.ticketPage;
  const ticketT = translations.profile.election;

  const [confirmed, setConfirmed] = useState(false);
  const [requested, setRequested] = useState(false);

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
  } = useElectionPublicStatistics();

  const stats = statsResponse?.data || statsResponse;

  const formatDate = (isoString: string) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString(isAr ? "ar-SD" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin [color:var(--primary-color)] mb-4" />
        <p className="text-gray-500 font-medium">{pageT.loadingStats}</p>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-50 rounded-xl border border-red-200 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
        <p className="text-sm font-medium text-red-700">{pageT.errorStats}</p>
      </div>
    );
  }

  const isLive = stats.engage_election;

  return (
    <div
      className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Header & Stats Banner */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(var(--primary-color), 0.1)" }}
            >
              <Vote
                className="h-7 w-7"
                style={{ color: "var(--primary-color)" }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {pageT.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {pageT.cycle}
                {stats.current_cycle}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              isLive
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            {isLive ? pageT.statusLive : pageT.statusInactive}
          </span>
        </div>

        <div className="space-y-6">
          <p className="text-base text-gray-700 leading-relaxed">
            {isLive ? (
              <>
                {pageT.guideLivePrefix}{" "}
                <strong
                  className="px-1 text-lg"
                  style={{ color: "var(--primary-color)" }}
                >
                  {stats.vote_limit}
                </strong>{" "}
                {pageT.guideLiveSuffix}
              </>
            ) : (
              pageT.guideInactive
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: "var(--primary-color)" }}
              >
                <Ticket className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {pageT.ticketsStart}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-auto">
                {isLive
                  ? formatDate(stats.tickets_start_time)
                  : pageT.perCycleNotice}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {pageT.voteStart}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-auto">
                {isLive ? formatDate(stats.start_time) : pageT.perCycleNotice}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Clock className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {pageT.voteEnd}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-auto">
                {isLive ? formatDate(stats.end_time) : pageT.perCycleNotice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Generation Zone */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        {isLive ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <ShieldCheck
                className="mx-auto h-12 w-12"
                style={{ color: "var(--primary-color)" }}
              />
              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {ticketT.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {ticketT.description}
              </p>
            </div>

            {!requested ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-amber-50 p-5 border border-amber-200">
                  <h3 className="flex items-center gap-2 font-bold text-amber-800 mb-3 text-sm sm:text-base">
                    <AlertTriangle className="h-5 w-5" />
                    {ticketT.warningTitle}
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-sm text-amber-900">
                    <li>{ticketT.warning1}</li>
                    <li className="font-semibold">{ticketT.warning2}</li>
                    <li className="font-bold underline">{ticketT.warning3}</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors focus-within:border-[var(--primary-color)] focus-within:ring-2 focus-within:ring-[var(--primary-color)]/20">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 cursor-pointer"
                    style={{ color: "var(--primary-color)" }}
                  />
                  <span className="text-sm sm:text-base font-medium text-gray-800 select-none">
                    {ticketT.confirmCheckbox}
                  </span>
                </label>

                <button
                  onClick={() => setRequested(true)}
                  disabled={!confirmed}
                  className={`w-full rounded-xl px-6 py-4 text-base font-bold text-white transition-all ${
                    confirmed
                      ? "shadow-md hover:shadow-lg transform hover:-translate-y-0.5 filter hover:brightness-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  style={
                    confirmed ? { backgroundColor: "var(--primary-color)" } : {}
                  }
                >
                  {ticketT.generateBtn}
                </button>
              </div>
            ) : (
              <TicketFetcher ticketT={ticketT} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {pageT.ticketUnavailableTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {pageT.ticketUnavailableDesc}
            </p>
          </div>
        )}
      </section>

      {/* Navigation */}
      {isLive && (
        <div className="flex justify-center sm:justify-end">
          <Link
            to="/election"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Vote className="h-5 w-5" />
            <span>{pageT.goToElection}</span>
            <ArrowRight className={`h-5 w-5 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      )}
    </div>
  );
}
