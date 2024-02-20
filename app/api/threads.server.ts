import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import _ from "lodash";
import { AnonServerClient, ServiceServerClient } from "./server";
export const PARENT_THREAD_COUNT = 15;
export const CHILD_THREAD_COUNT = 15;
export async function fetchParentThreadsWithNoQuery(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string
) {
  const { data: topParentThreads, error: topParentThreadsError } =
    await supabase
      .from("threads")
      .select()
      .eq("feed", feed)
      .is("parent1", null)
      .is("parent2", null)
      .order("likes", { ascending: false })
      .gt(
        "created_at",
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      )
      .range((page - 1) * PARENT_THREAD_COUNT, page * PARENT_THREAD_COUNT - 1);

  const { data: recentParentThreads, error: recentParentThreadsError } =
    await supabase
      .from("threads")
      .select()
      .eq("feed", feed)
      .is("parent1", null)
      .is("parent2", null)
      .order("created_at", { ascending: false })
      .range((page - 1) * PARENT_THREAD_COUNT, page * PARENT_THREAD_COUNT - 1);

  if (topParentThreadsError) {
    console.log("TOP PARENT THREADS ERROR: " + topParentThreadsError);
  }

  if (recentParentThreadsError) {
    console.log("RECENT PARENT THREADS ERROR: " + recentParentThreadsError);
  }

  const concatParentThreads = topParentThreads?.concat(recentParentThreads!);

  const uniqueParentThreads = _.uniqBy(
    concatParentThreads,
    (thread) => thread.id
  );

  return { parentThreads: uniqueParentThreads };
}

export async function fetchParentThreadsWithQuery(
  supabase: SupabaseClient<Database>,
  page: number,
  feed: string,
  query: string
) {
  const formattedQuery = query
    .split(" ")
    .map((word) => `'${word}'`)
    .join(" | ");

  const { data: topParentThreads, error: topParentThreadsError } =
    await supabase
      .from("threads")
      .select()
      .eq("feed", feed)
      .is("parent1", null)
      .is("parent2", null)
      .textSearch("content", formattedQuery)
      .order("likes", { ascending: false })
      .gt(
        "created_at",
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      )
      .range((page - 1) * PARENT_THREAD_COUNT, page * PARENT_THREAD_COUNT - 1);

  const { data: recentParentThreads, error: recentParentThreadsError } =
    await supabase
      .from("threads")
      .select()
      .eq("feed", feed)
      .is("parent1", null)
      .is("parent2", null)
      .textSearch("content", formattedQuery)
      .order("created_at", { ascending: false })
      .gt(
        "created_at",
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      )
      .range((page - 1) * PARENT_THREAD_COUNT, page * PARENT_THREAD_COUNT - 1);

  if (topParentThreadsError) {
    console.log("TOP PARENT THREADS ERROR: " + topParentThreadsError);
  }

  if (recentParentThreadsError) {
    console.log("RECENT PARENT THREADS ERROR: " + recentParentThreadsError);
  }

  const concatParentThreads = topParentThreads?.concat(recentParentThreads!);

  const uniqueParentThreads = _.uniqBy(
    concatParentThreads,
    (thread) => thread.id
  );

  return { parentThreads: uniqueParentThreads };
}

export async function fetchParentThreads(
  request: Request,
  page: number,
  feed: string,
  query: string
) {
  const { supabase: anonClient } = AnonServerClient(request);
  const session = await anonClient.auth.getSession();
  const supabase = ServiceServerClient();

  const { parentThreads } = query
    ? await fetchParentThreadsWithQuery(supabase, page, feed, query)
    : await fetchParentThreadsWithNoQuery(supabase, page, feed);

  if (
    session &&
    session.data &&
    session.data.session?.user &&
    parentThreads &&
    parentThreads.length > 0
  ) {
    const { data: likes } = await supabase
      .from("thread_likes")
      .select("thread")
      .eq("user", session.data.session!.user.id)
      .in(
        "thread",
        parentThreads.map((thread) => thread.id)
      );

    const threads = parentThreads.map((thread) =>
      likes?.find((likedThread) => thread.id == likedThread.thread)
        ? { thread, isLiked: true }
        : { thread, isLiked: false }
    );
    return { threads, page };
  }

  const threads = parentThreads
    ? parentThreads.map((thread) => ({ thread, isLiked: false }))
    : null;

  return { threads, page };
}

export async function fetchChildThreads(
  supabase: SupabaseClient<Database>,
  targetThread: number,
  user:
    | {
        city: string | null;
        created_at: string;
        id: string;
        school: string | null;
        username: string;
      }
    | undefined
) {
  //get ALL shallow children, may need to be more efficient in the future
  const { data: topChildThreads } = await supabase
    .from("threads")
    .select()
    .or(`parent1.eq.${targetThread}, parent2.eq.${targetThread}`)
    .order("likes", { ascending: false });

  if (topChildThreads) {
    const { data: likes } = await supabase
      .from("likes")
      .select("post")
      .eq("user", user?.id)
      .in(
        "post",
        topChildThreads.map((thread) => thread.id)
      );

    const childThreadsWithIsLiked = topChildThreads.map((thread) =>
      likes?.find((likedPost) => thread.id == likedPost.post)
        ? { thread, isLiked: true }
        : { thread, isLiked: false }
    );

    const groupedChildThreads = _.groupBy(childThreadsWithIsLiked, (thread) =>
      thread.thread.parent2 ? thread.thread.parent1 : thread.thread.id
    );

    const sortedGroupedChildThreads = _.sortBy(
      groupedChildThreads,
      (groupedChildThread) =>
        _.sum(groupedChildThread.map((thread) => thread.thread.likes)),
      ["desc"]
    );

    return { childThreads: sortedGroupedChildThreads };
  }
}

export async function fetchThread(request: Request, targetThread: string) {
  const { supabase: anonClient } = AnonServerClient(request);
  const session = await anonClient.auth.getSession();
  const supabase = ServiceServerClient();

  if (session) {
    const { data: users } = await supabase
      .from("users")
      .select()
      .eq("id", session.data.session!.user.id!);

    const { data: threads } = await supabase
      .from("threads")
      .select()
      .eq("id", targetThread);

    if (threads && threads.at(0) && users && users.at(0)) {
      const thread = threads.at(0);
      const user = users.at(0);

      if (
        thread && user
          ? thread.feed == user.city || thread.feed == user.school
          : false
      ) {
        const { data: likes } = await supabase
          .from("likes")
          .select("post")
          .eq("user", session.data.session!.user.id)
          .eq("post", threads.at(0)!.id);

        return {
          thread: thread,
          isLiked: likes?.find(
            (likedPost) => threads.at(0)!.id == likedPost.post
          )
            ? true
            : false,
          childThreads: await fetchChildThreads(
            supabase,
            thread?.id ?? 0,
            user
          ),
        };
      }
      return null;
    }
    return null;
  }
  return null;
}
