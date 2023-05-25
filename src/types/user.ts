export interface User {
  username: string;
  email: string;
  passwordHash: string;
  refreshTokens: Array<{ token: string; invalid: boolean; }>;
}