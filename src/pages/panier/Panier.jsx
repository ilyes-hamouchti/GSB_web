import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2 } from 'lucide-react';
import './Panier.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { useCart } from '../../context/useCart.js';

const TVA = 0.021;
const prixFormatte = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});

function Panier() {
    const { items, modifierQuantite, supprimerProduit, viderPanier, passerCommande } = useCart();
    const navigate = useNavigate();
    const totalHT = items.reduce((total, item) => total + item.prixHT * item.quantite, 0);
    const totalTTC = totalHT * (1 + TVA);

    function confirmerCommande() {
        const commande = passerCommande();
        if (commande) {
            navigate(`/commandes?commande=${encodeURIComponent(commande.id)}`);
        }
    }

    return (
        <>
            <Header />
            <main className="cart-page">
                <div className="cart-page__heading">
                    <div>
                        <h1>Mon panier</h1>
                        <p>Récapitulatif de votre sélection de démonstration.</p>
                    </div>
                    {items.length > 0 && (
                        <button className="cart-page__clear" type="button" onClick={viderPanier}>
                            Vider le panier
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <section className="cart-page__empty">
                        <p>Votre panier est vide.</p>
                        <Link to="/">Découvrir le catalogue</Link>
                    </section>
                ) : (
                    <>
                        <div className="cart-page__items">
                            {items.map((item) => (
                                <article className="cart-item" key={item.id}>
                                    <div className="cart-item__description">
                                        <Link to={`/details/${item.id}`}>{item.nom}</Link>
                                        <span>{item.categorie}</span>
                                        <span>{prixFormatte.format(item.prixHT)} HT / unité</span>
                                    </div>
                                    <div className="cart-item__actions">
                                        <div className="cart-item__quantity" aria-label={`Quantité de ${item.nom}`}>
                                            <button
                                                type="button"
                                                aria-label={`Retirer une unité de ${item.nom}`}
                                                onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span aria-live="polite">{item.quantite}</span>
                                            <button
                                                type="button"
                                                aria-label={`Ajouter une unité de ${item.nom}`}
                                                onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <strong>{prixFormatte.format(item.prixHT * item.quantite)} HT</strong>
                                        <button
                                            className="cart-item__remove"
                                            type="button"
                                            aria-label={`Supprimer ${item.nom} du panier`}
                                            onClick={() => supprimerProduit(item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <section className="cart-summary" aria-label="Totaux du panier">
                            <p><span>Total HT</span><strong>{prixFormatte.format(totalHT)}</strong></p>
                            <p><span>TVA (2,1 %)</span><strong>{prixFormatte.format(totalTTC - totalHT)}</strong></p>
                            <p className="cart-summary__total"><span>Total TTC</span><strong>{prixFormatte.format(totalTTC)}</strong></p>
                            <p className="cart-summary__notice">
                                Démonstration : aucune commande réelle ne sera envoyée.
                            </p>
                            <button
                                className="cart-summary__submit"
                                type="button"
                                onClick={confirmerCommande}
                            >
                                Confirmer la commande (démo)
                            </button>
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Panier;
