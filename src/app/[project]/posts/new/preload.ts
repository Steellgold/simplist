import { useEffect, useState } from "react";

const usePreloadImage = (src: string): { src: string | undefined; isLoading: boolean; isError: boolean } => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;
    if (src) {
      setLoading(true);
      const img = new Image();
      img.onload = () => {
        if (isCancelled) return;
        setLoading(false);
      };
      img.onerror = (e) => {
        if (isCancelled) return;
        setLoading(false);
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setError(e.message || "failed to load image");
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      img.src = src;
    } else {
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [src]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { src: src ? src : undefined, isLoading, isError: !!error };
};

export default usePreloadImage;