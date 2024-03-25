import { Link, useOutletContext } from "@remix-run/react";
import { Auth } from "@supabase/auth-ui-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Ottawa Confessions | Login" },
    { name: "Ottawa Confessions Login Page", content: "Welcome to Remix!" },
  ];
};

export default function Login() {
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();

  return (
    <div className="w-[350px] mx-auto mt-40 lg:mt-80">
      <p className="text-zinc-900 text-pretty text-2xl mt-2 w-full">
        Log in with your uOttawa or Carleton email
      </p>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#b91c1c",
                brandAccent: "#b91c1c",
              },
            },
          },
        }}
        view="sign_in"
        providers={[]}
        showLinks={true}
        redirectTo={
          process.env.NODE_ENV == "development" ? "http://localhost:3000/" : "wwww.ottawaconfessions.com/"
        }
      />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By logging in, you agree to our{" "}
        <Link
          to="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
