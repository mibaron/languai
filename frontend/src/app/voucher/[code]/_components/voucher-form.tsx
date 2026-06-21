"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Gift, CheckCircle, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRedeemVoucher } from "../_hooks/use-redeem-voucher";

export function VoucherForm() {
  const params = useParams<{ code: string }>();
  const { code, setCode, state, redeem } = useRedeemVoucher();
  const { push } = useRouter();

  const cancel = () => {
    push("/");
  };

  useEffect(() => {
    if (params.code) {
      setCode(decodeURIComponent(params.code));
    }
  }, [params.code, setCode]);

  const isDisabled = state.status === "loading" || state.status === "success";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-brand-muted rounded-2xl p-4">
            <Gift className="text-brand h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Redeem Voucher</h1>
          <p className="text-muted-foreground text-sm">
            Enter your voucher code to add credit to your account
          </p>
        </div>

        <div className="space-y-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter voucher code"
            disabled={isDisabled}
            className="h-12 text-center font-mono text-lg tracking-widest uppercase"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled) redeem();
            }}
          />

          <Button onClick={redeem} disabled={isDisabled || !code.trim()} className="h-12 w-full">
            {state.status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              "Redeem"
            )}
          </Button>

          <Button onClick={cancel} className="h-12 w-full">
            Back
          </Button>
        </div>

        {state.status === "success" && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-left dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">{state.message}</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-left dark:border-red-800 dark:bg-red-950">
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-800 dark:text-red-200">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
