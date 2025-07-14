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

export const defaultWeapons: Weapon[] = [
  { id: '1', name: 'Wooden Sword', cost: 20, levelRequired: 1, purchased: false, active: false, icon: '⚔️' },
  { id: '2', name: 'Iron Blade', cost: 50, levelRequired: 3, purchased: false, active: false, icon: '🗡️' },
  { id: '3', name: 'Magic Staff', cost: 100, levelRequired: 5, purchased: false, active: false, icon: '🪄' },
  { id: '4', name: 'Dragon Sword', cost: 200, levelRequired: 8, purchased: false, active: false, icon: '⚡' },
  { id: '5', name: 'Legendary Blade', cost: 500, levelRequired: 15, purchased: false, active: false, icon: '🔥' },
];

export const defaultMonsters: Monster[] = [
  { id: '1', name: 'Goblin', levelRequired: 1, weaponRequired: '1', defeated: false, xpReward: 30, coinReward: 15, icon: '👹' },
  { id: '2', name: 'Orc Warrior', levelRequired: 3, weaponRequired: '2', defeated: false, xpReward: 60, coinReward: 30, icon: '👺' },
  { id: '3', name: 'Dark Wizard', levelRequired: 5, weaponRequired: '3', defeated: false, xpReward: 120, coinReward: 60, icon: '🧙‍♂️' },
  { id: '4', name: 'Ancient Dragon', levelRequired: 8, weaponRequired: '4', defeated: false, xpReward: 250, coinReward: 125, icon: '🐉' },
  { id: '5', name: 'Shadow Lord', levelRequired: 15, weaponRequired: '5', defeated: false, xpReward: 500, coinReward: 250, icon: '💀' },
];