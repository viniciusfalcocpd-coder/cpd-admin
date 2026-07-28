import { PageHeader } from "@/components/page-header";
import { TechnicalDiagnosticForm } from "@/components/technical-diagnostic-form";

export const metadata = {
  title: "Laudo tecnico",
};

export default function LaudoTecnicoPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Laudo tecnico"
        description="Versao moderna do prototipo atual, agora como modulo do CPD Manager."
      />

      <TechnicalDiagnosticForm />
    </div>
  );
}
