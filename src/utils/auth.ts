import { v4 as uuidv4 } from 'uuid';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';

const USERS_KEY = 'users';

export function registerUser(credentials: RegisterCredentials): User {
  const users = getUsers();
  
  // Check for existing username
  if (users.some(user => user.username === credentials.identifier)) {
    throw new Error('Username already exists');
  }

  // Validate college name for university role
  if (credentials.role === 'university' && !credentials.collegeName) {
    throw new Error('College name is required for university registration');
  }

  const newUser: User = {
    id: uuidv4(),
    username: credentials.identifier,
    role: credentials.role,
    collegeName: credentials.collegeName,
    rollNumber: credentials.rollNumber,
    email: credentials.role === 'student' ? 
      `${credentials.identifier}@student.edu` : 
      undefined
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return newUser;
}

export function loginUser(credentials: LoginCredentials): User {
  const users = getUsers();
  const user = users.find(u => 
    u.username === credentials.identifier && 
    u.role === credentials.role
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(user => user.id === id);
}