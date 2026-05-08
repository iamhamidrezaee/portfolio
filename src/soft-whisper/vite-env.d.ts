/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    __SOFT_WHISPER_QA__?: {
      setScenario: (scenario: string) => void;
      getSnapshot: () => unknown;
    };
  }
}
