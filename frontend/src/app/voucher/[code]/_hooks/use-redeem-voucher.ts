import { useState } from "react";
import { axiosInstance } from "@/lib/api/orval/client";
import { AxiosError } from "axios";

import type { VoucherRedeemState } from "../_components/types";

interface RedeemResponse {
  amount: string;
  new_balance: string;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export function useRedeemVoucher() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<VoucherRedeemState>({
    status: "idle",
    message: "",
  });

  const redeem = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setState({ status: "loading", message: "" });

    try {
      const data = await axiosInstance<RedeemResponse>({
        url: "/api/v1/vouchers/redeem/",
        method: "POST",
        data: { code: trimmed },
      });

      setState({
        status: "success",
        message: `€${data.amount} has been added to your account!`,
        amount: data.amount,
        newBalance: data.new_balance,
      });
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const message =
        error.response?.data?.error?.message ?? "Something went wrong";
      setState({ status: "error", message });
    }
  };

  return { code, setCode, state, redeem };
}
