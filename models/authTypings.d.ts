export interface loginCredentails {
  email: string;
  password: string;
}

export interface Error {
  data: {
    data: any;
    message: string;
  };
}

export interface loginData {
  token: string;
  message: string;
  adminId: string;
}

export interface userLoginData {
  message: string;
  token: string;
  userId: string;
}

export interface signupTypings {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface adminSignupTypings {
  username: string;
  email: string;
  password: string;
}

export interface adminIdTypings {
  adminId: string;
}
