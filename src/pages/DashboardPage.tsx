import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import TrackingInput from "../components/TrackingInput";
import type { DashboardShipmentsResponse, ShipmentRead } from "../types/api";

function ShipmentRow({ shipment }: { shipment: ShipmentRead }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-[0.45px] border-[#052698]/30 px-4 py-3 gap-1">
      <div>
        <p className="font-medium text-[#052698] text-sm">
          {shipment.container_number ?? "—"}
        </p>
        {shipment.bill_of_lading && (
          <p className="text-xs text-[#545454]">BL: {shipment.bill_of_lading}</p>
        )}
        {shipment.carrier && (
          <p className="text-xs text-[#545454]">{shipment.carrier}</p>
        )}
      </div>
      <div className="text-right">
        <span className="text-xs border border-[#052698]/40 px-2 py-0.5 text-[#052698]">
          {shipment.status.replace(/_/g, " ")}
        </span>
        {shipment.eta && (
          <p className="text-xs text-[#545454] mt-1">
            ETA: {new Date(shipment.eta).toLocaleDateString()}
          </p>
        )}
        {shipment.free_days_remaining !== null && (
          <p className="text-xs text-[#545454]">
            {shipment.free_days_remaining} free days remaining
          </p>
        )}
      </div>
    </div>
  );
}

function ShipmentGroup({
  title,
  shipments,
}: {
  title: string;
  shipments: ShipmentRead[];
}) {
  if (shipments.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-[#052698] uppercase tracking-wide">
        {title} ({shipments.length})
      </h2>
      <div className="flex flex-col gap-1">
        {shipments.map((s) => (
          <ShipmentRow key={s.id} shipment={s} />
        ))}
      </div>
    </section>
  );
}

function DashboardPage() {
  const [data, setData] = useState<DashboardShipmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  function loadShipments() {
    setLoading(true);
    setFetchError(null);
    apiGet("/api/v1/dashboard/shipments")
      .then(async (res) => {
        if (res.ok) {
          setData((await res.json()) as DashboardShipmentsResponse);
        } else if (res.status === 401) {
          window.location.href = "/login";
        } else {
          setFetchError("Failed to load shipments.");
        }
      })
      .catch(() => setFetchError("Network error."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadShipments();
  }, []);

  const isEmpty =
    data &&
    data.pending_approval.length === 0 &&
    data.active.length === 0 &&
    data.completed.length === 0;

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#052698]">Dashboard</h1>
          <a href="/login" className="text-xs text-[#545454] underline">
            Sign out
          </a>
        </div>

        {/* Submit new shipment */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-[#052698] uppercase tracking-wide">
            Track a new shipment
          </h2>
          <TrackingInput onSubmitSuccess={loadShipments} />
        </section>

        {/* Shipment list */}
        <section className="flex flex-col gap-6">
          {loading && (
            <p className="text-sm text-[#545454]">Loading shipments…</p>
          )}
          {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
          {isEmpty && (
            <p className="text-sm text-[#545454]">No shipments yet.</p>
          )}
          {data && !loading && (
            <>
              <ShipmentGroup
                title="Pending Approval"
                shipments={data.pending_approval}
              />
              <ShipmentGroup title="Active" shipments={data.active} />
              <ShipmentGroup title="Completed" shipments={data.completed} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
