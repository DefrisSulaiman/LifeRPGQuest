import React, { useState } from 'react';
import { Plus, Edit2, Check, Trash2, Save, X, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Quest, QuestCategory, Difficulty, questCategories, difficultyRewards } from '../data/gameData';

interface QuestListProps {
  quests: Quest[];
  onAddQuest: (quest: Omit<Quest, 'id'>) => void;
  onCompleteQuest: (questId: string, xp: number, coins: number) => void;
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
  const [newQuest, setNewQuest] = useState<Omit<Quest, 'id' | 'completed' | 'xp' | 'coins' | 'createdAt'>>({
    name: '',
    category: 'Produktivitas',
    difficulty: 'Easy',
  });
  const [editData, setEditData] = useState<Partial<Quest>>({
    name: '',
    category: 'Produktivitas',
    difficulty: 'Easy',
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
      createdAt: Date.now()
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
    const rewards = difficultyRewards[editData.difficulty || 'Easy'];
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
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus size={18} />
          <span className="font-medieval">New Quest</span>
        </Button>
      </div>

      {/* Add Quest Form */}
      {showAddForm && (
        <div className="rpg-card p-6">
          <h3 className="text-lg font-medieval text-primary mb-4">Create New Quest</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="block text-sm font-medieval text-muted-foreground mb-2">
                Quest Name
              </Label>
              <Input
                type="text"
                value={newQuest.name}
                onChange={(e) => setNewQuest({ ...newQuest, name: e.target.value })}
                className="font-medieval"
                placeholder="Enter quest name..."
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medieval text-muted-foreground mb-2">
                Category
              </Label>
              <Select
                value={newQuest.category}
                onValueChange={(value) => setNewQuest({ ...newQuest, category: value as QuestCategory })}
              >
                <SelectTrigger className="font-medieval">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {questCategories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="font-medieval"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medieval text-muted-foreground mb-2">
                Difficulty
              </Label>
              <Select
                value={newQuest.difficulty}
                onValueChange={(value) => setNewQuest({ ...newQuest, difficulty: value as Difficulty })}
              >
                <SelectTrigger className="font-medieval">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="font-medieval">
                  <SelectItem value="Easy" className="text-green-400">
                    <div className="flex justify-between w-full">
                      <span>Easy</span>
                      <span className="text-muted-foreground/80 text-xs">10 XP • 5 Coin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium" className="text-yellow-400">
                    <div className="flex justify-between w-full">
                      <span>Medium</span>
                      <span className="text-muted-foreground/80 text-xs">25 XP • 10 Coin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Hard" className="text-orange-400">
                    <div className="flex justify-between w-full">
                      <span>Hard</span>
                      <span className="text-muted-foreground/80 text-xs">50 XP • 25 Coin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Boss" className="text-red-400">
                    <div className="flex justify-between w-full">
                      <span>Boss</span>
                      <span className="text-muted-foreground/80 text-xs">100 XP • 50 Coin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleAddQuest} className="font-medieval">
              Create Quest
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="font-medieval"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Quest List */}
      <div className="space-y-6">
        {quests.length === 0 ? (
          <div className="rpg-card p-8 text-center">
            <div className="text-4xl mb-2">📜</div>
            <p className="text-muted-foreground font-medieval">No quests yet. Create your first quest!</p>
          </div>
        ) : (
          <>
            {/* Active Quests Section */}
            <div className="space-y-6">
              {/* Active Quests Section */}
              <div className="space-y-4">
                <h3 className="font-medieval text-lg text-primary mb-2">
                  Active Quests ({quests.filter(q => !q.completed).length})
                </h3>
                
                {quests
                  .filter(quest => !quest.completed)
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((quest) => (
                    <div key={quest.id} className="rpg-card p-4 border-l-4 border-l-blue-500">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{getCategoryIcon(quest.category)}</div>
                        <div className="flex-1">
                          {editingQuest === quest.id ? (
                            <div className="space-y-3">
                              <div className="grid md:grid-cols-3 gap-3">
                                <Input
                                  value={editData.name || ''}
                                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                  className="font-medieval"
                                  placeholder="Quest name"
                                />

                                <Select
                                  value={editData.category || 'Produktivitas'}
                                  onValueChange={(value) => setEditData({ ...editData, category: value as QuestCategory })}
                                >
                                  <SelectTrigger className="font-medieval">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {questCategories.map(category => (
                                      <SelectItem key={category} value={category} className="font-medieval">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{getCategoryIcon(category)}</span>
                                          {category}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={editData.difficulty || 'Easy'}
                                  onValueChange={(value) => setEditData({ ...editData, difficulty: value as Difficulty })}
                                >
                                  <SelectTrigger className="font-medieval">
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Easy" className="text-green-400">
                                      <div className="flex justify-between w-full">
                                        <span>Easy</span>
                                        <span className="text-muted-foreground/80 text-xs">10 XP • 5 Coin</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Medium" className="text-yellow-400">
                                      <div className="flex justify-between w-full">
                                        <span>Medium</span>
                                        <span className="text-muted-foreground/80 text-xs">25 XP • 10 Coin</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Hard" className="text-orange-400">
                                      <div className="flex justify-between w-full">
                                        <span>Hard</span>
                                        <span className="text-muted-foreground/80 text-xs">50 XP • 25 Coin</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Boss" className="text-red-400">
                                      <div className="flex justify-between w-full">
                                        <span>Boss</span>
                                        <span className="text-muted-foreground/80 text-xs">100 XP • 50 Coin</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => setEditingQuest(null)}
                                  className="p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                                <button
                                  onClick={() => handleEditSave(quest.id)}
                                  className="p-2 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                                >
                                  <Save size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medieval text-lg">
                                  {quest.name}
                                </h3>
                                <span className="px-2 py-1 rounded text-xs bg-secondary/50 text-secondary-foreground">
                                  {quest.category}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm mb-3">
                                <span className={`font-medieval ${getDifficultyColor(quest.difficulty)}`}>
                                  {quest.difficulty}
                                </span>
                                <span className="text-primary">⭐ {quest.xp} XP</span>
                                <span className="text-gold">💰 {quest.coins} Coins</span>
                              </div>

                              {/* Action Buttons - Moved Below Quest Info */}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditStart(quest)}
                                  className="p-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => onCompleteQuest(quest.id, quest.xp, quest.coins)}
                                  className="btn-glow p-2 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => onDeleteQuest(quest.id)}
                                  className="p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Completed Quests Section */}
                {quests.some(q => q.completed) && (
                  <div className="space-y-4">
                    <h3 className="font-medieval text-lg text-muted-foreground mb-2">
                      Completed Quests ({quests.filter(q => q.completed).length})
                    </h3>
                    
                    {quests
                      .filter(quest => quest.completed)
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .map((quest) => (
                        <div key={quest.id} className="rpg-card p-4 border-l-4 border-l-green-500 opacity-80">
                          <div className="flex items-start space-x-4">
                            <div className="text-2xl text-green-500">
                              <CheckCircle size={24} />
                            </div>
                            <div className="flex-1">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medieval text-lg line-through text-muted-foreground">
                                    {quest.name}
                                  </h3>
                                  <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500">
                                    Completed
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm mb-3">
                                  <span className={`font-medieval ${getDifficultyColor(quest.difficulty)}`}>
                                    {quest.difficulty}
                                  </span>
                                  <span className="text-primary">⭐ {quest.xp} XP</span>
                                  <span className="text-gold">💰 {quest.coins} Coins</span>
                                  <span className="text-xs text-muted-foreground">
                                    Completed on {new Date(quest.completedAt || Date.now()).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Delete Button - Moved Below Quest Info */}
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => onDeleteQuest(quest.id)}
                                    className="p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestList;