import { Download, Loader2 } from "lucide-react";
import { useCertificates, useDownloadCertificate } from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/context/LanguageContext";

export function CertificatesPanel() {
  const { translations } = useLanguage();
  const t = translations.profile.certificates;

  const { data: certData, isLoading } = useCertificates();
  const downloadMutation = useDownloadCertificate();

  if (isLoading) return <Loader2 className="mx-auto h-6 w-6 animate-spin [color:var(--primary-color)]" />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.title}</h2>
      {!certData?.list?.length ? (
        <p className="text-sm text-gray-500">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {certData.list.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <h3 className="font-medium text-gray-900">{cert.template_name}</h3>
                <p className="text-xs text-gray-500">
                  {t.issued}: {new Date(cert.issued_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => downloadMutation.mutate(cert.id)}
                disabled={downloadMutation.isPending}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                <Download className="h-3.5 w-3.5" /> {t.downloadZip}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}