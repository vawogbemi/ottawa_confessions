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
  redirect,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { MainNav } from "./components/main-nav";
import { AnonServerClient, ServiceServerClient } from "./api/server";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { MobileNav } from "./components/mobile-nav";
import { DesktopNav } from "./components/desktop-nav";

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

  const url = new URL(request.url)

  if (!["/", "/login"].includes(url.pathname)){
    return redirect("/login")
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
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen">
        <main className="mx-auto h-full container flex">
          <DesktopNav user={user} supabase={supabase} />
          <div className="w-full h-full flex flex-wrap sm:max-w-[640px] md:max-w-[768px] lg:max-w-[683px] xl:max-w-[853px] 2xl:max-w-[1024px]">
            <MainNav user={user}/>
            <MobileNav />
            <Outlet context={{ supabase, user }} />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
