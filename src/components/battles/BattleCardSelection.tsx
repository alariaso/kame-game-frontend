
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCard } from "@/types";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BattleCardSelectionProps {
  userCards: UserCard[];
  selectedCards: string[];
  setSelectedCards: React.Dispatch<React.SetStateAction<string[]>>;
  onConfirm: () => void;
}

const BattleCardSelection: React.FC<BattleCardSelectionProps> = ({
  userCards,
  selectedCards,
  setSelectedCards,
  onConfirm
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("all");

  // Filtrar cartas según la búsqueda y el filtro activo
  const filteredCards = userCards.filter((userCard) => {
    const card = userCard.card;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || card.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const toggleCardSelection = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      if (selectedCards.length < 5) {
        setSelectedCards([...selectedCards, cardId]);
      } else {
        toast.error("Ya has seleccionado el máximo de 5 cartas");
      }
    }
  };
  
  // Funciones de utilidad para formatear y colorear
  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-600 text-white';
      case 'rare': return 'bg-blue-600 text-white';
      case 'ultra-rare': return 'bg-purple-600 text-white';
      case 'legendary': return 'bg-gold text-black';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gold mb-4">Selecciona 5 cartas para el duelo</h2>
        <p className="text-gray-400 mb-2">Elige exactamente 5 cartas para enfrentarte al oponente.</p>
        <p className="text-sm text-gray-500">
          Cartas seleccionadas: <span className={selectedCards.length === 5 ? "text-green-500" : "text-gold"}>
            {selectedCards.length}/5
          </span>
        </p>
      </div>
      
      {/* Barra de búsqueda y filtros para cartas */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Buscar en mi colección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-gold/20 focus:border-gold"
          />
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className={`text-sm ${activeFilter === 'all' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gold'}`}
            onClick={() => setActiveFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant="ghost"
            className={`text-sm ${activeFilter === 'monster' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gold'}`}
            onClick={() => setActiveFilter('monster')}
          >
            Monstruos
          </Button>
          <Button
            variant="ghost"
            className={`text-sm ${activeFilter === 'spell' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gold'}`}
            onClick={() => setActiveFilter('spell')}
          >
            Hechizos
          </Button>
          <Button
            variant="ghost"
            className={`text-sm ${activeFilter === 'trap' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gold'}`}
            onClick={() => setActiveFilter('trap')}
          >
            Trampas
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {filteredCards.map(userCard => {
          const card = userCard.card;
          const isSelected = selectedCards.includes(userCard.id);
          
          return (
            <div 
              key={userCard.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-gold scale-105' : 'hover:scale-102'
              }`}
              onClick={() => toggleCardSelection(userCard.id)}
            >
              <img 
                src={card.imageUrl} 
                alt={card.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                <h3 className="text-sm font-medium text-white">{card.name}</h3>
                {card.type === 'monster' && (
                  <div className="flex justify-between mt-2 text-xs text-gray-300">
                    <span>ATK: {card.atk}</span>
                    <span>DEF: {card.def}</span>
                  </div>
                )}
                <span className={`text-xs px-2 py-1 rounded-full mt-2 ${getRarityColor(card.rarity)} self-start`}>
                  {card.type}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-gold text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                  {selectedCards.indexOf(userCard.id) + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mb-10">
        <Button
          className="bg-gold hover:bg-gold-dark text-black font-semibold px-8"
          disabled={selectedCards.length !== 5}
          onClick={onConfirm}
        >
          {selectedCards.length === 5 ? "Aceptar" : "Selecciona exactamente 5 cartas"}
        </Button>
      </div>
    </>
  );
};

export default BattleCardSelection;
