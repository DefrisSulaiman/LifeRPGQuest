import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    
    // Dramatic animation delay
    setTimeout(() => {
      onReset();
      setIsResetting(false);
      setShowConfirm(false);
    }, 1500);
  };

  return (
    <>
      {/* Reset Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowConfirm(true)}
          className="p-3 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors shadow-lg backdrop-blur-md border border-red-600/30"
          title="Reset Game"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rpg-card p-6 max-w-md w-full text-center">
            <div className="text-4xl mb-4 animate-bounce">⚠️</div>
            <h3 className="text-xl font-decorative text-red-400 mb-4">
              Reset Game Data?
            </h3>
            <p className="text-muted-foreground font-medieval mb-6">
              This will permanently delete all your progress including:
            </p>
            <div className="text-left space-y-2 mb-6 bg-muted/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm font-medieval">
                <span>•</span>
                <span>Character profile and stats</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medieval">
                <span>•</span>
                <span>All quests and progress</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medieval">
                <span>•</span>
                <span>Purchased weapons</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medieval">
                <span>•</span>
                <span>Defeated monsters</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medieval">
                <span>•</span>
                <span>XP, Level, and Coins</span>
              </div>
            </div>
            
            {isResetting ? (
              <div className="btn-glow px-6 py-3 rounded-lg bg-red-600/20 text-red-400 font-medieval">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin">🌀</div>
                  <span>Resetting Reality...</span>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="flex-1 btn-glow px-4 py-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors font-medieval"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle size={16} />
                    <span>Yes, Reset Everything</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors font-medieval"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResetButton;