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
    <div className="w-[400px] mx-auto mt-40 lg:mt-80">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#701a75",
                brandAccent: "#a21caf",
              },
            },
          },
        }}
        view="sign_in"
        providers={[]}
        showLinks={true}
        redirectTo={
          process.env.NODE_ENV == "development"
            ? "http://localhost:3000"
            : "https://rue-mvp.fly.dev/"
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
