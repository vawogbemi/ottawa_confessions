import { useEffect, useRef } from "react";

export function InfiniteScroller(props: {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
  loading: boolean;
  loadNext: () => void;
}) {
  const { children, loading, loadNext } = props;
  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  useEffect(() => {
    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDifference = Math.floor(window.innerHeight + window.scrollY);
      const scrollEnded = documentHeight == scrollDifference;

      if (scrollEnded && !loading) {
        scrollListener.current();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [loading]);

  return <>{children}</>;
}
