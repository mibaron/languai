export interface VoucherRedeemState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  amount?: string;
  newBalance?: string;
}
