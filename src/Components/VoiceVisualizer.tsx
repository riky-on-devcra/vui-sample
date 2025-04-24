"use client";
import React, { useState } from "react";
import * as d3 from "d3";

const generatePointsFromFn = (
  fn: (x: number) => number,
  xRange: [number, number],
  steps: number
): [number, number][] => {
  const [xStart, xEnd] = xRange;
  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const x = xStart + ((xEnd - xStart) * i) / steps;
    const y = fn(x);
    points.push([x, y]);
  }

  return points;
};

const interpolatePoints = (
  a: [number, number][],
  b: [number, number][],
  t: number
): [number, number][] => {
  return a.map(([x1, y1], i) => {
    const [, y2] = b[i];
    return [x1, y1 + (y2 - y1) * t];
  });
};

const generatePath = (points: [number, number][]) =>
  d3.line<[number, number]>().curve(d3.curveBasis)(points)!;

export default function InteractiveCurveBlend() {
  const [graph1AmpA, setGraph1AmpA] = useState(60);
  const [graph1PhaseA, setGraph1PhaseA] = useState(-2.4);
  // Removed duplicate declaration of graph1PhaseB
  // Removed duplicate declaration of graph2PhaseA
  // Removed duplicate declaration of graph2PhaseB

  React.useEffect(() => {
    const interval = setInterval(() => {
      // 그래프 1 빠르게
      setGraph1PhaseA((prev) => prev + 0.02);
      setGraph1PhaseB((prev) => prev - 0.03);

      // 그래프 2는 더 빠르고 역방향 강조
      setGraph2PhaseA((prev) => prev - 0.035);
      setGraph2PhaseB((prev) => prev + 0.05);
    }, 20); // 간격도 더 짧게
    return () => clearInterval(interval);
  }, []);
  const [graph1AmpB, setGraph1AmpB] = useState(55);
  const [graph1PhaseB, setGraph1PhaseB] = useState(0.2);
  const [graph1StartColorA, setGraph1StartColorA] = useState("#DDC1FE");
  const [graph1EndColorA, setGraph1EndColorA] = useState("#7ACBFF");
  const [graph1StartColorB, setGraph1StartColorB] = useState("#C09BFF");
  const [graph1EndColorB, setGraph1EndColorB] = useState("#3C97E9");

  const steps = 20;
  const [windowWidth, setWindowWidth] = useState(800);

  React.useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const xRange: [number, number] = [0, windowWidth];
  const resolution = 60;

  const curveA = generatePointsFromFn(
    (x) => 250 + graph1AmpA * Math.sin((x + 0) / 80 + graph1PhaseA),
    xRange,
    resolution
  );

  const curveB = generatePointsFromFn(
    (x) => 260 + graph1AmpB * Math.sin((x + 20) / 80 + graph1PhaseB),
    xRange,
    resolution
  );

  const paths = [];
  const gradients = [];

  const [graph2AmpA, setGraph2AmpA] = useState(40);
  const [graph2PhaseA, setGraph2PhaseA] = useState(-1.0);
  const [graph2AmpB, setGraph2AmpB] = useState(65);
  const [graph2PhaseB, setGraph2PhaseB] = useState(0.8);
  const [graph2StartColorA, setGraph2StartColorA] = useState("#C09BFF");
  const [graph2EndColorA, setGraph2EndColorA] = useState("#3C44E9");
  const [graph2StartColorB, setGraph2StartColorB] = useState("#F6DCFF");
  const [graph2EndColorB, setGraph2EndColorB] = useState("#AEBFFF");

  const curveC = generatePointsFromFn(
    (x) => 240 + graph2AmpA * Math.sin((x + 10) / 80 + graph2PhaseA),
    xRange,
    resolution
  );

  const curveD = generatePointsFromFn(
    (x) => 270 + graph2AmpB * Math.sin((x + 30) / 80 + graph2PhaseB),
    xRange,
    resolution
  );
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const blended = interpolatePoints(curveA, curveB, t);
    const d = generatePath(blended);
    const gradId = `blend-gradient-${i}`;

    gradients.push(
      <linearGradient id={gradId} key={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
        <stop
          offset="0%"
          stopColor={d3.interpolateRgb(graph1StartColorA, graph1StartColorB)(t)}
        />
        <stop
          offset="100%"
          stopColor={d3.interpolateRgb(graph1EndColorA, graph1EndColorB)(t)}
        />
      </linearGradient>
    );

    paths.push(
      <path
        key={`line-${i}`}
        d={d}
        stroke={`url(#${gradId})`}
        strokeWidth={1}
        strokeOpacity={0.4}
        fill="none"
      />
    );

    // 두 번째 곡선 추가
    const blendedCD = interpolatePoints(curveC, curveD, t);
    const dCD = generatePath(blendedCD);
    const gradIdCD = `blend-gradient-cd-${i}`;

    gradients.push(
      <linearGradient
        id={gradIdCD}
        key={`grad-cd-${i}`}
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop
          offset="0%"
          stopColor={d3.interpolateRgb(graph2StartColorA, graph2StartColorB)(t)}
        />
        <stop
          offset="100%"
          stopColor={d3.interpolateRgb(graph2EndColorA, graph2EndColorB)(t)}
        />
      </linearGradient>
    );

    paths.push(
      <path
        key={`line-cd-${i}`}
        d={dCD}
        stroke={`url(#${gradIdCD})`}
        strokeWidth={1}
        strokeOpacity={0.4}
        fill="none"
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="fixed top-0 left-0 text-xs flex flex-wrap gap-4 p-4">
        <div className="flex flex-col gap-2 w-full max-w-[800px]">
          Graph 1
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label>
                Amplitude A:
                <br />
                {graph1AmpA}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={graph1AmpA}
                onChange={(e) => setGraph1AmpA(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>
                Phase A:
                <br />
                {graph1PhaseA.toFixed(2)}
              </label>
              <input
                type="range"
                value={graph1PhaseA}
                readOnly
                className="w-full accent-gray-800 cursor-not-allowed"
              />
            </div>
            <div>
              <label>
                Amplitude B:
                <br />
                {graph1AmpB}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={graph1AmpB}
                onChange={(e) => setGraph1AmpB(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>
                Phase B:
                <br />
                {graph1PhaseB.toFixed(2)}
              </label>
              <input
                type="range"
                value={graph1PhaseB}
                readOnly
                className="w-full accent-gray-800 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label>Curve A Start Color:</label>
              <input
                type="color"
                value={graph1StartColorA}
                onChange={(e) => setGraph1StartColorA(e.target.value)}
              />
            </div>
            <div>
              <label>Curve A End Color:</label>
              <input
                type="color"
                value={graph1EndColorA}
                onChange={(e) => setGraph1EndColorA(e.target.value)}
              />
            </div>
            <div>
              <label>Curve B Start Color:</label>
              <input
                type="color"
                value={graph1StartColorB}
                onChange={(e) => setGraph1StartColorB(e.target.value)}
              />
            </div>
            <div>
              <label>Curve B End Color:</label>
              <input
                type="color"
                value={graph1EndColorB}
                onChange={(e) => setGraph1EndColorB(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[800px]">
          Graph 2
          <div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label>
                  Amplitude A:
                  <br />
                  {graph2AmpA}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={graph2AmpA}
                  onChange={(e) => setGraph2AmpA(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label>
                  Phase A:
                  <br />
                  {graph2PhaseA.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={graph2PhaseA}
                  readOnly
                  className="w-full accent-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label>
                  Amplitude B:
                  <br />
                  {graph2AmpB}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={graph2AmpB}
                  onChange={(e) => setGraph2AmpB(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label>
                  Phase B:
                  <br />
                  {graph2PhaseB.toFixed(2)}
                </label>
                <input
                  type="range"
                  value={graph2PhaseB}
                  readOnly
                  className="w-full accent-gray-800 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label>Curve A Start Color:</label>
                <input
                  type="color"
                  value={graph2StartColorA}
                  onChange={(e) => setGraph2StartColorA(e.target.value)}
                />
              </div>
              <div>
                <label>Curve A End Color:</label>
                <input
                  type="color"
                  value={graph2EndColorA}
                  onChange={(e) => setGraph2EndColorA(e.target.value)}
                />
              </div>
              <div>
                <label>Curve B Start Color:</label>
                <input
                  type="color"
                  value={graph2StartColorB}
                  onChange={(e) => setGraph2StartColorB(e.target.value)}
                />
              </div>
              <div>
                <label>Curve B End Color:</label>
                <input
                  type="color"
                  value={graph2EndColorB}
                  onChange={(e) => setGraph2EndColorB(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end w-full h-full p-2">
        <svg className="w-full aspect-square border max-h-[75vh] border-gray-300 bg-white">
          <defs>{gradients}</defs>
          {paths}
        </svg>
      </div>
    </div>
  );
}
