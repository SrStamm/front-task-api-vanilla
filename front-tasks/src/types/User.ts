export interface ReadUser {
  user_id: number;
  username: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  username?: string;
  email?: string;
  password?: string;
}
