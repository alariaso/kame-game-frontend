import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BattleDeck } from "@/types";
import { Shield, Star, Check, X, Swords } from "lucide-react";

interface BattleArenaProps {
  playerDeck: BattleDeck;
  aiDeck: BattleDeck;
  currentRound: number;
  roundsWon: { player: number; ai: number };
  roundResult: {
    playerCard: any;
    aiCard: any;
    winner: 'player' | 'ai' | 'draw' | null;
    reason: string;
  } | null;
  onSelectCard: (index: number) => void;
  onConfirmSelection: () => void;
  onNextRound: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({
  playerDeck,
  aiDeck,
  currentRound,
  roundsWon,
  roundResult,
  onSelectCard,
  onConfirmSelection,
  onNextRound
}) => {
  const maxRounds = 5;
  const showResult = roundResult !== null;
  
  // Render indicator for card status
  const renderCardStatus = (index: number, isSelected: boolean, isPlayed: boolean) => {
    if (isPlayed) {
      return (
        <div className="absolute top-2 right-2 bg-gray-800/80 text-white w-6 h-6 rounded-full flex items-center justify-center">
          <X size={14} />
        </div>
      );
    }
    
    if (isSelected) {
      return (
        <div className="absolute top-2 right-2 bg-gold text-black w-6 h-6 rounded-full flex items-center justify-center">
          <Check size={14} />
        </div>
      );
    }
    
    return null;
  };
  
  // Helper to determine if a card is played
  const isCardPlayed = (deck: BattleDeck, index: number): boolean => {
    return deck.playedCardIndices?.includes(index) || false;
  };
  
  // Get type color 
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'monster': return 'text-red-400';
      case 'spell': return 'text-blue-400';
      case 'trap': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };
  
  // Resolve winner icon and class
  const getWinnerDisplay = (winner: string | null) => {
    if (winner === 'player') {
      return { icon: <Check size={20} className="text-green-500" />, class: 'bg-green-500/20 border-green-500/30' };
    } else if (winner === 'ai') {
      return { icon: <X size={20} className="text-red-500" />, class: 'bg-red-500/20 border-red-500/30' };
    } else {
      return { icon: <Shield size={20} className="text-blue-500" />, class: 'bg-blue-500/20 border-blue-500/30' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-black/40 backdrop-blur-sm border-gold/20">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Star className="text-gold mr-2" size={20} />
              <span className="text-lg font-medium">Ronda {currentRound} de {maxRounds}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <span className="text-gold font-bold text-lg mr-2">{roundsWon.player}</span>
                <span className="text-sm text-gray-400">Tú</span>
              </div>
              <span className="text-gray-500">vs</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Rival</span>
                <span className="text-gold font-bold text-lg ml-2">{roundsWon.ai}</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-gold text-center">
            {showResult ? "Resultado de la Ronda" : "Elige tu carta para esta ronda"}
          </CardTitle>
          <CardDescription className="text-center">
            {showResult 
              ? "Veamos quién ha ganado la ronda"
              : "Selecciona una de tus cartas disponibles para enfrentar a tu oponente"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {showResult ? (
            // Round result display
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-2/5 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2 text-center">Tu carta</h3>
                <div className="relative w-40">
                  <img 
                    src={roundResult.playerCard.imageUrl} 
                    alt={roundResult.playerCard.name}
                    className="w-full rounded-md border border-gold/30" 
                  />
                  <div className="mt-2 text-center">
                    <p className="font-medium">{roundResult.playerCard.name}</p>
                    <p className={`text-sm font-medium ${getTypeColor(roundResult.playerCard.type)}`}>
                      {roundResult.playerCard.type.toUpperCase()}
                      {roundResult.playerCard.type === 'monster' && (
                        <span className="text-gray-300"> (ATK: {roundResult.playerCard.atk})</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="my-4 p-4 rounded-full border flex flex-col items-center">
                {getWinnerDisplay(roundResult.winner).icon}
                <div 
                  className={`text-sm mt-2 p-2 rounded border ${getWinnerDisplay(roundResult.winner).class}`}
                >
                  {roundResult.winner === 'player' && <span>¡Has ganado!</span>}
                  {roundResult.winner === 'ai' && <span>¡Has perdido!</span>}
                  {roundResult.winner === 'draw' && <span>¡Empate!</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">{roundResult.reason}</p>
              </div>
              
              <div className="w-full md:w-2/5 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2 text-center">Carta rival</h3>
                <div className="relative w-40">
                  <img 
                    src={roundResult.aiCard.imageUrl} 
                    alt={roundResult.aiCard.name}
                    className="w-full rounded-md border border-gold/30" 
                  />
                  <div className="mt-2 text-center">
                    <p className="font-medium">{roundResult.aiCard.name}</p>
                    <p className={`text-sm font-medium ${getTypeColor(roundResult.aiCard.type)}`}>
                      {roundResult.aiCard.type.toUpperCase()}
                      {roundResult.aiCard.type === 'monster' && (
                        <span className="text-gray-300"> (ATK: {roundResult.aiCard.atk})</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Card selection
            <div className="flex flex-col">
              <h3 className="text-lg font-medium mb-4 text-gold">Tus cartas disponibles:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {playerDeck.cards.map((card, i) => {
                  const isSelected = playerDeck.selectedCardIndex === i;
                  const isPlayed = isCardPlayed(playerDeck, i);
                  
                  return (
                    <div 
                      key={i} 
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isPlayed ? 'opacity-50' : 
                        isSelected ? 'ring-2 ring-gold scale-105' : 'hover:scale-102'
                      }`}
                      onClick={() => !isPlayed && onSelectCard(i)}
                    >
                      <img 
                        src={card.imageUrl} 
                        alt={card.name}
                        className="w-full rounded-md border border-gold/30" 
                      />
                      {renderCardStatus(i, isSelected, isPlayed)}
                      <p className="text-xs mt-1 truncate">{card.name}</p>
                      <p className={`text-xs ${getTypeColor(card.type)} font-medium`}>
                        {card.type.toUpperCase()}
                        {card.type === 'monster' && ` (ATK: ${card.atk})`}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 border-t border-gold/20 pt-6">
                <h3 className="text-lg font-medium mb-4 text-gold">Carta del rival para esta ronda:</h3>
                <div className="flex justify-center">
                  <div className="w-28 h-40 bg-gradient-to-b from-purple-900/60 to-black/80 rounded border border-gold/30 flex items-center justify-center">
                    <span className="text-gold text-2xl">?</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  El rival ha elegido su carta pero permanece oculta hasta resolver la ronda.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-center">
          {showResult ? (
            <Button 
              className="bg-gold hover:bg-gold-dark text-black font-semibold"
              onClick={onNextRound}
            >
              <Swords className="mr-2" size={18} />
              {roundsWon.player >= 3 || roundsWon.ai >= 3 || currentRound >= 5 
                ? "Ver Resultado Final" 
                : "Iniciar Siguiente Ronda"}
            </Button>
          ) : (
            <Button 
              className="bg-gold hover:bg-gold-dark text-black font-semibold"
              disabled={playerDeck.selectedCardIndex === null}
              onClick={onConfirmSelection}
            >
              Confirmar Selección
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BattleArena;
