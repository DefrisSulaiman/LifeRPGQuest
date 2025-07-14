import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { PlayerData, calculateLevelRequirement, getXpProgress } from '../data/gameData';

interface DashboardProps {
  playerData: PlayerData;
  onUpdatePlayer: (data: Partial<PlayerData>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ playerData, onUpdatePlayer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: playerData.name,
    bio: playerData.bio,
    instagram: playerData.instagram,
  });

  

  const handleSave = () => {
    onUpdatePlayer(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: playerData.name,
      bio: playerData.bio,
      instagram: playerData.instagram,
    });
    setIsEditing(false);
  };

  const { 
    level, 
    currentLevelXp, 
    xpNeededForNextLevel, 
    progressPercentage 
  } = getXpProgress(playerData.totalXp);


  // Sinkronkan level jika berbeda
  useEffect(() => {
    if (playerData.level !== level) {
      onUpdatePlayer({ level });
    }
  }, [level, playerData.level, onUpdatePlayer]);
  
  return (
    <div className="space-y-6">
      {/* Character Info Card */}
      <div className="rpg-card p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-decorative text-primary">Character Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-glow p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              <Edit2 size={18} />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-glow p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <Save size={18} />
              </button>
              <button
                onClick={handleCancel}
                className="btn-glow p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Character Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your character name"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="font-medieval text-lg">{playerData.name || 'Unknown Hero'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us about your character..."
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border border-border min-h-[80px]">
                  <span className="font-medieval">{playerData.bio || 'A mysterious adventurer...'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Instagram</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.instagram}
                  onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="@yourusername"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="font-medieval">{playerData.instagram || '@adventurer'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Level and XP */}
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-primary/20 border-2 border-primary mb-4">
                <span className="text-3xl font-decorative text-primary">Lv. {playerData.level}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medieval">
                  <span>XP Progress</span>
                  <div 
                    className="xp-progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <span>{currentLevelXp} / {xpNeededForNextLevel}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="progress-glow h-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${progressPercentage}%`,
                      backgroundColor: progressPercentage >= 100 ? '#f59e0b' : '#4ade80'
                    }}
                  ></div>
                </div>
                {progressPercentage >= 100 && (
                  <div className="text-xs text-yellow-500 animate-pulse">
                    Level Up Available!
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rpg-card p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-lg font-decorative text-gold">{playerData.coins}</div>
                <div className="text-xs font-medieval text-muted-foreground">Coins</div>
              </div>
              
              <div className="rpg-card p-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-lg font-decorative text-primary">{playerData.totalXp}</div>
                <div className="text-xs font-medieval text-muted-foreground">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;