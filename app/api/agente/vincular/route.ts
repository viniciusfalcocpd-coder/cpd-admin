import { NextResponse } from "next/server";

import { getPatrimonioForAgenteByNumero } from "@/services/patrimonio";

type VincularRequestBody = {
  patrimonio?: string | number;
};

export async function POST(request: Request) {
  let body: VincularRequestBody | null = null;

  try {
    body = (await request.json()) as VincularRequestBody;
  } catch {
    body = null;
  }

  const patrimonioValue = body?.patrimonio;
  const patrimonio =
    typeof patrimonioValue === "string" || typeof patrimonioValue === "number"
      ? String(patrimonioValue).trim()
      : "";

  if (!patrimonio) {
    return NextResponse.json(
      {
        success: false,
        error: "Patrimônio não informado",
      },
      { status: 400 },
    );
  }

  try {
    const data = await getPatrimonioForAgenteByNumero(patrimonio);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Patrimônio não encontrado",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao consultar patrimonio para vinculo do agente:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao consultar patrimônio",
      },
      { status: 500 },
    );
  }
}
