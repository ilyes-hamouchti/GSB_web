import { useMemo, useState } from 'react';
import { CartContext } from './CartContext.js';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    function ajouterProduit(produit, quantite = 1) {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === produit.id);

            if (existingItem) {
                return currentItems.map((item) => (
                    item.id === produit.id
                        ? { ...item, quantite: item.quantite + quantite }
                        : item
                ));
            }

            return [...currentItems, { ...produit, quantite }];
        });
    }

    function modifierQuantite(id, quantite) {
        setItems((currentItems) => currentItems
            .map((item) => (item.id === id ? { ...item, quantite } : item))
            .filter((item) => item.quantite > 0));
    }

    function supprimerProduit(id) {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    }

    function viderPanier() {
        setItems([]);
    }

    const value = useMemo(() => ({
        items,
        nombreArticles: items.reduce((total, item) => total + item.quantite, 0),
        ajouterProduit,
        modifierQuantite,
        supprimerProduit,
        viderPanier,
    }), [items]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
