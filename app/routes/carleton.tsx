import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { fetchPosts, verifyLike } from "~/api/server";
import { PostFeed } from "~/components/feed";


export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  const post = parseInt(formData.post as string);
  const user = formData.user as string;

  return verifyLike(post, user);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  const posts = await fetchPosts(request, Number(page), "", "Carleton");

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
    <Form className="w-full" method="post">
      <PostFeed fetcher={fetcher} posts={posts} user={user} />
    </Form>
  );
}
