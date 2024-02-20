import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { fetchThread } from "~/api/threads.server";

import { ThreadCard } from "~/components/thread-view";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const thread = await fetchThread(request, params.thread!);

  return json({ thread });
};

export default function Post() {
  const { user } = useOutletContext<{
    user:
      | {
          id: string;
          username: string;
          city: string | null;
          school: string | null;
        }
      | null
      | undefined;
  }>();

  const { thread } = useLoaderData<typeof loader>();

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full py-14 mx-auto">
        {thread && thread?.thread ? (
          <ThreadCard
            thread={{ thread: thread.thread, isLiked: thread.isLiked }}
            user={user}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="lg:w-3/4 mx-auto">
        {
            thread?.childThreads?.childThreads.map((childThreads) => childThreads.map(childThread => <ThreadCard key={childThread.thread.id} thread={{thread: childThread.thread, isLiked: childThread.isLiked}} user={user}/>) )
        }
      </div>
    </div>
  );
}
