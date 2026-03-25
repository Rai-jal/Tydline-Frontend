import { useState } from "react";
import type { FormEvent } from "react";
import { apiPost } from "../api/client";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost("/api/v1/auth/request-link", {
        email,
        company_name: companyName,
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({})) as { detail?: string };
        setError(data?.detail ?? "Failed to send magic link. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <h1 className="text-2xl font-medium text-[#052698]">Check your email</h1>
        <p className="text-[#545454] text-center max-w-sm text-sm">
          We sent a magic link to <strong>{email}</strong>. Click the link to
          sign in — it expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <h1 className="text-2xl font-medium text-[#052698]">Sign in to Tydline</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <InputField
          placeholder="Company name"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            setError(null);
          }}
          disabled={loading}
          className="w-full h-11"
        />
        <InputField
          placeholder="Work email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          disabled={loading}
          className="w-full h-11"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          type="submit"
          disabled={loading || !email.trim() || !companyName.trim()}
          className="w-full h-11"
        >
          {loading ? "Sending…" : "Send magic link"}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
