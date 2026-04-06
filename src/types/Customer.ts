export default interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string;
  created_at: string;
  updated_at: string;
}
