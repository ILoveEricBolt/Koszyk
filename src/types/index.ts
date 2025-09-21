export interface User {
  id: string;
  email: string;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  folder_id?: string;
  name: string;
  purchase_link?: string;
  image_url?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}