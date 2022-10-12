export interface productTypings {
  productId?: string;
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

export interface ProductCardTypes {
  item: productTypings;
}

export type fetchProductTypings = {
  counts: number;
  message: string;
  product: Array<productTyping>;
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

export interface productsDepartmentsTypes {
  id?: string;
  name: string;
  createdAt?: Date;
}

export interface productsDepartmentsTypesData {
  departments: Array<productsDepartmentsTypes>;
  message: string;
}

export interface ProductTableColumns {
  Header?: string;
  accessor?: string;
  Filter?: unknown | boolean;
  filter?: string;
  Cell?: (props: selectedTypings) => void;
}
