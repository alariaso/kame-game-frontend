
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardType, CardRarity } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  type: z.enum(["monster", "spell", "trap"] as const),
  rarity: z.enum(["common", "rare", "ultra-rare", "legendary"] as const),
  atk: z.string().optional(),
  def: z.string().optional(),
  price: z.string().min(1, { message: "El precio es requerido" }),
  imageUrl: z.string().url({ message: "Debe ser una URL válida" }),
  stock: z.string().min(1, { message: "El stock es requerido" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCard?: (cardData: any) => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ 
  open, 
  onOpenChange,
  onAddCard = () => {} 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "monster",
      rarity: "common",
      atk: "",
      def: "",
      price: "",
      imageUrl: "",
      stock: "1",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convertir valores numéricos
    const cardData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      ...(data.type === "monster" && {
        atk: Number(data.atk),
        def: Number(data.def),
      }),
      id: crypto.randomUUID(),
    };

    onAddCard(cardData);
    toast.success("Carta agregada correctamente");
    form.reset();
    onOpenChange(false);
  };

  const cardType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gold/30 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gold">Agregar Nueva Carta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la carta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-gold/20">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-gold/30">
                        <SelectItem value="monster">Monstruo</SelectItem>
                        <SelectItem value="spell">Hechizo</SelectItem>
                        <SelectItem value="trap">Trampa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rareza</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-gold/20">
                          <SelectValue placeholder="Seleccionar rareza" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-gold/30">
                        <SelectItem value="common">Común</SelectItem>
                        <SelectItem value="rare">Rara</SelectItem>
                        <SelectItem value="ultra-rare">Ultra Rara</SelectItem>
                        <SelectItem value="legendary">Legendaria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {cardType === "monster" && (
                <>
                  <FormField
                    control={form.control}
                    name="atk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ataque</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Puntos de ataque" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="def"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Defensa</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Puntos de defensa" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Precio en Yugi Pesos" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Unidades disponibles" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de la imagen de la carta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la carta" 
                      className="resize-none min-h-[100px] bg-black/30 border-gold/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gold hover:bg-gold/80 text-black"
              >
                Guardar Carta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardForm;
