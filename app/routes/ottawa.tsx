import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { verifyLike } from "~/api/server";
import { fetchParentThreads } from "~/api/threads.server";
import { ThreadFeed } from "~/components/thread-feed";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const post = parseInt(formData.post as string);
  const user = formData.user as string;

  return verifyLike(post, user);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  const threads = await fetchParentThreads(request, Number(page), "Ottawa", "");
  return json({ threads });
};

export default function Index() {
  const { threads } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof loader>();

  const { user } = useOutletContext<{
    user: {
      id: string;
      username: string;
      city: string | null;
      school: string | null;
    } | null;
  }>();

  return (
    <form className="w-full" method="post">
      <ThreadFeed fetcher={fetcher} threads={threads} user={user} />
    </form>
  );
}
