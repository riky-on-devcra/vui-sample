"use client";
import React, { useState, useRef, useEffect } from "react";

import VoiceVisualizerRenderer from "./VoiceVisualizerRenderer";

export default function VoiceVisualizer() {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [shouldStartRecording, setShouldStartRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 녹음 상태 변경을 감지하는 useEffect
  useEffect(() => {
    if (shouldStartRecording && !isInitialized) {
      startRecording();
      setShouldStartRecording(false);
    }
  }, [shouldStartRecording, isInitialized]);

  const startRecording = async () => {
    try {
      console.log("마이크 접근 권한 요청 중...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      console.log("마이크 접근 권한 획득 성공");
      mediaStreamRef.current = stream;

      // 기존 AudioContext가 있다면 닫기
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      const audioContext = new AudioContext();
      console.log("AudioContext 생성됨:", audioContext.state);
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      console.log("오디오 소스 연결 완료");

      // AudioContext가 suspended 상태라면 resume
      if (audioContext.state === "suspended") {
        await audioContext.resume();
        console.log("AudioContext resumed");
      }

      setIsInitialized(true);
      setIsRecording(true);
      console.log("녹음이 시작되었습니다.");
    } catch (error) {
      console.error("오디오 녹음을 시작할 수 없습니다:", error);
      alert("마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.");
    }
  };

  const handleStartRecording = () => {
    setShouldStartRecording(true);
  };

  const stopRecording = async () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }

    setIsInitialized(false);
    setIsRecording(false);
    console.log("녹음이 중지되었습니다.");
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={isRecording ? stopRecording : handleStartRecording}
          className={`px-4 py-2 rounded ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isRecording ? "녹음 중지" : "녹음 시작"}
        </button>
      </div>
      <VoiceVisualizerRenderer
        isRecording={isRecording}
        analyserRef={analyserRef}
        audioContextRef={audioContextRef}
        isInitialized={isInitialized}
        animationFrameRef={animationFrameRef}
      />
    </div>
  );
}
