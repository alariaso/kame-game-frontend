import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_CARDS, MOCK_USER_INVENTORY } from "@/data/mockData";
import { toast } from "sonner";
import { Swords } from "lucide-react";
import type { BattleDeck, Card as CardType } from "@/types";
import BattleCardSelection from "@/components/battles/BattleCardSelection";
import BattleArena from "@/components/battles/BattleArena";
import BattleResult from "@/components/battles/BattleResults";

const Battles: React.FC = () => {
  // Battle stages
  const STAGES = {
    SELECTION: 'selection',
    PREPARE: 'prepare',
    ROUND: 'round',
    RESULT: 'result'
  };

  const [stage, setStage] = useState(STAGES.SELECTION);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [battleResult, setBattleResult] = useState<{
    winner: 'player' | 'ai' | 'draw' | null;
    playerScore: number;
    aiScore: number;
  } | null>(null);
  
  const [battleInProgress, setBattleInProgress] = useState(false);
  
  // Battle-specific states
  const [playerDeck, setPlayerDeck] = useState<BattleDeck | null>(null);
  const [aiDeck, setAiDeck] = useState<BattleDeck | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundsWon, setRoundsWon] = useState({ player: 0, ai: 0 });
  const [roundResult, setRoundResult] = useState<{
    playerCard: CardType | null;
    aiCard: CardType | null;
    winner: 'player' | 'ai' | 'draw' | null;
    reason: string;
  } | null>(null);

  const userCards = MOCK_USER_INVENTORY.cards;

  // Prepare player deck from selected cards
  const prepareBattle = () => {
    // Get user's selected cards
    const playerCards = selectedCards.map(id => {
      const userCard = userCards.find(uc => uc.id === id);
      return userCard ? userCard.card : null;
    }).filter(Boolean) as CardType[];
    
    setPlayerDeck({
      cards: playerCards,
      selectedCardIndex: null
    });
    
    // Select 5 random cards for AI
    const allCards = [...MOCK_CARDS];
    const aiCards: CardType[] = [];
    
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * allCards.length);
      aiCards.push(allCards[randomIndex]);
      allCards.splice(randomIndex, 1);
    }
    
    setAiDeck({
      cards: aiCards,
      selectedCardIndex: null
    });
    
    setStage(STAGES.PREPARE);
    toast.success("¡Cartas seleccionadas! Prepárate para el duelo.");
  };

  // Start a new round
  const startRound = () => {
    if (!playerDeck || !aiDeck) return;
    
    setStage(STAGES.ROUND);
    setCurrentRound(prev => prev + 1);
    setRoundResult(null);
    
    // AI randomly selects a card
    const availableAiCards = aiDeck.cards.filter((_, index) => 
      !aiDeck.playedCardIndices?.includes(index)
    );
    const randomAiIndex = Math.floor(Math.random() * availableAiCards.length);
    const aiCardIndex = aiDeck.cards.findIndex(card => card.id === availableAiCards[randomAiIndex].id);
    
    setAiDeck({
      ...aiDeck,
      selectedCardIndex: aiCardIndex
    });
  };

  // Player selects a card for battle
  const selectCardForBattle = (index: number) => {
    if (!playerDeck) return;
    
    setPlayerDeck({
      ...playerDeck,
      selectedCardIndex: index
    });
  };

  // Resolve the current round
  const resolveRound = () => {
    if (!playerDeck || !aiDeck || playerDeck.selectedCardIndex === null || aiDeck.selectedCardIndex === null) {
      return;
    }
    
    const playerCard = playerDeck.cards[playerDeck.selectedCardIndex];
    const aiCard = aiDeck.cards[aiDeck.selectedCardIndex];
    
    let winner: 'player' | 'ai' | 'draw' = 'draw';
    let reason = '';
    
    // Compare card types (monster > spell > trap)
    if (playerCard.type !== aiCard.type) {
      if (
        (playerCard.type === 'monster' && aiCard.type === 'spell') ||
        (playerCard.type === 'spell' && aiCard.type === 'trap') ||
        (playerCard.type === 'trap' && aiCard.type === 'monster')
      ) {
        winner = 'player';
        reason = `${playerCard.type} vence a ${aiCard.type}`;
      } else {
        winner = 'ai';
        reason = `${aiCard.type} vence a ${playerCard.type}`;
      }
    } 
    // If same type, compare attack (for monsters) or just declare a draw
    else {
      if (playerCard.type === 'monster' && aiCard.type === 'monster') {
        if (playerCard.atk! > aiCard.atk!) {
          winner = 'player';
          reason = `Ataque superior (${playerCard.atk} > ${aiCard.atk})`;
        } else if (playerCard.atk! < aiCard.atk!) {
          winner = 'ai';
          reason = `Ataque superior (${aiCard.atk} > ${playerCard.atk})`;
        } else {
          winner = 'draw';
          reason = 'Empate en ataque';
        }
      } else {
        winner = 'draw';
        reason = 'Mismo tipo de carta';
      }
    }
    
    // Update rounds won
    const newRoundsWon = { ...roundsWon };
    if (winner === 'player') {
      newRoundsWon.player += 1;
    } else if (winner === 'ai') {
      newRoundsWon.ai += 1;
    }
    setRoundsWon(newRoundsWon);
    
    // Set round result
    setRoundResult({
      playerCard,
      aiCard,
      winner,
      reason
    });
    
    // Mark cards as played
    setPlayerDeck({
      ...playerDeck,
      playedCardIndices: [...(playerDeck.playedCardIndices || []), playerDeck.selectedCardIndex],
      selectedCardIndex: null
    });
    
    setAiDeck({
      ...aiDeck,
      playedCardIndices: [...(aiDeck.playedCardIndices || []), aiDeck.selectedCardIndex],
      selectedCardIndex: null
    });
    
    // Check if there's a battle winner
    if (newRoundsWon.player >= 3) {
      endBattle('player');
    } else if (newRoundsWon.ai >= 3) {
      endBattle('ai');
    } else if (currentRound >= 5) {
      // If we've played 5 rounds and no one has 3 wins, determine winner by most wins
      if (newRoundsWon.player > newRoundsWon.ai) {
        endBattle('player');
      } else if (newRoundsWon.player < newRoundsWon.ai) {
        endBattle('ai');
      } else {
        endBattle('draw');
      }
    }
  };

  // End the battle with a result
  const endBattle = (winner: 'player' | 'ai' | 'draw') => {
    setBattleResult({
      winner,
      playerScore: roundsWon.player,
      aiScore: roundsWon.ai
    });
    
    setStage(STAGES.RESULT);
    
    if (winner === 'player') {
      toast.success("¡Has ganado la batalla!");
    } else if (winner === 'ai') {
      toast.error("Has perdido esta vez. ¡Inténtalo de nuevo!");
    } else {
      toast.info("La batalla ha terminado en empate.");
    }
  };
  
  // Reset all battle states
  const resetBattle = () => {
    setBattleResult(null);
    setSelectedCards([]);
    setPlayerDeck(null);
    setAiDeck(null);
    setCurrentRound(0);
    setRoundsWon({ player: 0, ai: 0 });
    setRoundResult(null);
    setStage(STAGES.SELECTION);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gold mb-2">Arena de Duelos</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Demuestra tu valía en la arena enfrentándote a los trabajadores místicos del Mercado.
          </p>
        </div>
        
        {/* Card Selection Stage */}
        {stage === STAGES.SELECTION && (
          <BattleCardSelection 
            userCards={userCards}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            onConfirm={prepareBattle}
          />
        )}
        
        {/* Prepare Stage - Show both decks and start button */}
        {stage === STAGES.PREPARE && playerDeck && aiDeck && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-gold text-center">Preparación del Duelo</CardTitle>
                <CardDescription className="text-center">
                  ¡Las cartas han sido seleccionadas! Prepárate para enfrentarte al rival.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-3 text-gold">Tu Mazo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {playerDeck.cards.map((card, i) => (
                        <img 
                          key={i} 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="w-20 h-28 object-cover rounded border border-gold/30" 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Swords size={40} className="text-gold my-4" />
                  
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-3 text-gold">Mazo Rival</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {aiDeck.cards.map((_, i) => (
                        <div 
                          key={i}
                          className="w-20 h-28 bg-gradient-to-b from-purple-900/60 to-black/80 rounded border border-gold/30 flex items-center justify-center"
                        >
                          <span className="text-gold text-2xl">?</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button 
                  className="bg-gold hover:bg-gold-dark text-black font-semibold"
                  onClick={startRound}
                >
                  <Swords className="mr-2" size={18} />
                  Iniciar Primera Ronda
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Round Stage - Battle Arena */}
        {stage === STAGES.ROUND && playerDeck && aiDeck && (
          <BattleArena
            playerDeck={playerDeck}
            aiDeck={aiDeck}
            currentRound={currentRound}
            roundsWon={roundsWon}
            roundResult={roundResult}
            onSelectCard={selectCardForBattle}
            onConfirmSelection={resolveRound}
            onNextRound={startRound}
          />
        )}
        
        {/* Result Stage */}
        {stage === STAGES.RESULT && battleResult && (
          <BattleResult 
            result={battleResult}
            onNewBattle={resetBattle}
          />
        )}
        
        {/* Reglas del duelo */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-black/20 border-gold/10">
            <CardHeader>
              <CardTitle className="text-gold">Reglas del Duelo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400 space-y-2">
              <p>• Selecciona 5 cartas para formar tu mano de duelo.</p>
              <p>• El rival seleccionará automáticamente 5 cartas.</p>
              <p>• En cada ronda, ambos jugadores eligen una carta para combatir.</p>
              <p>• Jerarquía de tipos: Monstruo &gt; Hechizo &gt; Trampa &gt; Monstruo.</p>
              <p>• Si hay empate en tipos, se compara el ataque (solo para monstruos).</p>
              <p>• Se juegan hasta 5 rondas o hasta que un jugador gane 3 rondas.</p>
              <p>• Ganar duelos te otorga monedas y puntos que puedes canjear en la tienda.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Battles;
