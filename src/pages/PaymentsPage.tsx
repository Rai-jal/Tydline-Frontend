import { useState } from "react";
import { apiPost } from "../api/client";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

type Step = "initiate" | "confirm" | "done";

const PLANS = ["basic", "pro", "enterprise"];

function PaymentsPage() {
  const [step, setStep] = useState<Step>("initiate");

  // Initiate
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState(PLANS[0]);
  const [coupon, setCoupon] = useState("");
  const [initiating, setInitiating] = useState(false);
  const [initiateError, setInitiateError] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Confirm
  const [otp, setOtp] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleInitiate() {
    setInitiateError(null);
    setInitiating(true);
    try {
      const res = await apiPost("/api/v1/payments/initiate", { phone, plan });
      if (res.ok) {
        setStep("confirm");
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setInitiateError(data?.detail ?? "Failed to initiate payment.");
      }
    } catch {
      setInitiateError("Network error.");
    } finally {
      setInitiating(false);
    }
  }

  async function handleConfirm() {
    setConfirmError(null);
    setConfirming(true);
    try {
      const res = await apiPost("/api/v1/payments/confirm", { otp_code: otp });
      if (res.ok) {
        setStep("done");
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setConfirmError(data?.detail ?? "Invalid OTP. Please try again.");
      }
    } catch {
      setConfirmError("Network error.");
    } finally {
      setConfirming(false);
    }
  }

  async function handleApplyCoupon() {
    setCouponMsg(null);
    setApplyingCoupon(true);
    try {
      const res = await apiPost("/api/v1/payments/apply-coupon", {
        code: coupon,
      });
      if (res.ok) {
        setCouponMsg("Coupon applied!");
        setCoupon("");
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setCouponMsg(data?.detail ?? "Invalid coupon code.");
      }
    } catch {
      setCouponMsg("Network error.");
    } finally {
      setApplyingCoupon(false);
    }
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <h1 className="text-2xl font-medium text-[#052698]">
          Payment confirmed
        </h1>
        <p className="text-[#545454] text-sm">
          Your subscription is now active.
        </p>
        <a href="/dashboard" className="text-[#052698] underline text-sm">
          Go to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-4 py-8">
      <div className="max-w-sm mx-auto flex flex-col gap-8">
        <h1 className="text-2xl font-medium text-[#052698]">Payment</h1>

        {step === "initiate" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#545454] uppercase tracking-wide">
                Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="border-[#052698] border-[0.45px] px-4 py-2 text-[#545454] bg-white h-11 text-sm"
              >
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#545454] uppercase tracking-wide">
                MoMo number
              </label>
              <InputField
                className="w-full h-11"
                placeholder="+233xxxxxxxxx"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setInitiateError(null);
                }}
                disabled={initiating}
              />
            </div>

            <div className="flex gap-2">
              <InputField
                className="flex-1 h-10 text-sm"
                placeholder="Coupon code (optional)"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponMsg(null);
                }}
              />
              <Button
                className="h-10 px-3 text-sm"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon || !coupon.trim()}
              >
                {applyingCoupon ? "…" : "Apply"}
              </Button>
            </div>
            {couponMsg && (
              <p
                className={`text-sm ${couponMsg === "Coupon applied!" ? "text-green-600" : "text-red-500"}`}
              >
                {couponMsg}
              </p>
            )}

            {initiateError && (
              <p className="text-sm text-red-500">{initiateError}</p>
            )}

            <Button
              className="w-full h-11"
              onClick={handleInitiate}
              disabled={initiating || !phone.trim()}
            >
              {initiating ? "Processing…" : "Pay with MoMo"}
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#545454]">
              Enter the OTP sent to <strong>{phone}</strong> to confirm your
              payment.
            </p>
            <InputField
              className="w-full h-11"
              placeholder="OTP code"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setConfirmError(null);
              }}
              disabled={confirming}
            />
            {confirmError && (
              <p className="text-sm text-red-500">{confirmError}</p>
            )}
            <Button
              className="w-full h-11"
              onClick={handleConfirm}
              disabled={confirming || !otp.trim()}
            >
              {confirming ? "Confirming…" : "Confirm payment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;
