import { api } from "@/config/axios.config";

export type BonusStatus = "PENDING" | "IN_WALLET" | "PAYOUT_REQUESTED" | "PAID";

export interface DriverBonus {
  id: number | string;
  tripId: string;
  driverUserId: number;
  passengerUserId?: number;
  passengerName?: string | null;
  amount: number | string;
  tripTotal?: number | string | null;
  pickupName?: string | null;
  dropoffName?: string | null;
  status: BonusStatus;
  createdAt?: string | null;
  movedToWalletAt?: string | null;
  requestedAt?: string | null;
  requestedYapeNumber?: string | null;
  requestedYapeName?: string | null;
  requestedWalletProvider?: "YAPE" | "PLIN" | "OTHER" | null;
  requestedWalletProviderOther?: string | null;
  requestedWalletLabel?: string | null;
  paidAt?: string | null;
  paidToNumber?: string | null;
  paidAmount?: number | string | null;
  receiptUrl?: string | null;
  driver?: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    mobile?: string | null;
  } | null;
}

/** Entidad de pago solicitada (tolerante si el backend no envía los campos nuevos). */
export const walletLabel = (b: DriverBonus): string => {
  if (b.requestedWalletLabel) return b.requestedWalletLabel;
  if (b.requestedWalletProvider === "YAPE") return "Yape";
  if (b.requestedWalletProvider === "PLIN") return "Plin";
  if (b.requestedWalletProvider === "OTHER")
    return b.requestedWalletProviderOther || "Otros";
  if (b.requestedWalletProviderOther) return b.requestedWalletProviderOther;
  if (b.requestedYapeNumber) return "Yape";
  return "";
};

export interface BonusListMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  totalAmount: number | string;
}

export const fetchDriverBonuses = async (
  status: string,
  page: number,
  limit: number
): Promise<{ data: DriverBonus[]; meta: BonusListMeta }> => {
  const res = await api.get("/driver-bonus", { params: { status, page, limit } });
  const payload = res.data?.data;
  if (payload && !Array.isArray(payload) && Array.isArray(payload.data)) {
    return { data: payload.data, meta: payload.meta ?? ({} as BonusListMeta) };
  }
  return {
    data: Array.isArray(payload) ? payload : [],
    meta: res.data?.meta ?? ({} as BonusListMeta),
  };
};

export const payDriverBonus = async (
  id: number | string,
  form: { paidToNumber: string; paidAmount: string; receipt: File }
): Promise<DriverBonus> => {
  const fd = new FormData();
  fd.append("paidToNumber", form.paidToNumber);
  fd.append("paidAmount", form.paidAmount);
  fd.append("receipt", form.receipt);
  // Sin Content-Type manual: el navegador agrega el boundary.
  const res = await api.post(`/driver-bonus/${id}/pay`, fd, {
    headers: { "Content-Type": undefined as any },
  });
  let bonus = res.data?.data;
  if (bonus && bonus.id == null && bonus.data && typeof bonus.data === "object") {
    bonus = bonus.data;
  }
  return bonus;
};

export const bonusErrorMessage = (err: any): string => {
  const code = err?.response?.data?.code || err?.response?.data?.message;
  const map: Record<string, string> = {
    BE_FORBIDDEN: "No tienes permisos para realizar esta acción.",
    BE_BONUS_INVALID_STATE:
      "Este bono ya no está en espera de pago (puede haberse pagado o cambiado).",
    BE_BONUS_RECEIPT_INVALID:
      "La captura no es válida. Usa una imagen JPG, PNG o WEBP de hasta 5 MB.",
    BE_BONUS_RECEIPT_REQUIRED: "Debes adjuntar la captura del pago.",
    BE_BONUS_INVALID_AMOUNT: "El monto no es válido.",
    BE_BONUS_RECEIPT_UPLOAD_FAILED: "No se pudo subir la captura. Inténtalo de nuevo.",
  };
  return (
    (typeof code === "string" && map[code]) ||
    "Ocurrió un error inesperado. Inténtalo de nuevo."
  );
};
