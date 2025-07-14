import React, { useState } from 'react';
import { Sword, Lock, Trophy } from 'lucide-react';
import { Monster, PlayerData, Weapon } from '../data/gameData';

interface MonsterArenaProps {
  monsters: Monster[];
  weapons: Weapon[];
  playerData: PlayerData;
  onFightMonster: (monsterId: string) => void;
}

const MonsterArena: React.FC<MonsterArenaProps> = ({
  monsters,
  weapons,
  playerData,
  onFightMonster
}) => {
  const [fightingMonster, setFightingMonster] = useState<string | null>(null);

  const canFight = (monster: Monster) => {
    if (monster.defeated) return false;
    if (playerData.level < monster.levelRequired) return false;
    
    const requiredWeapon = weapons.find(w => w.id === monster.weaponRequired);
    return requiredWeapon?.active;
  };

  const getRequiredWeaponName = (weaponId: string) => {
    const weapon = weapons.find(w => w.id === weaponId);
    return weapon?.name || 'Unknown Weapon';
  };

  const handleFight = async (monsterId: string) => {
    setFightingMonster(monsterId);
    
    // Simulate battle animation
    setTimeout(() => {
      onFightMonster(monsterId);
      setFightingMonster(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-decorative text-primary mb-2">Monster Arena</h2>
        <p className="text-muted-foreground font-medieval">Face legendary beasts and claim their treasures</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className={`rpg-card p-6 text-center relative overflow-hidden ${
              monster.defeated ? 'opacity-60' : ''
            }`}
          >
            {/* Monster Icon with Animation */}
            <div className="text-6xl mb-4 float-animation">
              {monster.icon}
            </div>

            {/* Monster Info */}
            <h3 className="text-xl font-decorative text-primary mb-2">
              {monster.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">XP Reward:</span>
                <span className="text-primary font-medieval">⭐ {monster.xpReward}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">Coin Reward:</span>
                <span className="text-gold font-medieval">💰 {monster.coinReward}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">Level Required:</span>
                <span className="text-primary font-medieval">Lv. {monster.levelRequired}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">Weapon Needed:</span>
                <span className="text-accent font-medieval">{getRequiredWeaponName(monster.weaponRequired)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {monster.defeated ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medieval">
                  <Trophy size={14} />
                  <span>Defeated</span>
                </div>
              ) : playerData.level < monster.levelRequired ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-sm font-medieval">
                  <Lock size={14} />
                  <span>Level {monster.levelRequired} Required</span>
                </div>
              ) : !weapons.find(w => w.id === monster.weaponRequired)?.active ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-sm font-medieval">
                  <Lock size={14} />
                  <span>Weapon Required</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medieval">
                  <Sword size={14} />
                  <span>Ready to Fight!</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div>
              {monster.defeated ? (
                <div className="text-sm font-medieval text-green-400 magic-glow">
                  🏆 Victory Achieved 🏆
                </div>
              ) : fightingMonster === monster.id ? (
                <div className="btn-glow px-4 py-2 rounded-lg bg-red-600/20 text-red-400 font-medieval">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin">⚔️</div>
                    <span>Fighting...</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => canFight(monster) && handleFight(monster.id)}
                  disabled={!canFight(monster)}
                  className={`w-full px-4 py-2 rounded-lg font-medieval transition-colors ${
                    canFight(monster)
                      ? 'btn-glow bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Sword size={16} />
                    <span>{canFight(monster) ? 'FIGHT!' : 'Cannot Fight'}</span>
                  </div>
                </button>
              )}
            </div>

            {/* Battle animation overlay */}
            {fightingMonster === monster.id && (
              <div className="absolute inset-0 bg-red-600/10 rounded-lg pointer-events-none animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl animate-bounce">⚔️</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Battle Instructions */}
      <div className="rpg-card p-4 text-center">
        <p className="text-sm font-medieval text-muted-foreground">
          Equip the required weapon and reach the minimum level to challenge monsters. 
          Victory grants experience points and coins!
        </p>
      </div>
    </div>
  );
};

export default MonsterArena;