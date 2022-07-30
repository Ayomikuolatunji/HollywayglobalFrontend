import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { modalConditions } from '../../../../models/modal'

 const  AddProductModal=({isOpen,setIsOpen}:modalConditions)=>{

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}
      className="w-full h-[100vh] absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-[rgba(0,0,0,0.2)] z-50"
    >
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => setIsOpen(false)}>Deactivate</button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  )
}


export default AddProductModal