import { useSession } from 'next-auth/react';
import React from 'react';
import { useMobileDrawer } from '../../lib/zustand';
import Avatar from './Avatar';

const MobileDrawerToggle = () => {
    const { data:session } = useSession();
    const { setDrawer } = useMobileDrawer();
  return (
    <button onClick={()=>setDrawer(true)} >
        <Avatar image={session?.user?.image as string} width={30} height={30} />
    </button>
  );
};

export default MobileDrawerToggle;
