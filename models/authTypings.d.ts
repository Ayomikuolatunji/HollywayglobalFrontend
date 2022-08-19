export interface loginCredentails {
  email: string;
  password: string;
}

export interface Error {
  data: {
    message: string;
  };
}

export interface loginData {
  token: string;
  message: string;
  adminId: string;
  userId: string;
}

export interface signupTypings {
  username: string;
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
  adminId:string
}
