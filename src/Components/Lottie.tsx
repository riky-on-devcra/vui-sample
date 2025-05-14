"use client";
import temp from "./Particle.json";
import Lottie from "react-lottie-player";
import LottieView from "lottie-react";

const LottiePlayer = () => {
  return (
    <div className="flex gap-5 items-center justify-center">
      <Lottie
        animationData={temp}
        play
        className="aspect-auto h-[80vh] border"
      />
      <LottieView
        animationData={temp}
        className="aspect-auto h-[80vh] border"
      />
    </div>
  );
};

export default LottiePlayer;
