import React from 'react';
import { cellAnimationManager, animationUtils } from '../utils/animationSystem';

interface AnimationControlsProps {
  animationsEnabled: boolean;
  onToggleAnimations: (enabled: boolean) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  animationsEnabled,
  onToggleAnimations,
}) => {
  const handleToggle = () => {
    const newEnabled = !animationsEnabled;
    onToggleAnimations(newEnabled);
    
    // Update the animation manager
    cellAnimationManager.updateSettings({ enabled: newEnabled });
  };

  // Check if user prefers reduced motion
  const respectsReducedMotion = animationUtils.respectsReducedMotion();

  return (
    <div className="animation-controls">
      <button
        className="animation-button"
        onClick={handleToggle}
        title={animationsEnabled ? "Disable animations" : "Enable animations"}
        aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
      >
        {animationsEnabled ? '✨' : '⭕'}
      </button>
      {respectsReducedMotion && (
        <span className="reduced-motion-notice" title="Reduced motion preference detected">
          🐌
        </span>
      )}
    </div>
  );
};