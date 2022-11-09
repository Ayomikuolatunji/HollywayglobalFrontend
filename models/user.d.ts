export interface userData {
  _id: string;
  first_name: Ayomiku;
  email: string;
  last_name: John;
  createdAt: Date;
  updatedAt: Date;
}

export interface fetchedUserDetails {
  message: string;
  data: userData;
}
