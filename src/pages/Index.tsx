import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  PlayerData, 
  Quest, 
  Weapon, 
  Monster, 
  defaultWeapons, 
  defaultMonsters, 
  calculateLevelRequirement,
  addXP 
} from '../data/gameData';
import { toast } from 'sonner';

import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import QuestList from '../components/QuestList';
import WeaponShop from '../components/WeaponShop';
import MonsterArena from '../components/MonsterArena';
import ResetButton from '../components/ResetButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Game state using localStorage
  const [playerData, setPlayerData] = useLocalStorage<PlayerData>('rpg-player', {
    name: '',
    bio: '',
    instagram: '',
    level: 1,
    xp: 0,
    totalXp: 0,
    coins: 10, // Starting coins
  });

  const [quests, setQuests] = useLocalStorage<Quest[]>('rpg-quests', []);
  const [weapons, setWeapons] = useLocalStorage<Weapon[]>('rpg-weapons', defaultWeapons);
  const [monsters, setMonsters] = useLocalStorage<Monster[]>('rpg-monsters', defaultMonsters);

  // Handle XP gain with proper level progression
  const handleXPGain = (xpToAdd: number) => {
    const result = addXP(playerData.xp, playerData.level, xpToAdd);
    
    setPlayerData(prev => ({
      ...prev,
      level: result.newLevel,
      xp: result.currentLevelXP,
      totalXp: prev.totalXp + xpToAdd
    }));

    // Show level up notifications
    if (result.levelsGained > 0) {
      if (result.levelsGained === 1) {
        toast.success(
          `🎉 Level Up! You are now Level ${result.newLevel}!`,
          {
            duration: 4000,
            style: {
              background: 'var(--gradient-primary)',
              color: 'white',
              border: '1px solid hsl(var(--primary))',
            }
          }
        );
      } else {
        toast.success(
          `🚀 Epic! You gained ${result.levelsGained} levels! Now Level ${result.newLevel}!`,
          {
            duration: 5000,
            style: {
              background: 'var(--gradient-primary)',
              color: 'white',
              border: '1px solid hsl(var(--primary))',
            }
          }
        );
      }
    }
  };

  // Player data update
  const handleUpdatePlayer = (data: Partial<PlayerData>) => {
    setPlayerData(prev => ({ ...prev, ...data }));
  };

  // Quest management
  const handleAddQuest = (quest: Omit<Quest, 'id'>) => {
    const newQuest: Quest = {
      ...quest,
      id: Date.now().toString(),
    };
    setQuests(prev => [...prev, newQuest]);
    toast.success('New quest added to your journal!');
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    setQuests(prev => 
      prev.map(q => 
        q.id === questId ? { ...q, completed: true } : q
      )
    );

    // Add XP using the new system
    handleXPGain(quest.xp);
    
    // Add coins separately
    setPlayerData(prev => ({
      ...prev,
      coins: prev.coins + quest.coins
    }));

    toast.success(
      `Quest completed! +${quest.xp} XP, +${quest.coins} Coins`,
      {
        duration: 3000,
        style: {
          background: 'var(--gradient-gold)',
          color: 'black',
          border: '1px solid hsl(var(--gold))',
        }
      }
    );
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
    toast.info('Quest removed from journal');
  };

  const handleEditQuest = (questId: string, questData: Partial<Quest>) => {
    setQuests(prev => 
      prev.map(q => 
        q.id === questId ? { ...q, ...questData } : q
      )
    );
    toast.success('Quest updated!');
  };

  // Weapon management
  const handlePurchaseWeapon = (weaponId: string) => {
    const weapon = weapons.find(w => w.id === weaponId);
    if (!weapon || playerData.coins < weapon.cost) return;

    setWeapons(prev => 
      prev.map(w => 
        w.id === weaponId ? { ...w, purchased: true } : w
      )
    );

    setPlayerData(prev => ({
      ...prev,
      coins: prev.coins - weapon.cost
    }));

    toast.success(
      `${weapon.name} purchased! Ready for battle!`,
      {
        duration: 3000,
        style: {
          background: 'var(--gradient-magic)',
          color: 'white',
          border: '1px solid hsl(var(--magic))',
        }
      }
    );
  };

  const handleEquipWeapon = (weaponId: string) => {
    setWeapons(prev => 
      prev.map(w => ({
        ...w,
        active: w.id === weaponId
      }))
    );

    const weapon = weapons.find(w => w.id === weaponId);
    toast.success(`${weapon?.name} equipped!`);
  };

  // Monster battle
  const handleFightMonster = (monsterId: string) => {
    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) return;

    setMonsters(prev => 
      prev.map(m => 
        m.id === monsterId ? { ...m, defeated: true } : m
      )
    );

    // Add XP using the new system
    handleXPGain(monster.xpReward);
    
    // Add coins separately
    setPlayerData(prev => ({
      ...prev,
      coins: prev.coins + monster.coinReward
    }));

    toast.success(
      `${monster.name} defeated! +${monster.xpReward} XP, +${monster.coinReward} Coins`,
      {
        duration: 4000,
        style: {
          background: 'var(--gradient-primary)',
          color: 'white',
          border: '1px solid hsl(var(--primary))',
        }
      }
    );
  };

  // Reset game
  const handleResetGame = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            playerData={playerData}
            onUpdatePlayer={handleUpdatePlayer}
          />
        );
      case 'quests':
        return (
          <QuestList
            quests={quests}
            onAddQuest={handleAddQuest}
            onCompleteQuest={handleCompleteQuest}
            onDeleteQuest={handleDeleteQuest}
            onEditQuest={handleEditQuest}
          />
        );
      case 'shop':
        return (
          <WeaponShop
            weapons={weapons}
            playerData={playerData}
            onPurchaseWeapon={handlePurchaseWeapon}
            onEquipWeapon={handleEquipWeapon}
          />
        );
      case 'arena':
        return (
          <MonsterArena
            monsters={monsters}
            weapons={weapons}
            playerData={playerData}
            onFightMonster={handleFightMonster}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <ResetButton onReset={handleResetGame} />
    </div>
  );
};

export default Index;
