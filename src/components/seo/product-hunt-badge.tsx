// Renders nothing until NEXT_PUBLIC_PRODUCT_HUNT_POST_ID is set (the numeric id
// from the "Embed" tab of your Product Hunt launch page).
export default function ProductHuntBadge({ className }: { className?: string }) {
  const postId = process.env.NEXT_PUBLIC_PRODUCT_HUNT_POST_ID;
  const slug = process.env.NEXT_PUBLIC_PRODUCT_HUNT_SLUG;
  if (!postId || !slug) return null;
  return (
    <a
      className={className}
      href={`https://www.producthunt.com/posts/${slug}?utm_source=badge-featured&utm_medium=badge`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${postId}&theme=neutral`}
        alt="Featured on Product Hunt"
        width={250}
        height={54}
        loading="lazy"
      />
    </a>
  );
}
