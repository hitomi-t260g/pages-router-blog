import { useAtom } from "jotai";
import { moodAtom } from "../../../commons/state/moodAtom";

export default function VideoBackground() {
  const [mood] = useAtom(moodAtom);

  const getVideoFilter = () => {
    switch (mood) {
      case "energetic":
        return "sepia(0.3) saturate(1.2) hue-rotate(180deg) brightness(0.8)";
      case "calm":
        return "sepia(0.5) saturate(1.5) hue-rotate(30deg) brightness(0.9)";
      default:
        return "none";
    }
  };

  return (
    <video
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: -10,
        filter: getVideoFilter(),
        transition: "filter 0.5s ease",
      }}
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/background_trim.mp4" type="video/mp4" />
    </video>
  );
}
