import { Link } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
//import instagram_white_logo from "public/Instagram_Glyph_White.png"
import instagram_black_logo from "public/Instagram_Glyph_Black.png";

export function DesktopNav(props: {
  supabase: SupabaseClient<Database>;
  user:
    | {
        id: string;
        username: string;
        city: string | null;
        school: string | null;
      }
    | null
    | undefined;
}) {
  const { supabase, user } = props;

  return (
    <div className="hidden h-full lg:flex lg:flex-wrap lg:w-[341px] xl:w-[426px] 2xl:w-[512px] mt-5">
      <div className="fixed h-full" style={{ maxWidth: "inherit" }}>
        <div className="mx-auto mt-40 w-[300px]">
          <Link to={"/"} className="h-5">
            <p className="text-2xl text-primary font-bold">Ottawa</p>
            <p className="text-2xl text-primary font-bold">Confessions</p>
            <p className="text-lg text-primary text-pretty">
              Anonymous confessions for students in Ottawa.
            </p>
          </Link>
          {false && (
            <div>
              <p className="text-zinc-500 text-pretty mt-2">
                1. We only use your uOttawa or Carleton email to verify that you
                are a student.
              </p>
              <p className="text-zinc-500 text-pretty mt-2">
                2. Changing your username doesn&apos;t update the username of
                your posts.
              </p>
              <p className="text-zinc-500 text-pretty mt-2">
                3. However we can still ban you.
              </p>
            </div>
          )}
          <Link
            to={"https://www.instagram.com/ottawa___confessions/"}
            className="p-4 w-1"
          >
            <img src={instagram_black_logo} alt="insta" className="w-8"></img>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mt-40">
          {user ? (
            <button
              className="btn btn-lg btn-primary p-6 mx-auto float-end"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </button>
          ) : (
            <Link to={"/login"} className="mx-auto float-end">
              <button className="btn btn-lg btn-primary p-6">Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
