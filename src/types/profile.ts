export interface ElevateProfile {
  phone: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  responses: Record<string, string>;
}
