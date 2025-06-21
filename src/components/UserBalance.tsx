
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Wallet } from "lucide-react";

const UserBalance: React.FC = () => {
  const { user, depositBalance } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeposit = () => {
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      depositBalance(numericAmount);
      setAmount("");
      setIsDialogOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1 text-gold hover:text-gold/80 transition-colors cursor-pointer">
            <Wallet size={16} />
            <span className="font-medium">{user.balance.toLocaleString()}</span> YP
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-gold">Recargar Yugi Pesos</DialogTitle>
            <DialogDescription>
              Ingresa la cantidad que deseas recargar en tu cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              min={1}
              placeholder="Cantidad a recargar"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/50 border-gold/30 focus:border-gold"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleDeposit}
              className="bg-gold hover:bg-gold/80 text-black"
              disabled={!amount || Number(amount) <= 0}
            >
              Recargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBalance;
