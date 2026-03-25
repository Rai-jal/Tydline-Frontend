import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api/client";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

function OnboardingPage() {
  // Tracking email
  const [prefix, setPrefix] = useState("");
  const [prefixAvailable, setPrefixAvailable] = useState<boolean | null>(null);
  const [checkingPrefix, setCheckingPrefix] = useState(false);
  const [settingEmail, setSettingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // WhatsApp
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [newPhone, setNewPhone] = useState("");
  const [settingPhone, setSettingPhone] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    apiGet("/api/v1/onboarding/whatsapp-phone")
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json() as { phone?: string };
          setCurrentPhone(data?.phone ?? null);
        }
      })
      .catch(() => {});
  }, []);

  async function checkPrefix() {
    if (!prefix.trim()) return;
    setCheckingPrefix(true);
    setPrefixAvailable(null);
    try {
      const res = await apiGet(
        `/api/v1/onboarding/tracking-email/check?prefix=${encodeURIComponent(prefix)}`
      );
      if (res.ok) {
        const data = await res.json() as { available?: boolean };
        setPrefixAvailable(data?.available ?? false);
      }
    } catch {
      // ignore
    } finally {
      setCheckingPrefix(false);
    }
  }

  async function setTrackingEmail() {
    setEmailError(null);
    setEmailSuccess(false);
    setSettingEmail(true);
    try {
      const res = await apiPost("/api/v1/onboarding/tracking-email", {
        tracking_email: prefix,
      });
      if (res.ok) {
        setEmailSuccess(true);
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setEmailError(data?.detail ?? "Failed to set tracking email.");
      }
    } catch {
      setEmailError("Network error.");
    } finally {
      setSettingEmail(false);
    }
  }

  async function addPhone() {
    setPhoneError(null);
    setPhoneSuccess(false);
    setSettingPhone(true);
    try {
      const res = await apiPost("/api/v1/onboarding/whatsapp-phone", {
        phone: newPhone,
      });
      if (res.ok) {
        setCurrentPhone(newPhone);
        setNewPhone("");
        setPhoneSuccess(true);
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setPhoneError(data?.detail ?? "Failed to add phone.");
      }
    } catch {
      setPhoneError("Network error.");
    } finally {
      setSettingPhone(false);
    }
  }

  async function removePhone(phone: string) {
    try {
      const res = await apiDelete(
        `/api/v1/onboarding/whatsapp-phone/${encodeURIComponent(phone)}`
      );
      if (res.ok) setCurrentPhone(null);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-4 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-10">
        <h1 className="text-2xl font-medium text-[#052698]">Onboarding</h1>

        {/* Tracking email */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-[#052698] uppercase tracking-wide">
            Tracking email
          </h2>
          <p className="text-sm text-[#545454]">
            Set a prefix for your Tydline tracking email address.
          </p>
          <div className="flex gap-2">
            <InputField
              className="flex-1 h-11"
              placeholder="your-prefix"
              value={prefix}
              onChange={(e) => {
                setPrefix(e.target.value);
                setPrefixAvailable(null);
                setEmailSuccess(false);
                setEmailError(null);
              }}
            />
            <Button
              className="h-11 px-4"
              onClick={checkPrefix}
              disabled={checkingPrefix || !prefix.trim()}
            >
              {checkingPrefix ? "Checking…" : "Check"}
            </Button>
          </div>
          {prefixAvailable === true && !emailSuccess && (
            <>
              <p className="text-sm text-green-600">Available!</p>
              <Button
                className="h-11 w-full"
                onClick={setTrackingEmail}
                disabled={settingEmail}
              >
                {settingEmail ? "Setting…" : "Set tracking email"}
              </Button>
            </>
          )}
          {prefixAvailable === false && (
            <p className="text-sm text-red-500">
              Not available. Try a different prefix.
            </p>
          )}
          {emailSuccess && (
            <p className="text-sm text-green-600">
              Tracking email set successfully.
            </p>
          )}
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </section>

        {/* WhatsApp phone */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-[#052698] uppercase tracking-wide">
            WhatsApp notifications
          </h2>
          {currentPhone ? (
            <div className="flex items-center justify-between border-[0.45px] border-[#052698]/30 px-4 py-3">
              <span className="text-sm text-[#052698]">{currentPhone}</span>
              <button
                onClick={() => removePhone(currentPhone)}
                className="text-xs text-red-500 underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <InputField
                  className="flex-1 h-11"
                  placeholder="+233xxxxxxxxx"
                  value={newPhone}
                  onChange={(e) => {
                    setNewPhone(e.target.value);
                    setPhoneSuccess(false);
                    setPhoneError(null);
                  }}
                />
                <Button
                  className="h-11 px-4"
                  onClick={addPhone}
                  disabled={settingPhone || !newPhone.trim()}
                >
                  {settingPhone ? "Adding…" : "Add"}
                </Button>
              </div>
              {phoneSuccess && (
                <p className="text-sm text-green-600">
                  Phone added successfully.
                </p>
              )}
              {phoneError && (
                <p className="text-sm text-red-500">{phoneError}</p>
              )}
            </>
          )}
        </section>

        <a href="/dashboard" className="text-sm text-[#052698] underline">
          Go to dashboard
        </a>
      </div>
    </div>
  );
}

export default OnboardingPage;
