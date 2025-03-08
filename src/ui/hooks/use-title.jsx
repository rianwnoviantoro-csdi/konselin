import { useEffect } from "react";

function UseTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => (document.title = prevTitle);
  }, [title]);
}

export default UseTitle;
