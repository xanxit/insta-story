import React from "react";

interface PunScreenProps {
  setPunScreenEnabled: (enabled: boolean) => void;
}

const IS_PUN_DONE = "ispunDone";

const PunScreen: React.FC<PunScreenProps> = ({ setPunScreenEnabled }) => {
  const onContinue = () => {
    sessionStorage.setItem(IS_PUN_DONE, "false");
    setPunScreenEnabled(false);
  };

  return (
    <div className="pun-screen">
      <h2>Surprise! That “crash” was just a demo stunt 🤹‍♂️</h2>
      <p>
        No actual bugs here—I'm hard at work on the full upload feature. Think
        we can make it even better? Hire me and let’s build it together! Click{" "}
        <strong>Continue</strong> to see your story.
      </p>
      <p className="pun-ps">
        Note: This upload won’t survive a page refresh—think of it as a
        limited-edition browser exclusive!
      </p>
      <button className="pun-continue-btn" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
};

export default PunScreen;
