import VoiceAgent from "./components/VoiceAgent";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl sm:text-6xl font-thin tracking-widest text-white">
          huse kivrak
        </h1>
        <VoiceAgent />
      </div>
    </div>
  );
}
