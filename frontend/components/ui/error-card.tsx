interface Props {
  message: string;
}

export function ErrorCard({
  message,
}: Props) {

  return (
    <div
      className="
        rounded-[32px]
        border border-red-500/20
        bg-red-500/10
        p-6
      "
    >
      <p className="mb-2 text-sm text-red-300">
        Recommendation Failed
      </p>
      <h2 className="text-lg font-semibold text-white">
        {message}
      </h2>
    </div>
  );
}