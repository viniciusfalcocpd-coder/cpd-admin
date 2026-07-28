"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, BadgeInfo, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.email && values.password) {
      toast.success("Acesso interno liberado.");
      router.push("/dashboard");
      return;
    }

    toast.error("Informe as credenciais para continuar.");
  });

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md border-border">
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border bg-muted text-foreground">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">CPD Manager</h1>
              <p className="text-sm text-muted-foreground">Acesso interno do Centro de Processamento de Dados.</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">E-mail</label>
              <Input type="email" placeholder="nome@prefeitura.local" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" placeholder="********" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full">
              <KeyRound className="h-4 w-4" />
              Entrar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Nesta etapa o acesso opera em modo local para permitir a navegacao e o
                desenho da interface sem integrar ao banco.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
