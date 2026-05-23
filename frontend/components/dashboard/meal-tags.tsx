interface Props {
  tags?: string[];
}

export function MealTags({
  tags,
}: Props) {

  if (!tags?.length) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {tags.map((tag) => (
        <div
          key={tag}
          className="
            rounded-full
            border border-violet-500/20
            bg-violet-500/10
            px-4 py-2
            text-xs font-medium
            text-violet-200
          "
        >
          {tag}
        </div>
      ))}
    </div>
  );
}