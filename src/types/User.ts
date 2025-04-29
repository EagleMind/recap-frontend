export interface User {
  id: string; // From JWT
  _id?: string; // From API (optional for compatibility)
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
}
