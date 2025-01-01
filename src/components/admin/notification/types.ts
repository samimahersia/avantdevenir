export interface Message {
  id: string;
  content: string;
  admin_response: string | null;
  created_at: string;
  client_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
  };
}