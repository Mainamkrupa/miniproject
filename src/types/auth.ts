export type UserRole = 'university' | 'student' | 'verifier';

export interface User {
  id: string;
  username: string;
  email?: string;
  rollNumber?: string;
  role: UserRole;
  collegeName?: string;
  universityId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  identifier: string; // email for students, username for others
  password: string;
  role: UserRole;
}

export interface RegisterCredentials extends LoginCredentials {
  rollNumber?: string;
  collegeName?: string;
}