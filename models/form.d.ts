import { productTypings } from "./product";

export interface productFormTypings {
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;

  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductAvailable: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpen: (isOpen: boolean) => void;
  initialValues: productTypings;
  imageExist?: boolean;
  imageUrl?: string;
  submiting: boolean;
  imagePreview?: boolean;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
