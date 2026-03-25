import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import type { ShipmentRead } from "../../types/api";

function Approvals() {
  const [approvals, setApprovals] = useState<ShipmentRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, []);

  function loadApprovals() {
    setLoading(true);
    setError(null);
    apiGet("/api/v1/dashboard/approvals")
      .then(async (res) => {
        if (res.ok) {
          setApprovals((await res.json()) as ShipmentRead[]);
        } else if (res.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load approvals.");
        }
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }

  async function handleApprove(id: string) {
    setApproving(id);
    try {
      const res = await apiPost(`/api/v1/dashboard/approvals/${id}/approve`);
      if (res.ok) {
        setApprovals((prev) => prev.filter((a) => a.id !== id));
      } else {
        setError("Failed to approve shipment.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setApproving(null);
    }
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div>
        <h2 className="text-[#052698] text-xl font-heading font-bold tracking-tight">
          Approvals
        </h2>
        <p className="text-[#545454]/70 text-sm mt-0.5">
          {loading
            ? "Loading…"
            : approvals.length > 0
              ? `${approvals.length} shipment${approvals.length !== 1 ? "s" : ""} awaiting approval`
              : "All shipments reviewed"}
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && approvals.length === 0 && !error && (
        <p className="text-sm text-[#545454]">No pending approvals.</p>
      )}

      {/* Approval items */}
      <div className="flex flex-col gap-3">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFF9F5] border border-[#052698]/20 p-5"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="text-[#052698] font-medium text-sm">
                    {item.container_number ?? "—"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                    Pending Approval
                  </span>
                </div>
                {item.bill_of_lading && (
                  <p className="text-xs text-[#545454]/60 mb-1">
                    BL: {item.bill_of_lading}
                  </p>
                )}
                {item.carrier && (
                  <p className="text-xs text-[#545454]/60">
                    Carrier: {item.carrier}
                  </p>
                )}
                <p className="text-xs text-[#545454]/50 mt-1">
                  Submitted: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(item.id)}
                  disabled={approving === item.id}
                  className="bg-[#052698] text-white text-xs px-4 py-2 hover:bg-[#052698]/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approving === item.id ? "Approving…" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approvals;
