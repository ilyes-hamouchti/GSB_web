import { useState } from 'react';
import { CartContext } from './CartContext.js';

const COMMANDES_STORAGE_KEY = 'gsb-commandes';

function lireCommandes() {
    try {
        const donnees = window.localStorage.getItem(COMMANDES_STORAGE_KEY);
        if (!donnees) return { commandes: [], erreur: '' };

        const commandes = JSON.parse(donnees);
        if (!Array.isArray(commandes) || !commandes.every((commande) => (
            commande
            && typeof commande.id === 'string'
            && !Number.isNaN(Date.parse(commande.date))
            && Array.isArray(commande.articles)
            && commande.articles.length > 0
            && commande.articles.every((article) => (
                article
                && (typeof article.id === 'number' || typeof article.id === 'string')
                && typeof article.nom === 'string'
                && Number.isFinite(article.prixHT)
                && article.prixHT >= 0
                && Number.isInteger(article.quantite)
                && article.quantite > 0
            ))
        ))) {
            throw new Error('Le format de l’historique de commandes est invalide.');
        }

        return { commandes, erreur: '' };
    } catch (error) {
        console.error('Impossible de lire l’historique des commandes.', error);
        return {
            commandes: [],
            erreur: 'L’historique local des commandes est indisponible sur ce navigateur.',
        };
    }
}

function enregistrerCommandes(commandes) {
    try {
        window.localStorage.setItem(COMMANDES_STORAGE_KEY, JSON.stringify(commandes));
        return '';
    } catch (error) {
        console.error('Impossible d’enregistrer l’historique des commandes.', error);
        return 'La commande est visible pendant cette session, mais n’a pas pu être enregistrée dans ce navigateur.';
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [historique, setHistorique] = useState(lireCommandes);
    const { commandes, erreur: erreurCommandes } = historique;

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

    function passerCommande() {
        if (items.length === 0) return null;

        const commande = {
            id: `GSB-${Date.now()}`,
            date: new Date().toISOString(),
            articles: items.map((item) => ({ ...item })),
        };
        const nouvellesCommandes = [commande, ...commandes];
        const erreur = enregistrerCommandes(nouvellesCommandes);

        setHistorique({ commandes: nouvellesCommandes, erreur });
        setItems([]);
        return commande;
    }

    function viderHistoriqueCommandes() {
        const erreur = enregistrerCommandes([]);
        setHistorique({ commandes: [], erreur });
    }

    return (
        <CartContext.Provider value={{
            items,
            commandes,
            erreurCommandes,
            nombreArticles: items.reduce((total, item) => total + item.quantite, 0),
            ajouterProduit,
            modifierQuantite,
            supprimerProduit,
            viderPanier,
            passerCommande,
            viderHistoriqueCommandes,
        }}>
            {children}
        </CartContext.Provider>
    );
}
