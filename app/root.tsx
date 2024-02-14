import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { SiteHeader } from "./components/site-header";
import { MainNav } from "./components/main-nav";
import { AnonServerClient, ServiceServerClient } from "./api/server";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { MobileNav } from "./components/mobile-nav";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const { supabase, response } = AnonServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const service = ServiceServerClient();

    const { data: userData } = await service
      .from("users")
      .select("id, username, city, school")
      .eq("id", session?.user.id);

    return json(
      {
        env,
        session,
        userData,
      },
      {
        headers: response.headers,
      }
    );
  }
  return json(
    {
      env,
      session,
      userData: [],
    },
    {
      headers: response.headers,
    }
  );
};

export default function App() {
  const { env, session, userData } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;
  console.log(session)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== "INITIAL_SESSION" &&
        session?.access_token !== serverAccessToken
      ) {
        // server and client are out of sync.
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  const user = userData?.at(0);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex">
        <main className="mx-auto container flex">
          <MainNav user={user} />
          <div className="w-full border-x border-x-zinc-100">
            <SiteHeader user={user} />
            <Outlet context={{ supabase, user }} />
            <MobileNav user={user} />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
