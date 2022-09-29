export interface productTypings {
  id?: string;
  adminId?: string;
  name: string;
  price: string;
  description?: string;
  status?: boolean;
  type: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  currency?: string;
}

export type fetchProductTypings = {
  message: string;
  products: productTypings[];
};
export interface singleProductTypings {
  message: string;
  product: productTypings;
}

export interface productColumns {
  name: string;
  price: string;
  type: string;
  onsales: string;
}

export interface productIds {
  ids?: string;
  status?: string;
}

interface changeProductStatusTypings {
  ids: productIdTypings[];
  status: status[];
}

interface tableProduct {
  id: string;
  original: {
    id: string;
    status: string;
  };
}

interface selectedTypings {
  [x: string]: any;
  // array of selected rows
  selectedRows: tableProduct[];
}

export interface productIdTypings {
  productId: string;
}

export interface productsDepartmentsTypes{
    id?:string,
    name:string,
    createdAt?:Date
}

export interface productsDepartmentsTypesData {
  departments:Array<productsDepartmentsTypes>,
  message:string
}