import { useEffect, useState } from "react";

/**
 * React hook that sets the document title
 * @param {string} title - new title
 */
const useDefineDocumentTitle = (title: string): void => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

/**
 * React hook that retrieves the current document title
 * @returns {string} - current document title
 */
const useGetDocumentTitle = (): string => {
  const [title, setTitle] = useState(document.title);

  useEffect(() => {
    setTitle(document.title);
  }, []);

  return title;
};

export { useDefineDocumentTitle, useGetDocumentTitle };