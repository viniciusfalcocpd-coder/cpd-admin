import { redirect } from "next/navigation";

export const metadata = {
  title: "Usuarios",
};

export default function UsuariosPage() { redirect("/administracao?tab=usuarios"); }
