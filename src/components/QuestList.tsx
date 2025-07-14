import React, { useState } from 'react';
import { Plus, Edit2, Check, Trash2, Save, X } from 'lucide-react';
import { Quest, QuestCategory, Difficulty, questCategories, difficultyRewards, applyXpGainToPlayer } from '../data/gameData';

interface QuestListProps {
  quests: Quest[];
  onAddQuest: (quest: Omit<Quest, 'id'>) => void;
  onCompleteQuest: (questId: string) => void;
  onDeleteQuest: (questId: string) => void;
  onEditQuest: (questId: string, quest: Partial<Quest>) => void;
}

const QuestList: React.FC<QuestListProps> = ({
  quests,
  onAddQuest,
  onCompleteQuest,
  onDeleteQuest,
  onEditQuest
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<string | null>(null);
  const [newQuest, setNewQuest] = useState({
    name: '',
    category: 'Produktivitas' as QuestCategory,
    difficulty: 'Easy' as Difficulty,
  });
  const [editData, setEditData] = useState({
    name: '',
    category: 'Produktivitas' as QuestCategory,
    difficulty: 'Easy' as Difficulty,
  });

  const handleAddQuest = () => {
  if (!newQuest.name.trim()) return;
  
  const rewards = difficultyRewards[newQuest.difficulty];
  onAddQuest({
    name: newQuest.name,
    category: newQuest.category,
    difficulty: newQuest.difficulty,
    completed: false,
    xp: rewards.xp,
    coins: rewards.coins,
    createdAt: Date.now() // <-- Tambahkan timestamp
  });
  
  setNewQuest({
    name: '',
    category: 'Produktivitas',
    difficulty: 'Easy',
  });
  setShowAddForm(false);
};

  const handleEditStart = (quest: Quest) => {
    setEditingQuest(quest.id);
    setEditData({
      name: quest.name,
      category: quest.category,
      difficulty: quest.difficulty,
    });
  };

  const handleEditSave = (questId: string) => {
    const rewards = difficultyRewards[editData.difficulty];
    onEditQuest(questId, {
      ...editData,
      xp: rewards.xp,
      coins: rewards.coins,
    });
    setEditingQuest(null);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Boss': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case 'Produktivitas': return '⚡';
      case 'Tugas': return '📋';
      case 'Ibadah': return '🤲';
      case 'Belajar': return '📚';
      case 'Goals': return '🎯';
      case 'Kesehatan': return '💪';
      default: return '📜';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-decorative text-primary">Quest Journal</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-glow flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          <Plus size={18} />
          <span className="font-medieval">New Quest</span>
        </button>
      </div>

      {/* Add Quest Form */}
      {showAddForm && (
        <div className="rpg-card p-6">
          <h3 className="text-lg font-medieval text-primary mb-4">Create New Quest</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Quest Name</label>
              <input
                type="text"
                value={newQuest.name}
                onChange={(e) => setNewQuest({ ...newQuest, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter quest name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Category</label>
              <select
                value={newQuest.category}
                onChange={(e) => setNewQuest({ ...newQuest, category: e.target.value as QuestCategory })}
                className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {questCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medieval text-muted-foreground mb-2">Difficulty</label>
              <select
                value={newQuest.difficulty}
                onChange={(e) => setNewQuest({ ...newQuest, difficulty: e.target.value as Difficulty })}
                className="w-full p-3 rounded-lg bg-input border border-border text-foreground font-medieval focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Easy">Easy (10 XP / 5 Coins)</option>
                <option value="Medium">Medium (25 XP / 10 Coins)</option>
                <option value="Hard">Hard (50 XP / 25 Coins)</option>
                <option value="Boss">Boss (100 XP / 50 Coins)</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddQuest}
              className="btn-glow px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors font-medieval"
            >
              Create Quest
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors font-medieval"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quest List */}
      <div className="space-y-4">
        {quests.length === 0 ? (
          <div className="rpg-card p-8 text-center">
            <div className="text-4xl mb-2">📜</div>
            <p className="text-muted-foreground font-medieval">No quests yet. Create your first quest!</p>
          </div>
        ) : (
          
              [...quests]
      .sort((a, b) => {
        // 1. Prioritize incomplete quests
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        // 2. Sort by newest first
        return b.createdAt - a.createdAt;
      })
      .map((quest) => (
        <div
          key={quest.id}
          className={`rpg-card p-4 ${quest.completed ? 'opacity-60' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-2xl">{getCategoryIcon(quest.category)}</div>
                  
                  <div className="flex-1">
                    {editingQuest === quest.id ? (
                      <div className="grid md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="p-2 rounded bg-input border border-border text-foreground font-medieval"
                        />
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value as QuestCategory })}
                          className="p-2 rounded bg-input border border-border text-foreground font-medieval"
                        >
                          {questCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <select
                          value={editData.difficulty}
                          onChange={(e) => setEditData({ ...editData, difficulty: e.target.value as Difficulty })}
                          className="p-2 rounded bg-input border border-border text-foreground font-medieval"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Boss">Boss</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medieval text-lg ${quest.completed ? 'line-through' : ''}`}>
                            {quest.name}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs bg-secondary/50 text-secondary-foreground">
                            {quest.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`font-medieval ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty}
                          </span>
                          <span className="text-primary">⭐ {quest.xp} XP</span>
                          <span className="text-gold">💰 {quest.coins} Coins</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {editingQuest === quest.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(quest.id)}
                        className="p-2 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingQuest(null)}
                        className="p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      {!quest.completed && (
                        <>
                          <button
                            onClick={() => handleEditStart(quest)}
                            className="p-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onCompleteQuest(quest.id)}
                            className="btn-glow p-2 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onDeleteQuest(quest.id)}
                        className="p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestList;