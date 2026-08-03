import { redirect } from "next/navigation";

export const metadata = {
  title: "Demandas",
};

export default function DemandasPage() { redirect("/patrimonio?tab=manutencoes"); }
