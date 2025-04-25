"use client";
import React, { useState } from "react";
import * as d3 from "d3";

// 주어진 수학 함수 fn과 x 범위, steps를 기반으로 곡선을 구성할 좌표 배열을 생성하는 함수
const generatePointsFromFn = (
  fn: (x: number) => number,
  xRange: [number, number],
  steps: number
): [number, number][] => {
  const [xStart, xEnd] = xRange;
  const points: [number, number][] = [];

  // 그래프1(A→B), 그래프2(C→D) 각각에 대해 보간 곡선을 steps 개수만큼 생성하고 색상도 함께 보간하여 paths와 gradients 배열에 저장
  for (let i = 0; i <= steps; i++) {
    const x = xStart + ((xEnd - xStart) * i) / steps;
    const y = fn(x);
    points.push([x, y]);
  }

  return points;
};

// 두 곡선의 각 점을 보간하여 중간 곡선을 생성하는 함수
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

// 주어진 좌표 배열을 d3의 line 생성기로 path 문자열로 변환하는 함수
const generatePath = (points: [number, number][]) =>
  d3.line<[number, number]>().curve(d3.curveBasis)(points)!;

export default function InteractiveCurveBlend() {
  const [graph1AmpA, setGraph1AmpA] = useState(60);
  const [graph1PhaseA, setGraph1PhaseA] = useState(
    (-2.4 + Math.PI * 2) % (Math.PI * 2)
  ); // ≈ 3.88

  // 음수 값들을 % (Math.PI * 2) 연산을 사용하여 0~2π 범위로 변환

  const [graph1AmpB, setGraph1AmpB] = useState(55);
  const [graph1PhaseB, setGraph1PhaseB] = useState(0.2 % (Math.PI * 2)); // = 0.2
  const [graph1StartColorA, setGraph1StartColorA] = useState("#DDC1FE");
  const [graph1EndColorA, setGraph1EndColorA] = useState("#7ACBFF");
  const [graph1StartColorB, setGraph1StartColorB] = useState("#C09BFF");
  const [graph1EndColorB, setGraph1EndColorB] = useState("#3C97E9");

  // 그래프 보간 단계 수: 곡선 A→B, C→D 간의 중간 곡선을 얼마나 촘촘하게 그릴지 결정 (높을수록 부드러움)
  const steps = 20;
  const [windowWidth, setWindowWidth] = useState(800);

  React.useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const xRange: [number, number] = [0, windowWidth];
  // 곡선을 몇 개의 점으로 구성할지 결정하는 값 (높을수록 세밀한 곡선)
  const resolution = 60;

  // 화면 크기에 따른 스케일 팩터 계산 (기준 너비를 800으로 가정)
  const scaleFactor = windowWidth / 800;

  // 기준 중심점을 250으로 통일하고 offset으로 조절
  const centerY = 100;
  const curveA = generatePointsFromFn(
    (x) =>
      centerY * scaleFactor + // 기준 중심점
      graph1AmpA *
        scaleFactor *
        Math.sin((x + 0) / (80 * scaleFactor) + graph1PhaseA),
    xRange,
    resolution
  );

  const curveB = generatePointsFromFn(
    (x) =>
      (centerY + 10) * scaleFactor + // offset: +10
      graph1AmpB *
        scaleFactor *
        Math.sin((x + 20) / (80 * scaleFactor) + graph1PhaseB),
    xRange,
    resolution
  );

  const paths = [];
  const gradients = [];

  const [graph2AmpA, setGraph2AmpA] = useState(40);
  const [graph2PhaseA, setGraph2PhaseA] = useState(
    (-1.0 + Math.PI * 2) % (Math.PI * 2)
  ); // ≈ 5.28
  const [graph2AmpB, setGraph2AmpB] = useState(65);
  const [graph2PhaseB, setGraph2PhaseB] = useState(0.8 % (Math.PI * 2)); // = 0.8
  const [graph2StartColorA, setGraph2StartColorA] = useState("#C09BFF");
  const [graph2EndColorA, setGraph2EndColorA] = useState("#3C44E9");
  const [graph2StartColorB, setGraph2StartColorB] = useState("#F6DCFF");
  const [graph2EndColorB, setGraph2EndColorB] = useState("#AEBFFF");

  const curveC = generatePointsFromFn(
    (x) =>
      (centerY - 10) * scaleFactor + // offset: -10
      graph2AmpA *
        scaleFactor *
        Math.sin((x + 10) / (80 * scaleFactor) + graph2PhaseA),
    xRange,
    resolution
  );

  const curveD = generatePointsFromFn(
    (x) =>
      (centerY + 20) * scaleFactor + // offset: +20
      graph2AmpB *
        scaleFactor *
        Math.sin((x + 30) / (80 * scaleFactor) + graph2PhaseB),
    xRange,
    resolution
  );

  // 그래프의 위상(phase)을 시간에 따라 주기적으로 갱신하여 애니메이션을 생성하는 useEffect
  React.useEffect(() => {
    const interval = setInterval(() => {
      const graph1PhaseA_diff = 0.02;
      const graph1PhaseB_diff = -0.03;
      const graph2PhaseA_diff = -0.035;
      const graph2PhaseB_diff = 0.05;

      setGraph1PhaseA((prev) => {
        const next = prev + graph1PhaseA_diff;
        if (next >= Math.PI * 2) return 0;
        if (next < 0) return Math.PI * 2;
        return next;
      });

      setGraph1PhaseB((prev) => {
        const next = prev + graph1PhaseB_diff;
        if (next >= Math.PI * 2) return 0;
        if (next < 0) return Math.PI * 2;
        return next;
      });

      setGraph2PhaseA((prev) => {
        const next = prev + graph2PhaseA_diff;
        if (next >= Math.PI * 2) return 0;
        if (next < 0) return Math.PI * 2;
        return next;
      });

      setGraph2PhaseB((prev) => {
        const next = prev + graph2PhaseB_diff;
        if (next >= Math.PI * 2) return 0;
        if (next < 0) return Math.PI * 2;
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);
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
                min={0}
                max={Math.PI * 2}
                step={0.01}
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
                min={0}
                max={Math.PI * 2}
                step={0.01}
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
                  min={0}
                  max={Math.PI * 2}
                  step={0.01}
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
                  min={0}
                  max={Math.PI * 2}
                  step={0.01}
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
        <svg className="w-full aspect-square border max-h-[60vh] border-gray-300 bg-white">
          <defs>{gradients}</defs>
          {paths}
        </svg>
      </div>
    </div>
  );
}
