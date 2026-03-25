import { useEffect, useState } from "react";
import { apiGet } from "../../api/client";
import type { DashboardShipmentsResponse, ShipmentRead } from "../../types/api";

type StatCardProps = {
  label: string;
  value: string | number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-[#FFF9F5] border border-[#052698]/20 p-5 flex flex-col gap-2">
      <span className="text-xs text-[#545454]/60 uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-heading font-bold text-[#052698]">{value}</span>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  active: "bg-[#052698]/8 text-[#052698] border border-[#052698]/20",
  pending_approval: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
};

function ShipmentTableRow({ s }: { s: ShipmentRead }) {
  return (
    <tr className="hover:bg-[#052698]/3 transition-colors">
      <td className="px-5 py-3.5 text-[#052698] font-medium text-xs">
        {s.container_number ?? "—"}
      </td>
      <td className="px-5 py-3.5 text-[#545454] text-xs">{s.bill_of_lading ?? "—"}</td>
      <td className="px-5 py-3.5 text-[#545454]/70 text-xs hidden md:table-cell">
        {s.carrier ?? "—"}
      </td>
      <td className="px-5 py-3.5 text-[#545454] text-xs">
        {s.eta ? new Date(s.eta).toLocaleDateString() : "—"}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`text-[10px] px-2 py-1 ${statusStyles[s.status] ?? "bg-[#052698]/8 text-[#052698] border border-[#052698]/20"}`}
        >
          {s.status.replace(/_/g, " ")}
        </span>
      </td>
    </tr>
  );
}

function Reports() {
  const [data, setData] = useState<DashboardShipmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet("/api/v1/dashboard/shipments")
      .then(async (res) => {
        if (res.ok) {
          setData((await res.json()) as DashboardShipmentsResponse);
        } else if (res.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load report data.");
        }
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, []);

  const total =
    data
      ? data.total_active + data.total_completed + data.total_pending_approval
      : 0;

  const recentShipments: ShipmentRead[] = data
    ? [...data.active, ...data.pending_approval].slice(0, 5)
    : [];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-xl font-heading font-bold tracking-tight">
            Reports
          </h2>
          <p className="text-[#545454]/70 text-sm mt-0.5">Shipment overview</p>
        </div>
      </div>

      {loading && <p className="text-sm text-[#545454]">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Shipments" value={total} />
            <StatCard label="Active" value={data.total_active} />
            <StatCard label="Completed" value={data.total_completed} />
            <StatCard label="Pending Approval" value={data.total_pending_approval} />
          </div>

          {/* Recent activity */}
          {recentShipments.length > 0 && (
            <div className="bg-[#FFF9F5] border border-[#052698]/20">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#052698]/10">
                <h3 className="text-[#052698] font-heading font-medium text-sm">
                  Recent Activity
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#052698]/10">
                      <th className="text-left px-5 py-3 text-xs text-[#545454]/50 font-body font-normal uppercase tracking-wider">
                        Container
                      </th>
                      <th className="text-left px-5 py-3 text-xs text-[#545454]/50 font-body font-normal uppercase tracking-wider">
                        Bill of Lading
                      </th>
                      <th className="text-left px-5 py-3 text-xs text-[#545454]/50 font-body font-normal uppercase tracking-wider hidden md:table-cell">
                        Carrier
                      </th>
                      <th className="text-left px-5 py-3 text-xs text-[#545454]/50 font-body font-normal uppercase tracking-wider">
                        ETA
                      </th>
                      <th className="text-left px-5 py-3 text-xs text-[#545454]/50 font-body font-normal uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#052698]/8">
                    {recentShipments.map((s) => (
                      <ShipmentTableRow key={s.id} s={s} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {total === 0 && (
            <p className="text-sm text-[#545454]">No shipments yet.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
