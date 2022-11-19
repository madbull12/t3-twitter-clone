import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import TimeAgo from 'javascript-time-ago'
import { trpc } from "../utils/trpc";
import en from 'javascript-time-ago/locale/en.json'
import "../styles/globals.css";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

TimeAgo.addDefaultLocale(en)
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  
  return (
    <SessionProvider session={session}>
      <Layout>
        <Toaster />
        
        <Component {...pageProps} />


      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
