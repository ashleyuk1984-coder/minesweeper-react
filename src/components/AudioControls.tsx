import React, { useState, useEffect } from 'react';
import { audioSystem } from '../utils/audioSystem';

const AudioControls: React.FC = () => {
  const [volume, setVolume] = useState(audioSystem.getVolume());
  const [isMuted, setIsMuted] = useState(audioSystem.isMutedState());

  useEffect(() => {
    // Initialize audio on mount (first user interaction)
    audioSystem.initializeOnUserAction();
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioSystem.setVolume(newVolume);
    
    // Play a test sound when adjusting volume
    if (newVolume > 0 && !isMuted) {
      audioSystem.playCellClick();
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioSystem.setMuted(newMutedState);
    
    // Play sound when unmuting
    if (!newMutedState) {
      audioSystem.playCellClick();
    }
  };

  return (
    <div className="audio-controls">
      <button 
        className="mute-button"
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
      </button>
      
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
          disabled={isMuted}
        />
      </div>
    </div>
  );
};

export default AudioControls;