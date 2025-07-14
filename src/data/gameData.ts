export type QuestCategory = 'Produktivitas' | 'Tugas' | 'Ibadah' | 'Belajar' | 'Goals' | 'Kesehatan';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Boss';

export interface Quest {
  id: string;
  name: string;
  category: QuestCategory;
  difficulty: Difficulty;
  completed: boolean;
  xp: number;
  coins: number;
  createdAt: number;
}

export interface Weapon {
  id: string;
  name: string;
  cost: number;
  levelRequired: number;
  purchased: boolean;
  active: boolean;
  icon: string;
}

export interface Monster {
  id: string;
  name: string;
  levelRequired: number;
  weaponRequired: string;
  defeated: boolean;
  xpReward: number;
  coinReward: number;
  icon: string;
}

export interface PlayerData {
  name: string;
  bio: string;
  instagram: string;
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
}

export const questCategories: QuestCategory[] = [
  'Produktivitas', 'Tugas', 'Ibadah', 'Belajar', 'Goals', 'Kesehatan'
];

export const difficultyRewards = {
  Easy: { xp: 10, coins: 5 },
  Medium: { xp: 25, coins: 10 },
  Hard: { xp: 50, coins: 25 },
  Boss: { xp: 100, coins: 50 }
};


export const calculateLevelRequirement = (level: number): number => {
  return 100 + (level - 1) * 50;
};

export const getXpProgress = (totalXp: number) => {
  let level = 1;
  let xpNeeded = calculateLevelRequirement(level);
  let accumulatedXp = 0;

  // Cari level saat ini
  while (totalXp >= accumulatedXp + xpNeeded) {
    accumulatedXp += xpNeeded;
    level++;
    xpNeeded = calculateLevelRequirement(level);
  }

  const currentLevelXp = totalXp - accumulatedXp;
  const progress = (currentLevelXp / xpNeeded) * 100;

  return {
    level,
    currentLevelXp, // XP di level saat ini (akan reset ke 0 tiap level up)
    xpNeededForNextLevel: xpNeeded,
    progressPercentage: Math.min(100, progress) // Pastikan tidak melebihi 100%
  };
};

export const applyXpGainToPlayer = (
  player: PlayerData,
  gainedXp: number
): PlayerData => {
  const newTotalXp = player.totalXp + gainedXp;
  const { level, currentLevelXp } = getXpProgress(newTotalXp);

  return {
    ...player,
    totalXp: newTotalXp,
    xp: currentLevelXp, // Gunakan currentLevelXp yang sudah di-reset
    level: level
  };
};

export const defaultWeapons: Weapon[] = [
  // Starter weapons (1-5)
  { id: '1', name: 'Wooden Sword', cost: 20, levelRequired: 1, purchased: false, active: false, icon: '⚔️' },
  { id: '2', name: 'Iron Blade', cost: 50, levelRequired: 3, purchased: false, active: false, icon: '🗡️' },
  { id: '3', name: 'Magic Staff', cost: 100, levelRequired: 5, purchased: false, active: false, icon: '🪄' },
  { id: '4', name: 'Dragon Sword', cost: 200, levelRequired: 8, purchased: false, active: false, icon: '⚡' },
  { id: '5', name: 'Legendary Blade', cost: 500, levelRequired: 15, purchased: false, active: false, icon: '🔥' },

  // New weapons (6-35)
  { id: '6', name: 'Silver Dagger', cost: 75, levelRequired: 4, purchased: false, active: false, icon: '🔪' },
  { id: '7', name: 'Battle Axe', cost: 120, levelRequired: 6, purchased: false, active: false, icon: '🪓' },
  { id: '8', name: 'Crystal Bow', cost: 180, levelRequired: 7, purchased: false, active: false, icon: '🏹' },
  { id: '9', name: 'Phoenix Wand', cost: 250, levelRequired: 9, purchased: false, active: false, icon: '🔥' },
  { id: '10', name: 'Thunder Hammer', cost: 300, levelRequired: 10, purchased: false, active: false, icon: '⚡' },
  { id: '11', name: 'Vampire Fang', cost: 350, levelRequired: 11, purchased: false, active: false, icon: '🦇' },
  { id: '12', name: 'Moonlight Scythe', cost: 400, levelRequired: 12, purchased: false, active: false, icon: '🌙' },
  { id: '13', name: 'Titan Gauntlets', cost: 450, levelRequired: 13, purchased: false, active: false, icon: '👊' },
  { id: '14', name: 'Necronomicon', cost: 550, levelRequired: 14, purchased: false, active: false, icon: '📖' },
  { id: '15', name: 'Celestial Spear', cost: 600, levelRequired: 16, purchased: false, active: false, icon: '✨' },
  { id: '16', name: 'Abyssal Whip', cost: 700, levelRequired: 18, purchased: false, active: false, icon: '🌀' },
  { id: '17', name: 'Golem Fists', cost: 800, levelRequired: 20, purchased: false, active: false, icon: '🗿' },
  { id: '18', name: 'Hydra Bow', cost: 900, levelRequired: 22, purchased: false, active: false, icon: '🐍' },
  { id: '19', name: 'Mjolnir', cost: 1000, levelRequired: 25, purchased: false, active: false, icon: '⚡' },
  { id: '20', name: 'Excalibur', cost: 1200, levelRequired: 30, purchased: false, active: false, icon: '🛡️' },
  { id: '21', name: 'Doombringer', cost: 1500, levelRequired: 35, purchased: false, active: false, icon: '💀' },
  { id: '22', name: 'Starburst Staff', cost: 1800, levelRequired: 40, purchased: false, active: false, icon: '🌟' },
  { id: '23', name: 'Frostmourne', cost: 2000, levelRequired: 45, purchased: false, active: false, icon: '❄️' },
  { id: '24', name: 'Dragonbone Hammer', cost: 2500, levelRequired: 50, purchased: false, active: false, icon: '🦴' },
  { id: '25', name: 'Aether Blade', cost: 3000, levelRequired: 55, purchased: false, active: false, icon: '🌌' },
  { id: '26', name: 'Oblivion Orb', cost: 3500, levelRequired: 60, purchased: false, active: false, icon: '🟣' },
  { id: '27', name: 'Ragnarok Axe', cost: 4000, levelRequired: 65, purchased: false, active: false, icon: '🌋' },
  { id: '28', name: 'Seraphic Bow', cost: 4500, levelRequired: 70, purchased: false, active: false, icon: '👼' },
  { id: '29', name: 'Chaos Scythe', cost: 5000, levelRequired: 75, purchased: false, active: false, icon: '☯️' },
  { id: '30', name: 'Infinity Edge', cost: 6000, levelRequired: 80, purchased: false, active: false, icon: '∞' },
  { id: '31', name: 'Divine Rapier', cost: 8000, levelRequired: 85, purchased: false, active: false, icon: '✝️' },
  { id: '32', name: 'Cosmic Staff', cost: 10000, levelRequired: 90, purchased: false, active: false, icon: '🌠' },
  { id: '33', name: 'Apocalypse Blade', cost: 12000, levelRequired: 95, purchased: false, active: false, icon: '☄️' },
  { id: '34', name: 'Eternity Shield', cost: 15000, levelRequired: 100, purchased: false, active: false, icon: '⏳' },
  { id: '35', name: 'Omniscient Tome', cost: 20000, levelRequired: 105, purchased: false, active: false, icon: '📜' }
];

export const defaultMonsters: Monster[] = [
  // Original monsters (1-5)
  { id: '1', name: 'Goblin', levelRequired: 1, weaponRequired: '1', defeated: false, xpReward: 30, coinReward: 15, icon: '👹' },
  { id: '2', name: 'Orc Warrior', levelRequired: 3, weaponRequired: '2', defeated: false, xpReward: 60, coinReward: 30, icon: '👺' },
  { id: '3', name: 'Dark Wizard', levelRequired: 5, weaponRequired: '3', defeated: false, xpReward: 120, coinReward: 60, icon: '🧙‍♂️' },
  { id: '4', name: 'Ancient Dragon', levelRequired: 8, weaponRequired: '4', defeated: false, xpReward: 250, coinReward: 125, icon: '🐉' },
  { id: '5', name: 'Shadow Lord', levelRequired: 15, weaponRequired: '5', defeated: false, xpReward: 500, coinReward: 250, icon: '💀' },

  // New monsters (6-35)
  { id: '6', name: 'Forest Troll', levelRequired: 2, weaponRequired: '1', defeated: false, xpReward: 45, coinReward: 20, icon: '🧌' },
  { id: '7', name: 'Cave Spider', levelRequired: 4, weaponRequired: '2', defeated: false, xpReward: 75, coinReward: 35, icon: '🕷️' },
  { id: '8', name: 'Skeleton Knight', levelRequired: 6, weaponRequired: '3', defeated: false, xpReward: 150, coinReward: 70, icon: '💀' },
  { id: '9', name: 'Harpy', levelRequired: 7, weaponRequired: '6', defeated: false, xpReward: 180, coinReward: 85, icon: '🦅' },
  { id: '10', name: 'Minotaur', levelRequired: 9, weaponRequired: '7', defeated: false, xpReward: 300, coinReward: 140, icon: '🐮' },
  { id: '11', name: 'Chimera', levelRequired: 11, weaponRequired: '8', defeated: false, xpReward: 400, coinReward: 190, icon: '🦁' },
  { id: '12', name: 'Basilisk', levelRequired: 13, weaponRequired: '9', defeated: false, xpReward: 550, coinReward: 260, icon: '🐍' },
  { id: '13', name: 'Frost Giant', levelRequired: 15, weaponRequired: '10', defeated: false, xpReward: 700, coinReward: 330, icon: '❄️' },
  { id: '14', name: 'Lich', levelRequired: 17, weaponRequired: '11', defeated: false, xpReward: 900, coinReward: 420, icon: '🧟' },
  { id: '15', name: 'Kraken', levelRequired: 20, weaponRequired: '12', defeated: false, xpReward: 1200, coinReward: 550, icon: '🐙' },
  { id: '16', name: 'Phoenix', levelRequired: 22, weaponRequired: '13', defeated: false, xpReward: 1500, coinReward: 700, icon: '🔥' },
  { id: '17', name: 'Behemoth', levelRequired: 25, weaponRequired: '14', defeated: false, xpReward: 2000, coinReward: 900, icon: '🐗' },
  { id: '18', name: 'Leviathan', levelRequired: 28, weaponRequired: '15', defeated: false, xpReward: 2500, coinReward: 1100, icon: '🐋' },
  { id: '19', name: 'Cerberus', levelRequired: 30, weaponRequired: '16', defeated: false, xpReward: 3000, coinReward: 1300, icon: '🐕' },
  { id: '20', name: 'Archdemon', levelRequired: 35, weaponRequired: '17', defeated: false, xpReward: 4000, coinReward: 1800, icon: '😈' },
  { id: '21', name: 'Titan', levelRequired: 40, weaponRequired: '18', defeated: false, xpReward: 5000, coinReward: 2200, icon: '🏔️' },
  { id: '22', name: 'Elder Dragon', levelRequired: 45, weaponRequired: '19', defeated: false, xpReward: 6500, coinReward: 2900, icon: '🐲' },
  { id: '23', name: 'Cthulhu', levelRequired: 50, weaponRequired: '20', defeated: false, xpReward: 8000, coinReward: 3500, icon: '🐙' },
  { id: '24', name: 'Death Knight', levelRequired: 55, weaponRequired: '21', defeated: false, xpReward: 10000, coinReward: 4500, icon: '⚔️' },
  { id: '25', name: 'Solar Serpent', levelRequired: 60, weaponRequired: '22', defeated: false, xpReward: 12000, coinReward: 5500, icon: '🐍' },
  { id: '26', name: 'Voidwalker', levelRequired: 65, weaponRequired: '23', defeated: false, xpReward: 15000, coinReward: 6800, icon: '🌑' },
  { id: '27', name: 'Celestial Guardian', levelRequired: 70, weaponRequired: '24', defeated: false, xpReward: 18000, coinReward: 8000, icon: '👼' },
  { id: '28', name: 'Ragnarok Wolf', levelRequired: 75, weaponRequired: '25', defeated: false, xpReward: 22000, coinReward: 10000, icon: '🐺' },
  { id: '29', name: 'Time Wraith', levelRequired: 80, weaponRequired: '26', defeated: false, xpReward: 26000, coinReward: 12000, icon: '⏳' },
  { id: '30', name: 'Infinity Hydra', levelRequired: 85, weaponRequired: '27', defeated: false, xpReward: 30000, coinReward: 14000, icon: '🐉' },
  { id: '31', name: 'Cosmic Juggernaut', levelRequired: 90, weaponRequired: '28', defeated: false, xpReward: 35000, coinReward: 16000, icon: '🌌' },
  { id: '32', name: 'Omnipotent Eye', levelRequired: 95, weaponRequired: '29', defeated: false, xpReward: 40000, coinReward: 18000, icon: '👁️' },
  { id: '33', name: 'Eclipse Titan', levelRequired: 100, weaponRequired: '30', defeated: false, xpReward: 50000, coinReward: 22000, icon: '🌑' },
  { id: '34', name: 'Singularity Beast', levelRequired: 105, weaponRequired: '31', defeated: false, xpReward: 60000, coinReward: 25000, icon: '🌀' },
  { id: '35', name: 'The World Ender', levelRequired: 110, weaponRequired: '32', defeated: false, xpReward: 75000, coinReward: 30000, icon: '💥' }
];