export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
}
