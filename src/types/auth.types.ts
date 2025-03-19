export interface User {
    id: string;
    username: string;
    nama: string;
    email: string;
    role: 'admin' | 'dosen' | 'mahasiswa';
    avatar?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }