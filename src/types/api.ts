export interface ShipmentRead {
  id: string;
  container_number: string | null;
  bill_of_lading: string | null;
  carrier: string | null;
  status: string;
  eta: string | null;
  predicted_eta: string | null;
  demurrage_risk: string | null;
  free_days_remaining: number | null;
  last_updated: string;
  user_id: string;
  created_at: string;
}

export interface DashboardShipmentsResponse {
  pending_approval: ShipmentRead[];
  active: ShipmentRead[];
  completed: ShipmentRead[];
  total_pending_approval: number;
  total_active: number;
  total_completed: number;
}
