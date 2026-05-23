"use client";

import {
  PieChart,
  Pie,
  Tooltip,
} from "recharts";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroChart({
  protein,
  carbs,
  fat,
}: Props) {

  const data = [
    {
      name: "Protein",
      value: protein,
      fill: "#8b5cf6",
    },
    {
      name: "Carbs",
      value: carbs,
      fill: "#06b6d4",
    },
    {
      name: "Fat",
      value: fat,
      fill: "#f97316",
    },
  ];

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <p className="mb-2 text-sm text-white/60">
          Macronutrients
        </p>
        <h2 className="text-2xl font-bold">
          Macro Distribution
        </h2>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <PieChart
          width={320}
          height={320}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={5}
          />
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}