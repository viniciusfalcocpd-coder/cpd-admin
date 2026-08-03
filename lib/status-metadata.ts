export type StatusMetadata = { label: string; className: string };

export const statusMetadata: Record<string, StatusMetadata> = {
  open: { label: "Pendente", className: "classic-status-pending" },
  in_progress: { label: "Em atendimento", className: "classic-status-progress" },
  waiting_material: { label: "Aguardando material", className: "classic-status-waiting" },
  done: { label: "Concluída", className: "classic-status-done" },
  canceled: { label: "Cancelada", className: "classic-status-danger" },
  pending: { label: "Pendente", className: "classic-status-pending" },
  in_maintenance: { label: "Em manutenção", className: "classic-status-progress" },
  waiting_parts: { label: "Aguardando peças", className: "classic-status-waiting" },
  ready: { label: "Pronto", className: "classic-status-done" },
  written_off: { label: "Baixa patrimonial", className: "classic-status-danger" },
  em_uso: { label: "Em uso", className: "classic-status-done" },
  em_manutencao: { label: "Em manutenção", className: "classic-status-progress" },
  reserva: { label: "Reserva", className: "classic-status-olive" },
  inoperante: { label: "Inoperante", className: "classic-status-danger" },
  sincronizado: { label: "Sincronizado", className: "classic-status-agent" },
  desatualizado: { label: "Desatualizado", className: "classic-status-pending" },
  sem_inventario: { label: "Sem coleta", className: "classic-status-neutral" },
  draft: { label: "Rascunho", className: "classic-status-neutral" },
  sent: { label: "Enviada", className: "classic-status-progress" },
  review: { label: "Em análise", className: "classic-status-pending" },
  approved: { label: "Aprovada", className: "classic-status-done" },
  buying: { label: "Em compra", className: "classic-status-waiting" },
  received: { label: "Recebida", className: "classic-status-agent" },
  rejected: { label: "Rejeitada", className: "classic-status-danger" },
  active: { label: "Ativo", className: "classic-status-done" },
  maintenance: { label: "Manutenção", className: "classic-status-progress" },
  reserved: { label: "Reservado", className: "classic-status-olive" },
  damaged: { label: "Danificado", className: "classic-status-danger" },
};

export function getStatusMetadata(value: string): StatusMetadata {
  return statusMetadata[value] ?? { label: value, className: "classic-status-neutral" };
}
