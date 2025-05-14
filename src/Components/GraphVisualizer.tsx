"use client";
import React from "react";
import * as d3 from "d3";

// 보조 함수 및 타입은 별도 utils로 분리하거나 이 파일 내에 둬도 OK
// props로 curveA~curveD, 색상, steps, scale, 등등 받도록

export default function GraphVisualizer({
  curveA,
  curveB,
  curveC,
  curveD,
  steps,
  startColorA,
  endColorA,
  startColorB,
  endColorB,
  startColorC,
  endColorC,
  startColorD,
  endColorD,
}: {
  curveA: [number, number][];
  curveB: [number, number][];
  curveC: [number, number][];
  curveD: [number, number][];
  steps: number;
  startColorA: string;
  endColorA: string;
  startColorB: string;
  endColorB: string;
  startColorC: string;
  endColorC: string;
  startColorD: string;
  endColorD: string;
}) {
  const interpolatePoints = (
    a: [number, number][],
    b: [number, number][],
    t: number
  ): [number, number][] =>
    a.map(([x1, y1], i) => {
      const [, y2] = b[i];
      return [x1, y1 + (y2 - y1) * t];
    });

  const generatePath = (points: [number, number][]) =>
    d3.line<[number, number]>().curve(d3.curveBasis)(points)!;

  const gradients = [];
  const paths = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const dAB = generatePath(interpolatePoints(curveA, curveB, t));
    const dCD = generatePath(interpolatePoints(curveC, curveD, t));

    const gradIdAB = `grad-ab-${i}`;
    const gradIdCD = `grad-cd-${i}`;

    gradients.push(
      <linearGradient id={gradIdAB} key={gradIdAB} x1="0" y1="0" x2="1" y2="0">
        <stop
          offset="0%"
          stopColor={d3.interpolateRgb(startColorA, startColorB)(t)}
        />
        <stop
          offset="100%"
          stopColor={d3.interpolateRgb(endColorA, endColorB)(t)}
        />
      </linearGradient>,
      <linearGradient id={gradIdCD} key={gradIdCD} x1="0" y1="0" x2="1" y2="0">
        <stop
          offset="0%"
          stopColor={d3.interpolateRgb(startColorC, startColorD)(t)}
        />
        <stop
          offset="100%"
          stopColor={d3.interpolateRgb(endColorC, endColorD)(t)}
        />
      </linearGradient>
    );

    paths.push(
      <path
        key={`path-ab-${i}`}
        d={dAB}
        stroke={`url(#${gradIdAB})`}
        strokeWidth={1}
        strokeOpacity={0.4}
        fill="none"
      />,
      <path
        key={`path-cd-${i}`}
        d={dCD}
        stroke={`url(#${gradIdCD})`}
        strokeWidth={1}
        strokeOpacity={0.4}
        fill="none"
      />
    );
  }

  return (
    <svg className="w-full aspect-square border max-h-[60vh] border-gray-300 bg-white">
      <defs>{gradients}</defs>
      {paths}
    </svg>
  );
}
