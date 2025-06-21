
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_USER_INVENTORY } from "@/data/mockData";
import type { UserCard } from "@/types";
import { Search, BookOpen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const Inventory: React.FC = () => {
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_INVENTORY.cards);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filtrar cartas según la búsqueda y el filtro activo
  const filteredCards = userCards.filter((userCard) => {
    const card = userCard.card;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || card.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Renderiza una tarjeta de carta
  const renderCardItem = (userCard: UserCard) => {
    const card = userCard.card;
    return (
      <Card key={userCard.id} className="bg-black/40 backdrop-blur-sm border-gold/10 hover:border-gold/30 card-hover overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-gold truncate">{card.name}</CardTitle>
            <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(card.rarity)}`}>
              {formatRarity(card.rarity)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 pb-2">
          <div className="aspect-[3/4] overflow-hidden rounded-md mb-3">
            <img 
              src={card.imageUrl} 
              alt={card.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400 line-clamp-2 h-10">{card.description}</p>
            {card.type === 'monster' && (
              <div className="flex justify-between mt-2 text-sm text-gray-300">
                <span>ATK: {card.atk}</span>
                <span>DEF: {card.def}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between items-center">
          <span className="text-sm text-gray-300">Cantidad: {userCard.quantity}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-gold/20 text-gold hover:bg-gold/10 text-sm"
          >
            Usar
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Renderiza un mazo
  const renderDeck = (deck: { id: string; name: string; cards: string[] }) => (
    <Card key={deck.id} className="bg-black/40 backdrop-blur-sm border-gold/10 hover:border-gold/30 card-hover">
      <CardHeader>
        <CardTitle className="text-gold">{deck.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">Cartas: {deck.cards.length}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" className="text-gold hover:bg-gold/10">
          <BookOpen size={18} className="mr-2" />
          Ver
        </Button>
        <Button variant="ghost" className="text-gold hover:bg-gold/10">
          <Plus size={18} className="mr-2" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  );

  // Funciones de utilidad para formatear y colorear
  const formatRarity = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'Común';
      case 'rare': return 'Rara';
      case 'ultra-rare': return 'Ultra';
      case 'legendary': return 'Legendaria';
      default: return rarity;
    }
  };

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
    <div className="min-h-[calc(100vh-73px)] py-8 px-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gold mb-2">Tu Inventario</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Administra tus cartas y mazos para crear las estrategias más poderosas.
          </p>
        </div>
        
        {/* Tabs para Cartas y Mazos */}
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 bg-black/40 border border-gold/10">
            <TabsTrigger value="cards" className="flex-1 data-[state=active]:bg-gold data-[state=active]:text-black">
              Mis Cartas
            </TabsTrigger>
            <TabsTrigger value="decks" className="flex-1 data-[state=active]:bg-gold data-[state=active]:text-black">
              Mis Mazos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-0">
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
                {/* <Button
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
                </Button> */}
              </div>
            </div>
            
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCards.map(renderCardItem)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No se encontraron cartas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="decks" className="mt-0">
            <div className="flex justify-end mb-6">
              <Button className="bg-gold hover:bg-gold-dark text-black font-medium">
                <Plus size={18} className="mr-2" />
                Crear Nuevo Mazo
              </Button>
            </div>
            
            {MOCK_USER_INVENTORY.decks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {MOCK_USER_INVENTORY.decks.map(renderDeck)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No has creado ningún mazo aún.</p>
                <Button className="bg-gold hover:bg-gold-dark text-black font-medium mt-4">
                  Crear Mi Primer Mazo
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
