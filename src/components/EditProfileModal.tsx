import React from 'react'
import { IoMdClose } from 'react-icons/io'
import useOnClickOutside from '../../hooks/useOutsideClick'
import Backdrop from './Backdrop'
import { useRef } from 'react'
import { useEditProfileModal } from '../../lib/zustand'

const EditProfileModal = () => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { setModal } = useEditProfileModal();
    useOnClickOutside(modalRef,()=>{
        setModal(false)
    })
  return (
    <Backdrop>
        <div ref={modalRef}>
            <header className='flex p-4 items-center justify-between'>
                <IoMdClose />
            </header> 
        </div>
  
    </Backdrop>
  )
}

export default EditProfileModal