import { App as SoftWhisperExperience } from "@/soft-whisper/app/App";
import PortfolioNav from "@/components/PortfolioNav";
import "@/soft-whisper/app/styles.css";

export default function SoftWhisperPage() {
  return (
    <main className="soft-whisper-page" aria-label="Soft Whisper">
      <PortfolioNav className="soft-whisper-nav" />
      <div className="soft-whisper-experience-shell">
        <SoftWhisperExperience />
      </div>
    </main>
  );
}
