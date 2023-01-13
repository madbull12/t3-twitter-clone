import { useEffect, useState } from "react";

const useScrollPosition = () => {
    const [scrollPosition,setScrollPosition] = useState(0);

    const handleScroll = () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const scrolled = (windowScroll / height) * 100;
        setScrollPosition(scrolled)
    }

    useEffect(()=>{
        window.addEventListener("scroll",handleScroll,{ passive:true });
        return () => {
            window.removeEventListener("scroll",handleScroll);
        }
    },[]);

    return scrollPosition;
}

export default useScrollPosition;