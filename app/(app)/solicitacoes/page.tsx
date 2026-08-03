import { redirect } from "next/navigation";

export const metadata = {
  title: "Solicitacoes",
};

export default function SolicitacoesPage() { redirect("/central"); }
