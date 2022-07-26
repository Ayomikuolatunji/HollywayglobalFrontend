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
}
