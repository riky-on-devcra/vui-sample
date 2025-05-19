"use client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface VoiceVisualizerRendererProps {
  isRecording: boolean;
  analyserRef: React.RefObject<AnalyserNode | null>;
  audioContextRef: React.RefObject<AudioContext | null>;
  isInitialized: boolean;
  animationFrameRef: React.RefObject<number>;
}

export default function VoiceVisualizerRenderer({
  isRecording,
  analyserRef,
  audioContextRef,
  isInitialized,
  animationFrameRef,
}: VoiceVisualizerRendererProps) {
  const paths = [];
  const gradients = [];

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

  // 이전 오디오 데이터를 저장할 ref
  const prevAverageRef = useRef<number>(0);
  const prevAmpARef = useRef<number>(40);
  const prevAmpBRef = useRef<number>(40);

  const [graph1AmpA, setGraph1AmpA] = useState(40);
  const [graph1PhaseA, setGraph1PhaseA] = useState(
    (-2.4 + Math.PI * 2) % (Math.PI * 2)
  ); // ≈ 3.88

  // 음수 값들을 % (Math.PI * 2) 연산을 사용하여 0~2π 범위로 변환

  const [graph1AmpB, setGraph1AmpB] = useState(20);
  const [graph1PhaseB, setGraph1PhaseB] = useState(0.2 % (Math.PI * 2)); // = 0.2
  const [graph1StartColorA, setGraph1StartColorA] = useState("#DDC1FE");
  const [graph1EndColorA, setGraph1EndColorA] = useState("#7ACBFF");
  const [graph1StartColorB, setGraph1StartColorB] = useState("#C09BFF");
  const [graph1EndColorB, setGraph1EndColorB] = useState("#3C97E9");

  // 그래프 보간 단계 수: 곡선 A→B, C→D 간의 중간 곡선을 얼마나 촘촘하게 그릴지 결정 (높을수록 부드러움)
  const steps = 20;
  const [windowWidth, setWindowWidth] = useState(800);

  useEffect(() => {
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

  const [graph2AmpA, setGraph2AmpA] = useState(15);
  const [graph2PhaseA, setGraph2PhaseA] = useState(
    (-1.0 + Math.PI * 2) % (Math.PI * 2)
  ); // ≈ 5.28
  const [graph2AmpB, setGraph2AmpB] = useState(35);
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

  // 그래프의 위상(phase)을 시간에 따라 주기적으로 갱신하여 애니메이션을 생성하는 useEffect
  useEffect(() => {
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

  useEffect(() => {
    const updateAudioVisualization = () => {
      if (
        !analyserRef.current ||
        !isRecording ||
        !audioContextRef.current ||
        !isInitialized
      ) {
        console.log("분석기 또는 녹음 상태가 유효하지 않음:", {
          hasAnalyser: !!analyserRef.current,
          isRecording,
          hasAudioContext: !!audioContextRef.current,
          audioContextState: audioContextRef.current?.state,
          isInitialized,
        });
        return;
      }

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      analyserRef.current.getByteFrequencyData(dataArray);

      // 주파수 대역별로 데이터 분석
      const lowFreqRange = dataArray.slice(0, 10); // 저주파수 대역 (0-200Hz)
      const midFreqRange = dataArray.slice(10, 50); // 중주파수 대역 (200-1000Hz)
      const highFreqRange = dataArray.slice(50); // 고주파수 대역 (1000Hz 이상)

      // 각 주파수 대역의 평균값 계산
      const lowAverage = Number(
        lowFreqRange.reduce((a, b) => a + b) / lowFreqRange.length
      ).toFixed(2);
      const midAverage = Number(
        midFreqRange.reduce((a, b) => a + b) / midFreqRange.length
      ).toFixed(2);
      const highAverage = Number(
        highFreqRange.reduce((a, b) => a + b) / highFreqRange.length
      ).toFixed(2);

      // 저음에 더 높은 가중치를 주어 평균 계산
      const weightedAverage = Number(
        (Number(lowAverage) * 1.5 +
          Number(midAverage) * 1.0 +
          Number(highAverage) * 0.5) /
          3
      ).toFixed(2);

      // 이전 값과의 차이가 너무 크면 제한
      const maxChange = 10; // 한 프레임당 최대 변화량
      const smoothedAverage =
        Math.abs(Number(weightedAverage) - prevAverageRef.current) > maxChange
          ? prevAverageRef.current +
            (Number(weightedAverage) > prevAverageRef.current
              ? maxChange
              : -maxChange)
          : Number(weightedAverage);

      prevAverageRef.current = Number(smoothedAverage.toFixed(2));

      // 진폭 업데이트 (스케일링 조정)
      // 입력값이 20 이하일 때는 변화를 최소화
      const threshold = 20;
      const maxInput = 128;
      const minInput = threshold;
      const inputRange = maxInput - minInput;

      // 입력값을 0-1 범위로 정규화하고 스케일링
      const normalizedInput = Number(
        smoothedAverage < threshold
          ? 0
          : ((smoothedAverage - minInput) / inputRange).toFixed(4)
      );

      // 정규화된 입력값을 사용하여 진폭 계산 (0-100 범위)
      const scaledAverage = Number(
        (Math.pow(normalizedInput, 1.2) * 60).toFixed(2)
      ); // 최대 변화량을 60으로 설정

      const baseAmplitudeGraph1 = 40; // 기본 진폭값
      const baseAmplitudeGraph2 = 35; // 기본 진폭값
      const newAmpA = Number(
        Math.min(
          baseAmplitudeGraph1 + 60, // 기본값 + 최대 변화량
          Math.max(baseAmplitudeGraph1, baseAmplitudeGraph1 + scaledAverage) // 최소값을 기본값으로 설정
        ).toFixed(2)
      );

      const newAmpB = Number(
        Math.min(
          baseAmplitudeGraph2 + 60, // 기본값 + 최대 변화량
          Math.max(baseAmplitudeGraph2, baseAmplitudeGraph2 + scaledAverage) // 최소값을 기본값으로 설정
        ).toFixed(2)
      );

      // 이전 값과의 차이가 너무 크면 제한
      const finalAmpA = Number(
        Math.abs(newAmpA - prevAmpARef.current) > maxChange
          ? (
              prevAmpARef.current +
              (newAmpA > prevAmpARef.current ? maxChange : -maxChange)
            ).toFixed(2)
          : newAmpA.toFixed(2)
      );

      const finalAmpB = Number(
        Math.abs(newAmpB - prevAmpBRef.current) > maxChange
          ? (
              prevAmpBRef.current +
              (newAmpB > prevAmpBRef.current ? maxChange : -maxChange)
            ).toFixed(2)
          : newAmpB.toFixed(2)
      );

      prevAmpARef.current = Number(finalAmpA);
      prevAmpBRef.current = Number(finalAmpB);

      // 부드러운 변화를 위해 현재값과의 가중 평균 사용
      setGraph1AmpA((prev) =>
        Number((prev * 0.7 + finalAmpA * 0.3).toFixed(2))
      );
      setGraph2AmpB((prev) =>
        Number((prev * 0.7 + finalAmpB * 0.3).toFixed(2))
      );

      // 위상 업데이트 (스케일링 조정)
      const phaseChange = Number(
        (smoothedAverage < threshold ? 0 : normalizedInput * 0.015).toFixed(4)
      );
      setGraph1PhaseA((prev) => {
        const next = Number((prev + phaseChange).toFixed(4));
        return next >= Math.PI * 2 ? 0 : next;
      });

      // 1초마다 한 번씩 로그 출력 (너무 많은 로그 방지)
      if (Date.now() % 1000 < 16) {
        // 약 60fps 기준으로 1초에 한 번
        console.log("오디오 데이터 상태:", {
          lowAverage: Number(lowAverage),
          midAverage: Number(midAverage),
          highAverage: Number(highAverage),
          weightedAverage: Number(weightedAverage),
          smoothedAverage: Number(smoothedAverage.toFixed(2)),
          normalizedInput: Number(normalizedInput.toFixed(4)),
          scaledAverage: Number(scaledAverage.toFixed(2)),
          newAmpA: Number(finalAmpA.toFixed(2)),
          currentAmpA: Number(graph1AmpA.toFixed(2)),
          currentPhaseA: Number(graph1PhaseA.toFixed(4)),
          isRecording,
          audioContextState: audioContextRef.current?.state,
          isInitialized,
        });
      }

      animationFrameRef.current = requestAnimationFrame(
        updateAudioVisualization
      );
    };

    if (isRecording && isInitialized) {
      updateAudioVisualization();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isRecording,
    isInitialized,
    analyserRef,
    audioContextRef,
    animationFrameRef,
  ]);

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
      <div className="absolute bottom-0 inset-x-0 text-xs flex flex-wrap gap-4 p-4 bg-red-50 m-2">
        <div className="flex flex-col gap-2 w-full max-w-[800px]">
          Graph 1
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label>
                Amplitude A:
                <br />
                {graph1AmpA.toFixed(4)}
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
                {graph1AmpB.toFixed(4)}
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
                  {graph2AmpA.toFixed(4)}
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
                  {graph2AmpB.toFixed(4)}
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
      <div className="flex items-end w-full h-full">
        <svg className="w-full aspect-square border h-full border-gray-300 bg-white">
          <defs>{gradients}</defs>
          {paths}
        </svg>
      </div>
    </div>
  );
}
