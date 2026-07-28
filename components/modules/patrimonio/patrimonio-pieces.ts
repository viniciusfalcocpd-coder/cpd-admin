export const PATRIMONIO_PECAS_POR_EQUIPAMENTO: Record<string, string[]> = {
  Desktop: [
    "Fonte",
    "SSD",
    "HD",
    "Memoria",
    "Processador",
    "Cooler",
    "Placa-mae",
    "Gabinete",
    "Unidade Optica",
  ],
  Notebook: [
    "Tela",
    "Teclado",
    "Touchpad",
    "SSD",
    "HD",
    "Memoria",
    "Bateria",
    "Cooler",
    "Carcaca",
    "Webcam",
  ],
  Impressora: ["Fonte", "Scanner", "Cabeca", "Motor", "Fusor", "Roletes"],
  Monitor: ["Fonte", "Painel LCD", "Placa logica", "Base", "Cabo"],
};

export function getPecasPorEquipamento(nome: string) {
  return PATRIMONIO_PECAS_POR_EQUIPAMENTO[nome] ?? [];
}

