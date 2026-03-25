import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiGet } from "../api/client";

function AuthVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    apiGet(`/api/v1/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.ok) {
          navigate("/dashboard", { replace: true });
        } else {
          setError("Link expired or already used. Please request a new one.");
        }
      })
      .catch(() => setError("Network error. Please check your connection."));
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-red-500 text-sm">{error}</p>
        <a href="/login" className="text-[#052698] underline text-sm">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[#545454] text-sm">Verifying…</p>
    </div>
  );
}

export default AuthVerifyPage;
