import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import TimeAgo from 'javascript-time-ago'
import { trpc } from "../utils/trpc";
import en from 'javascript-time-ago/locale/en.json'
import "../styles/globals.css";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";

TimeAgo.addDefaultLocale(en)
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
