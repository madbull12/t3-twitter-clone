import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import TimeAgo from "javascript-time-ago";
import { trpc } from "../utils/trpc";
import en from "javascript-time-ago/locale/en.json";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { httpBatchLink } from "@trpc/client";
TimeAgo.addDefaultLocale(en);
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const theme = useReadLocalStorage("theme");
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <div data-theme={theme}>
      <SessionProvider session={session}>
        <AuthWrapper>
            <Layout>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: "#1D9BF0",
                    color: "#fff",
                  },
                }}
              />

              <Component {...pageProps} />
            </Layout>
        </AuthWrapper>
      </SessionProvider>
    </div>
  );
};

export default trpc.withTRPC(MyApp);
