"use client";

interface VideoEmbedProps {
  id: string;
  title?: string;
  type?: "loom" | "youtube";
}

export function VideoEmbed({ id, title, type }: VideoEmbedProps) {
  const isYouTube =
    type === "youtube" ||
    id.includes("youtube.com") ||
    id.includes("youtu.be") ||
    (type !== "loom" && id.length === 11);

  let embedUrl = `https://www.loom.com/embed/${id}`;

  if (isYouTube) {
    let videoId = id;
    if (id.includes("youtu.be/")) {
      videoId = id.split("youtu.be/")[1]?.split("?")[0] || id;
    } else if (id.includes("watch?v=")) {
      videoId = id.split("watch?v=")[1]?.split("&")[0] || id;
    } else if (id.includes("embed/")) {
      videoId = id.split("embed/")[1]?.split("?")[0] || id;
    }
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  return (
    <div
      className="relative my-6 w-full overflow-hidden rounded-xl border border-[hsl(222_14%_18%)] bg-[hsl(222_14%_5%)]"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        src={embedUrl}
        title={title ?? (isYouTube ? "YouTube video player" : "Video walkthrough")}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
