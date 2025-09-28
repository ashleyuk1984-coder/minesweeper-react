import React from 'react';
import { PlayerStatistics, Difficulty } from '../types';
import { formatTime, getDifficultyDisplayName } from '../utils/statistics';

interface StatisticsProps {
  statistics: PlayerStatistics;
  isVisible: boolean;
  onClose: () => void;
  onReset: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ 
  statistics, 
  isVisible, 
  onClose, 
  onReset 
}) => {
  if (!isVisible) return null;

  const winPercentage = statistics.winRate.toFixed(1);
  const avgTime = formatTime(Math.round(statistics.averageTime));

  return (
    <div className="statistics-overlay">
      <div className="statistics-modal">
        <div className="statistics-header">
          <h2>📊 Your Statistics</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="statistics-content">
          <div className="stats-section">
            <h3>🎮 Game Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{statistics.gamesPlayed}</div>
                <div className="stat-label">Games Played</div>
              </div>
              <div className="stat-card win">
                <div className="stat-value">{statistics.gamesWon}</div>
                <div className="stat-label">Games Won</div>
              </div>
              <div className="stat-card lose">
                <div className="stat-value">{statistics.gamesLost}</div>
                <div className="stat-label">Games Lost</div>
              </div>
              <div className="stat-card percentage">
                <div className="stat-value">{winPercentage}%</div>
                <div className="stat-label">Win Rate</div>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>⚡ Performance</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{avgTime}</div>
                <div className="stat-label">Average Time</div>
              </div>
              <div className="stat-card streak">
                <div className="stat-value">{statistics.currentStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
              <div className="stat-card streak">
                <div className="stat-value">{statistics.bestStreak}</div>
                <div className="stat-label">Best Streak</div>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>🏆 Best Times</h3>
            <div className="best-times">
              {Object.entries(statistics.bestTime).map(([difficulty, time]) => (
                <div key={difficulty} className="best-time-item">
                  <span className="difficulty-name">
                    {getDifficultyDisplayName(difficulty as Difficulty)}
                  </span>
                  <span className="time-value">{formatTime(time)}</span>
                </div>
              ))}
              {Object.keys(statistics.bestTime).length === 0 && (
                <div className="no-times">No best times yet - win a game to see your records!</div>
              )}
            </div>
          </div>
        </div>

        <div className="statistics-footer">
          <button className="reset-stats-button" onClick={onReset}>
            🗑️ Reset All Statistics
          </button>
          <button className="close-stats-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;