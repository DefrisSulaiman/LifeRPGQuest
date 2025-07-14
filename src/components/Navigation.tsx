import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏰' },
    { id: 'quests', label: 'Quest List', icon: '📜' },
    { id: 'shop', label: 'Weapon Shop', icon: '⚔️' },
    { id: 'arena', label: 'Monster Arena', icon: '👹' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center py-4">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-item flex items-center space-x-2 font-medieval ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary shadow-lg'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-4">
          <h1 className="text-xl font-decorative text-primary">RPG Quest</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-4">
            <div className="flex flex-col space-y-2 pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`nav-item flex items-center space-x-3 w-full text-left font-medieval ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary shadow-lg'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;