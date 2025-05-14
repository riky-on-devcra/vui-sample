// import LottiePlayer from "@/Components/Lottie";
import VoiceVisualizer from "@/Components/VoiceVisualizer";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] ">
      <main className="flex flex-1 h-full w-full items-center justify-center">
        <VoiceVisualizer />
        {/* <LottiePlayer /> */}
      </main>
    </div>
  );
}
