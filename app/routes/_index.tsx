import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { fetchPosts, verifyLike } from "~/api/server";
import { PostFeed } from "~/components/feed";

export const meta: MetaFunction = () => {
  return [
    { title: "Ottawa Confessions" },
    {
      name: "Ottawa's private student community",
      content: "Ottawa's private student community",
    },
  ];
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const post = parseInt(formData.post as string);
  const user = formData.user as string;

  return verifyLike(post, user);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  const posts = await fetchPosts(request, Number(page), "Ottawa", "");

  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
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
      <PostFeed fetcher={fetcher} posts={posts} user={user} />
    </form>
  );
}
