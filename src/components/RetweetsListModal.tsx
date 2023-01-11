import React,{ useRef } from 'react'
import { IoMdClose } from 'react-icons/io';
import { v4 } from 'uuid';
import useOnClickOutside from '../../hooks/useOutsideClick';
import { useRetweetsModal, useUserRetweets } from '../../lib/zustand';
import Backdrop from './Backdrop'
import PeopleComponent from './PeopleComponent';

const RetweetsListModal = () => {
    const { setModal } = useRetweetsModal();
    const { retweets } = useUserRetweets();
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, () => {
      setModal(false);
    });
    console.log(typeof retweets)
  return (
    <Backdrop>
    <div
      ref={modalRef}
      className="mx-auto h-[500px] w-3/4 space-y-3 overflow-y-scroll rounded-2xl  p-4 bg-base-100 sm:w-1/2"
    >
      <div className="flex items-center gap-x-8 font-semibold text-xl">
        <IoMdClose className="text-xl cursor-pointer" onClick={() => setModal(false)} />
        <p>Retweeted by</p>
      </div>
      <div>
          {retweets?.map((retweet)=>(
              <PeopleComponent key={v4()} user={retweet.user} />
          ))}
      </div>
    </div>
  </Backdrop>
  )
}

export default RetweetsListModal