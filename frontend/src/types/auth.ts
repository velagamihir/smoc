export type UserRole = "manager" | "client";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ManagerClient {
  id: string;
  manager_id: string;
  client_id: string;
  brand_id: string;
  client_profile: Profile;
  brand: { id: string; name: string; slug: string };
}
