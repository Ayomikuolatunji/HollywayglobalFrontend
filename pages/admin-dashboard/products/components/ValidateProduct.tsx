import { toast } from "react-toastify";
import { productTypings } from "../../../../models/product";

const validate = (values: productTypings) => {
  if (!values.name) {
    toast.error("Product name is required", {
      toastId: "emptyFields-toast-product-id",
    });
    return false;
  }
  if (!values.price) {
    toast.error("Price is required", {
      toastId: "emptyFields-toast-product-id",
    });
    return false;
  }
  if (!values.description) {
    toast.error("Description is required", {
      toastId: "emptyFields-toast-product-id",
    });
    return false;
  }
  if (!values.type) {
    toast.error("Type is required", {
      toastId: "emptyFields-toast-product-id",
    });
    return false;
  }
  if (!values.currency) {
    toast.error("Currency is required", {
      toastId: "emptyFields-toast-product-id",
    });
    return false;
  }
  return true;
};

export default validate;
