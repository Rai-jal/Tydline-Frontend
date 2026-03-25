import { useRef, useState } from "react";
import InputField from "./ui/InputField";
import Button from "./ui/Button";
import { apiPost, apiPostForm } from "../api/client";

const SHIPMENTS_PATH = "/api/v1/dashboard/shipments";

interface FormFields {
  container_number: string;
  bill_of_lading: string;
  carrier: string;
}

interface TrackingInputProps {
  onSubmitSuccess?: () => void;
}

function TrackingInput({ onSubmitSuccess }: TrackingInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState<FormFields>({
    container_number: "",
    bill_of_lading: "",
    carrier: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [ocring, setOcring] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: keyof FormFields, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
    setError(null);
    setSuccess(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // reset so the same file can be re-uploaded if needed
    e.target.value = "";

    setError(null);
    setSuccess(false);
    setOcring(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await apiPostForm(`${SHIPMENTS_PATH}/ocr`, body);

      if (res.status === 200) {
        const data = await res.json();
        setFields({
          container_number: data.container_number ?? "",
          bill_of_lading: data.bill_of_lading ?? "",
          carrier: data.carrier ?? "",
        });
        setExpanded(true);
      } else if (res.status === 415) {
        setError("Unsupported file type. Please upload a PDF, JPG, or PNG.");
      } else if (res.status === 413) {
        setError("File too large. Maximum 10MB.");
      } else if (res.status === 422) {
        setError("Could not read document. Please enter details manually.");
        setExpanded(true);
      } else {
        setError("OCR failed. Please try again or enter details manually.");
        setExpanded(true);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setOcring(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const payload: Partial<FormFields> = {
        container_number: fields.container_number,
      };
      if (fields.bill_of_lading.trim()) payload.bill_of_lading = fields.bill_of_lading;
      if (fields.carrier.trim()) payload.carrier = fields.carrier;

      const res = await apiPost(`${SHIPMENTS_PATH}/submit`, payload);

      if (res.status === 201) {
        setSuccess(true);
        setFields({ container_number: "", bill_of_lading: "", carrier: "" });
        setExpanded(false);
        onSubmitSuccess?.();
      } else if (res.status === 422) {
        const data = await res.json();
        setError(data?.detail ?? "Invalid container number.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  const busy = ocring || submitting;

  return (
    <div className="flex flex-col items-center gap-2 w-[90%] md:w-[55%]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Container number row */}
      <div className="flex items-center gap-2 w-full">
        <InputField
          className="flex-1 h-11 md:h-13 text-sm md:text-base"
          placeholder="Container number (e.g. MSCU1234567)"
          value={fields.container_number}
          onChange={(e) => setField("container_number", e.target.value)}
          disabled={busy}
        />
        <Button
          className="h-10 md:h-12 px-3 text-sm md:text-base whitespace-nowrap"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          {ocring ? "Reading…" : "Upload BoL"}
        </Button>
      </div>

      {/* Expanded fields — shown after OCR or on 422 */}
      {expanded && (
        <>
          <InputField
            className="w-full h-11 md:h-13 text-sm md:text-base"
            placeholder="Bill of Lading (optional)"
            value={fields.bill_of_lading}
            onChange={(e) => setField("bill_of_lading", e.target.value)}
            disabled={busy}
          />
          <InputField
            className="w-full h-11 md:h-13 text-sm md:text-base"
            placeholder="Carrier (optional)"
            value={fields.carrier}
            onChange={(e) => setField("carrier", e.target.value)}
            disabled={busy}
          />
        </>
      )}

      {/* Submit button */}
      <Button
        className="w-full h-10 md:h-12 text-sm md:text-base"
        onClick={handleSubmit}
        disabled={busy || fields.container_number.trim() === ""}
      >
        {submitting ? "Submitting…" : "Get Started"}
      </Button>

      {success && (
        <p className="text-sm text-green-600">
          Shipment submitted — pending approval.
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default TrackingInput;
