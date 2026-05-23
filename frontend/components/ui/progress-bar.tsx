interface Props {
  label: string;
  value: number;
  max: number;
  unit: string;
}

export function ProgressBar({
  label,
  value,
  max,
  unit,
}: Props) {

  const percentage =
    Math.min(
      (value / max) * 100,
      100
    );

  return (
    <div>
      <div
        className="
          mb-2 flex
          items-center
          justify-between
        "
      >
        <p className="text-sm text-white/70">
          {label}
        </p>
        <p className="text-sm font-medium">
          {value}
          {unit}
        </p>
      </div>
      <div
        className="
          h-3 overflow-hidden
          rounded-full
          bg-white/10
        "
      >
        <div
          style={{
            width: `${percentage}%`,
          }}
          className="
            h-full rounded-full
            bg-gradient-to-r
            from-violet-500
            to-cyan-400
            transition-all duration-500
          "
        />
      </div>
    </div>
  );
}