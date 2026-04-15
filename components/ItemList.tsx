import { Item } from "@/types";
import { ItemCard } from "./ItemCard";
import { ShoppingBasket } from "lucide-react";

interface ItemListProps {
    itens: Item[];
    onEditar: (id: string, dados: Partial<Item>) => void;
    onRemover: (id: string) => void;
}

export function ItemList({ itens, onEditar, onRemover }: ItemListProps) {
    if (itens.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <ShoppingBasket size={40} className="mb-3 opacity-40" />
                <p className="text-sm">Nenhum item adicionado ainda</p>
                <p className="text-xs mt-1">Use o formulário acima para começar</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {itens.map((item) => (
                <ItemCard
                    key={item.id}
                    item={item}
                    onEditar={onEditar}
                    onRemover={onRemover}
                />
            ))}
        </div>
    );
}