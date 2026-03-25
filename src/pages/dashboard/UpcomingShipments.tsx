import { useEffect, useState } from "react";
import { apiGet } from "../../api/client";
import type { ShipmentRead } from "../../types/api";

const statusStyles: Record<string, string> = {
  active: "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
  pending_approval: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
};

function UpcomingShipments() {
  const [shipments, setShipments] = useState<ShipmentRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet("/api/v1/dashboard/shipments/active")
      .then(async (res) => {
        if (res.ok) {
          setShipments((await res.json()) as ShipmentRead[]);
        } else if (res.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load shipments.");
        }
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.container_number?.toLowerCase().includes(q) ||
      s.bill_of_lading?.toLowerCase().includes(q) ||
      s.carrier?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-xl font-heading font-bold tracking-tight">
            Upcoming Shipments
          </h2>
          <p className="text-[#545454]/70 text-sm mt-0.5">
            {loading ? "Loading…" : `${shipments.length} active container${shipments.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 border border-[#052698]/25 flex items-center px-3 gap-2 bg-[#FFF9F5]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#052698"
            strokeWidth="2"
            opacity="0.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Search by container, BL or carrier…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-2.5 text-xs text-[#545454] bg-transparent placeholder-[#545454]/40"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && filtered.length === 0 && !error && (
        <p className="text-sm text-[#545454]">No active shipments.</p>
      )}

      {/* Shipment cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-[#FFF9F5] border border-[#052698]/20 p-4 md:p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left: IDs */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#052698] font-medium text-sm">
                    {s.container_number ?? "—"}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 ${statusStyles[s.status] ?? "bg-[#052698]/8 text-[#052698] border border-[#052698]/20"}`}
                  >
                    {s.status.replace(/_/g, " ")}
                  </span>
                </div>
                {s.bill_of_lading && (
                  <p className="text-[#545454] text-xs mt-1">
                    BL: {s.bill_of_lading}
                  </p>
                )}
                {s.carrier && (
                  <p className="text-[#545454]/60 text-xs mt-0.5">{s.carrier}</p>
                )}
              </div>

              {/* Right: ETA & risk */}
              <div className="text-right shrink-0">
                {s.eta && (
                  <p className="text-[#052698] font-heading font-medium text-sm">
                    ETA: {new Date(s.eta).toLocaleDateString()}
                  </p>
                )}
                {s.free_days_remaining !== null && (
                  <p className="text-[#545454]/60 text-xs mt-0.5">
                    {s.free_days_remaining} free days remaining
                  </p>
                )}
                {s.demurrage_risk && (
                  <p className="text-xs mt-0.5 text-amber-600">
                    Risk: {s.demurrage_risk}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingShipments;
