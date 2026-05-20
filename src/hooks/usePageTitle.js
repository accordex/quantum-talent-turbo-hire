import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — TalentTurbo` : "TalentTurbo — Hire Faster with Verified Talent";
    return () => { document.title = prev; };
  }, [title]);
}