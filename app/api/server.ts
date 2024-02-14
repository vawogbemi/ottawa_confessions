import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export function AnonServerClient(request: Request) {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  return { supabase, response };
}

export function ServiceServerClient() {

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  return supabase;
}
