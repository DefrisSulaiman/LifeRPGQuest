import React from 'react';
import { ShoppingCart, Check, Lock } from 'lucide-react';
import { Weapon, PlayerData } from '../data/gameData';

interface WeaponShopProps {
  weapons: Weapon[];
  playerData: PlayerData;
  onPurchaseWeapon: (weaponId: string) => void;
  onEquipWeapon: (weaponId: string) => void;
}

const WeaponShop: React.FC<WeaponShopProps> = ({
  weapons,
  playerData,
  onPurchaseWeapon,
  onEquipWeapon
}) => {
  const canPurchase = (weapon: Weapon) => {
    return !weapon.purchased && 
           playerData.level >= weapon.levelRequired && 
           playerData.coins >= weapon.cost;
  };

  const canEquip = (weapon: Weapon) => {
    return weapon.purchased && !weapon.active;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-decorative text-primary mb-2">Weapon Shop</h2>
        <p className="text-muted-foreground font-medieval">Forge your destiny with legendary weapons</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weapons.map((weapon) => (
          <div
            key={weapon.id}
            className={`rpg-card p-6 text-center relative overflow-hidden ${
              weapon.active ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Weapon Icon with Animation */}
            <div className="text-6xl mb-4 float-animation">
              {weapon.icon}
            </div>

            {/* Weapon Info */}
            <h3 className="text-xl font-decorative text-primary mb-2">
              {weapon.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">Cost:</span>
                <span className="text-gold font-medieval">💰 {weapon.cost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medieval text-muted-foreground">Level Required:</span>
                <span className="text-primary font-medieval">Lv. {weapon.levelRequired}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {weapon.active ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medieval">
                  <Check size={14} />
                  <span>Equipped</span>
                </div>
              ) : weapon.purchased ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medieval">
                  <span>Owned</span>
                </div>
              ) : playerData.level < weapon.levelRequired ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-sm font-medieval">
                  <Lock size={14} />
                  <span>Level {weapon.levelRequired} Required</span>
                </div>
              ) : playerData.coins < weapon.cost ? (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-sm font-medieval">
                  <span>Insufficient Coins</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medieval">
                  <span>Available</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div>
              {weapon.active ? (
                <div className="text-sm font-medieval text-green-400 magic-glow">
                  ⚡ Currently Equipped ⚡
                </div>
              ) : weapon.purchased ? (
                <button
                  onClick={() => onEquipWeapon(weapon.id)}
                  className="btn-glow w-full px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medieval"
                >
                  Equip Weapon
                </button>
              ) : (
                <button
                  onClick={() => canPurchase(weapon) && onPurchaseWeapon(weapon.id)}
                  disabled={!canPurchase(weapon)}
                  className={`w-full px-4 py-2 rounded-lg font-medieval transition-colors ${
                    canPurchase(weapon)
                      ? 'btn-glow bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingCart size={16} />
                    <span>Purchase</span>
                  </div>
                </button>
              )}
            </div>

            {/* Magical glow effect for active weapon */}
            {weapon.active && (
              <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>

      {/* Player Stats */}
      <div className="rpg-card p-4">
        <div className="flex justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl mb-1">💰</div>
            <div className="text-lg font-decorative text-gold">{playerData.coins}</div>
            <div className="text-xs font-medieval text-muted-foreground">Coins</div>
          </div>
          <div>
            <div className="text-2xl mb-1">👤</div>
            <div className="text-lg font-decorative text-primary">Lv. {playerData.level}</div>
            <div className="text-xs font-medieval text-muted-foreground">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponShop;