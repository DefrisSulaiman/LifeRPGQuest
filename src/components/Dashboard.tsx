import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Save, X, Camera } from 'lucide-react';
import { PlayerData, calculateLevelRequirement, getXpProgress } from '../data/gameData';

interface DashboardProps {
  playerData: PlayerData;
  onUpdatePlayer: (data: Partial<PlayerData>) => void;
  completedQuestsCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  playerData, 
  onUpdatePlayer,
  completedQuestsCount 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: playerData.name,
    bio: playerData.bio,
    instagram: playerData.instagram,
    avatar: playerData.avatar || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk menangani perubahan avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan (JPEG, PNG, etc.)');
      return;
    }

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    // Baca file sebagai URL data
    const avatarUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });

    // Update state dengan URL gambar baru
    setEditData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));

  } catch (error) {
    console.error('Error uploading avatar:', error);
    alert('Terjadi kesalahan saat mengupload avatar');
  } finally {
    // Reset input file untuk mengizinkan upload file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

  const handleSave = () => {
  // Pastikan semua data yang diperlukan disimpan
  const updatedData: Partial<PlayerData> = {
    name: editData.name,
    bio: editData.bio,
    instagram: editData.instagram,
  };

  // Hanya update avatar jika ada perubahan
  if (editData.avatar && editData.avatar !== playerData.avatar) {
    updatedData.avatar = editData.avatar;
  }

  onUpdatePlayer(updatedData);
  setIsEditing(false);
};

  const handleCancel = () => {
    setEditData({
      name: playerData.name,
      bio: playerData.bio,
      instagram: playerData.instagram,
      avatar: playerData.avatar || ''
    });
    setIsEditing(false);
  };

  const { 
    level, 
    currentLevelXp, 
    xpNeededForNextLevel, 
    progressPercentage 
  } = getXpProgress(playerData.totalXp);

  // Calculate dynamic stats based on player progress
  const calculatedStats = {
    strength: Math.min(Math.floor(completedQuestsCount * 5), 100),
    intelligence: Math.min(Math.floor(playerData.totalXp / 20), 100),
    dexterity: Math.min(playerData.streak * 10, 100),
    stamina: Math.min(Math.floor(completedQuestsCount * 3), 100),
  };

  // Generate achievements based on progress
  const achievements = [
    { 
      id: 1, 
      name: 'First Quest', 
      emoji: '🏁', 
      description: 'Complete your first quest', 
      unlocked: completedQuestsCount >= 1 
    },
    { 
      id: 2, 
      name: '5-Day Streak', 
      emoji: '🔥', 
      description: 'Complete quests for 5 days straight', 
      unlocked: playerData.streak >= 5 
    },
    { 
      id: 3, 
      name: 'Task Master', 
      emoji: '🎯', 
      description: 'Complete 10 quests', 
      unlocked: completedQuestsCount >= 10 
    },
    { 
      id: 4, 
      name: 'Veteran', 
      emoji: '🛡️', 
      description: 'Complete 50 quests', 
      unlocked: completedQuestsCount >= 50 
    },
    { 
      id: 5, 
      name: 'Rich Adventurer', 
      emoji: '💰', 
      description: 'Earn 500 coins', 
      unlocked: playerData.coins >= 500 
    },
  ];

  // Generate recent activities
  const recentActivities = [
    ...(playerData.recentActivities || []),
    ...(playerData.level > (playerData.previousLevel || 0) ? [{
      emoji: '🎉',
      description: `Reached level ${playerData.level}`,
      timestamp: 'Today'
    }] : [])
  ].slice(0, 5);

  // Sync level if different
  useEffect(() => {
    if (playerData.level !== level) {
      onUpdatePlayer({ level });
    }
  }, [level, playerData.level, onUpdatePlayer]);
  
  return (
    <div className="space-y-6">
      {/* New Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-decorative text-primary mb-3">
          {playerData.name || 'Adventurer'}'s Quest Dashboard
        </h1>
        <p className="text-lg font-medieval text-muted-foreground max-w-2xl mx-auto">
          Track your progress, complete quests, and level up your character in this RPG-style productivity journey.
        </p>
      </div>

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
            {/* Character Avatar with upload feature */}
           <div className="character-avatar relative group">
  <div className="relative w-32 h-32 mx-auto mb-4 border-2 border-gold rounded-full overflow-hidden bg-muted/30 flex items-center justify-center">
    {editData.avatar ? (
      <img 
        src={editData.avatar} 
        alt="Character Avatar"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,...'; // Fallback
        }}
      />
    ) : playerData.avatar ? (
      <img 
        src={playerData.avatar} 
        alt="Character Avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-4xl">🧙‍♂️</span>
    )}
    
    {isEditing && (
      <>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          id="avatar-upload" // Tambahkan ID
        />
        <label 
          htmlFor="avatar-upload" // Gunakan label untuk trigger input
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
        >
          <Camera className="text-white" size={24} />
          <span className="sr-only">Upload avatar</span>
        </label>
      </>
    )}
  </div>
  {isEditing && (
    <p className="text-xs text-center text-muted-foreground">
      Klik avatar untuk mengubah foto
    </p>
  )}
</div>


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
<div className="text-center relative">
  {/* Animated Level Badge */}
  <div 
    className={`inline-block p-4 rounded-full bg-primary/20 border-2 border-primary mb-4 
    transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
    relative overflow-hidden ${progressPercentage >= 100 ? 'animate-pulse' : ''}`}
  >
    {/* Pulsing glow effect when ready to level up */}
    {progressPercentage >= 100 && (
      <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-pulse"></div>
    )}
    
    {/* Shining particles animation */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white/50 rounded-full"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `xp-level-float 3s linear ${i * 2}s infinite`,
            opacity: 0.7
          }}
        ></div>
      ))}
    </div>
    
    <span className="text-3xl font-decorative text-primary relative z-10">
      Lv. {playerData.level}
      {progressPercentage >= 100 && (
        <span className="absolute -top-2 -right-2 text-yellow-400 text-lg animate-bounce">↑</span>
      )}
    </span>
  </div>
  
  {/* XP Progress Section */}
  <div className="space-y-2">
    <div className="flex justify-between text-sm font-medieval">
      <span>XP Progress</span>
      <span className="font-bold">
        {currentLevelXp} <span className="text-muted-foreground">/ {xpNeededForNextLevel}</span>
      </span>
    </div>
    
    {/* Animated XP Bar */}
    <div 
      className="w-full bg-muted/30 rounded-full h-3 overflow-hidden relative xp-progress-container"
      title={`${progressPercentage.toFixed(1)}% to next level`}
    >
      {/* Glowing progress bar with gradient */}
      <div 
        className="h-full transition-all duration-500 ease-out relative"
        style={{ 
          width: `${progressPercentage}%`,
          background: progressPercentage >= 100 
            ? 'linear-gradient(90deg, rgba(245,158,11,0.9) 0%, rgba(250,204,21,0.9) 100%)'
            : 'linear-gradient(90deg, rgba(74,222,128,0.9) 0%, rgba(52,211,153,0.9) 100%)',
          boxShadow: `0 0 ${progressPercentage >= 100 ? '10px' : '5px'} ${progressPercentage >= 100 ? 'rgba(245, 158, 11, 0.6)' : 'rgba(74, 222, 128, 0.4)'}`
        }}
      >
        {/* Scoped shimmer effect */}
        <div 
          className="absolute inset-0 overflow-hidden xp-progress-shimmer"
        ></div>
        
        {/* Scoped moving particles */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-0.5 bg-white/40 xp-progress-particle"
            style={{
              left: `${10 + i * 30}%`,
            }}
          ></div>
        ))}
      </div>
      
      {/* XP milestones markers */}
      <div className="absolute inset-0 flex justify-between px-1">
        {[25, 50, 75].map((milestone) => (
          <div 
            key={milestone}
            className={`h-full w-0.5 ${progressPercentage >= milestone ? 'bg-white/50' : 'bg-black/20'}`}
          ></div>
        ))}
      </div>
      
    </div>
    
    {/* Level Up Indicator */}
    {progressPercentage >= 100 ? (
      <div className="flex items-center justify-center space-x-1">
        <span className="text-xs text-yellow-500 animate-pulse font-bold">
          LEVEL UP READY!
        </span>
        <svg 
          className="w-4 h-4 text-yellow-500 animate-bounce"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    ) : (
      <div className="text-xs text-muted-foreground">
        {xpNeededForNextLevel - currentLevelXp} XP to next level
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

              <div className="rpg-card p-3 text-center">
                <div className="text-xl mb-1">⚔️</div>
                <div className="text-lg font-decorative">{completedQuestsCount || 0}</div>
                <div className="text-xs font-medieval text-muted-foreground">Quests Done</div>
              </div>
              
              <div className="rpg-card p-3 text-center">
                <div className="text-xl mb-1">🔥</div>
                <div className="text-lg font-decorative">{playerData.streak || 0}</div>
                <div className="text-xs font-medieval text-muted-foreground">Day Streak</div>
              </div>
            </div>

            {/* Equipment Slots */}
            <div className="rpg-card p-4 mt-4">
              <h3 className="font-decorative text-center mb-2">Equipment <span className="text-red-500">(Under Development)</span></h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {['weapon', 'armor', 'helmet', 'accessory'].map((slot) => (
                  <div key={slot} className="equipment-slot">
                    <div className="w-10 h-10 mx-auto bg-muted/30 rounded-lg flex items-center justify-center mb-1">
                      {playerData.equipment?.[slot]?.emoji || '❔'}
                    </div>
                    <span className="text-xs font-medieval capitalize">{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
                
      {/* Quest Log */}
      <div className="rpg-card p-6">
        <h2 className="text-2xl font-decorative text-primary mb-4">Quest Log</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start border-b border-border/50 pb-2">
              <div className="mr-3 text-muted-foreground">{activity.emoji}</div>
              <div>
                <p className="font-medieval">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attributes Section */}
      <div className="rpg-card p-6">
        <h2 className="text-2xl font-decorative text-primary mb-4">
          Attributes <span className="text-red-500">(Under Development)</span>
        </h2>
        <div className="space-y-4">
          {Object.entries(calculatedStats).map(([stat, value]) => (
            <div key={stat}>
              <div className="flex justify-between text-sm font-medieval mb-1">
                <span className="capitalize">{stat}</span>
                <span>{value}/100</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="rpg-card p-6">
        <h2 className="text-2xl font-decorative text-primary mb-4">Achievements <span className="text-red-500">(Under Development)</span></h2>
        <div className="flex flex-wrap gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-badge ${achievement.unlocked ? '' : 'opacity-40'}`}
              title={achievement.description}
            >
              <div className={`w-12 h-12 rounded-full ${achievement.unlocked ? 'bg-yellow-500/20' : 'bg-muted/30'} flex items-center justify-center`}>
                <span className="text-xl">{achievement.emoji}</span>
              </div>
              <span className="text-xs font-medieval block mt-1 text-center">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      
    </div>
  );
};

export default Dashboard;