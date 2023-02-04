export interface productTypings {
  _id?: string;
  adminId?: string;
  name: string;
  price: string;
  description?: string;
  status?: boolean;
  type: string;
  image?: string;
  item_in_cart?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  currency?: string;
}

export interface ProductCardTypes {
  item: productTypings;
  addToCartItemFunc?: (id: string) => void;
}

interface DetailItemProps {
  product: productTypings;
}

export type fetchProductTypings = {
  counts: number;
  message: string;
  products: Array<productTyping>;
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
export interface cartItemTypes {
  _id: string;
  productId: productTypings;
  userId: string;
  productCount: number;
  totalAmount: number;
  createdAt: date;
  updatedAt: date;
}
export interface productsCarts {
  message: string;
  cartItems: Array<cartItemTypes>;
  totalAmounts: number;
}
export interface RelatedProductsProps {
  currentProductId: string;
  relatedProducts: {
    products: productTypings[];
  };
  isRelatedProductsLoading: boolean;
  isRelatedProductFetching: boolean;
}
