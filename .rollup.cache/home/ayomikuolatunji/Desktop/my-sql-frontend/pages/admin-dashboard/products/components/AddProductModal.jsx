import { Dialog } from '@headlessui/react';
var AddProductModal = function (_a) {
    var isOpen = _a.isOpen, setIsOpen = _a.setIsOpen;
    return (<Dialog open={isOpen} onClose={function () { return setIsOpen(false); }}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={function () { return setIsOpen(false); }}>Deactivate</button>
        <button onClick={function () { return setIsOpen(false); }}>Cancel</button>
      </Dialog.Panel>
    </Dialog>);
};
export default AddProductModal;
//# sourceMappingURL=AddProductModal.jsx.map