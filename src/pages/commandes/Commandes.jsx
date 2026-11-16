import { Link, useLocation, useNavigate } from 'react-router';
import { RotateCcw, Trash2 } from 'lucide-react';
import './Commandes.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { useCart } from '../../context/useCart.js';

const TVA = 0.021;
const prixFormatte = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});
const dateFormattee = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
});

function Commandes() {
    const {
        commandes,
        erreurCommandes,
        ajouterProduit,
        viderHistoriqueCommandes,
    } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const commandeId = new URLSearchParams(location.search).get('commande');
    const commandeCreee = commandes.find((commande) => commande.id === commandeId);

    function recommander(commande) {
        commande.articles.forEach((article) => ajouterProduit(article, article.quantite));
        navigate('/panier');
    }

    return (
        <>
            <Header />
            <main className="orders-page">
                <div className="orders-page__heading">
                    <div>
                        <h1>Mes commandes</h1>
                        <p>Historique de vos commandes de démonstration sur ce navigateur.</p>
                    </div>
                    {commandes.length > 0 && (
                        <button
                            className="orders-page__clear"
                            type="button"
                            onClick={viderHistoriqueCommandes}
                        >
                            <Trash2 size={16} aria-hidden="true" />
                            Effacer l’historique
                        </button>
                    )}
                </div>

                <p className="orders-page__notice">
                    Les commandes sont enregistrées localement pour cette maquette. Elles ne sont transmises
                    à aucun serveur et ne déclenchent ni paiement ni livraison.
                </p>

                {erreurCommandes && (
                    <p className="orders-page__storage-error" role="status">{erreurCommandes}</p>
                )}

                {commandeCreee && (
                    <p className="orders-page__confirmation" role="status">
                        La commande {commandeCreee.id} a été ajoutée à l’historique de démonstration.
                    </p>
                )}

                {commandes.length === 0 ? (
                    <section className="orders-page__empty">
                        <h2>Aucune commande pour le moment</h2>
                        <p>Ajoutez des produits au panier pour créer une commande de démonstration.</p>
                        <Link to="/">Parcourir le catalogue</Link>
                    </section>
                ) : (
                    <div className="orders-list">
                        {commandes.map((commande) => {
                            const totalHT = commande.articles.reduce(
                                (total, article) => total + article.prixHT * article.quantite,
                                0,
                            );

                            return (
                                <article className="order-card" key={commande.id}>
                                    <div className="order-card__header">
                                        <div>
                                            <h2>{commande.id}</h2>
                                            <p>
                                                {dateFormattee.format(new Date(commande.date))}
                                                <span className="order-card__badge">Démo</span>
                                            </p>
                                        </div>
                                        <strong>{prixFormatte.format(totalHT * (1 + TVA))} TTC</strong>
                                    </div>

                                    <ul className="order-card__items">
                                        {commande.articles.map((article) => (
                                            <li key={article.id}>
                                                <Link to={`/details/${article.id}`}>{article.nom}</Link>
                                                <span>Qté : {article.quantite}</span>
                                                <strong>
                                                    {prixFormatte.format(article.prixHT * article.quantite)} HT
                                                </strong>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="order-card__footer">
                                        <span>Total HT : {prixFormatte.format(totalHT)}</span>
                                        <button
                                            className="order-card__reorder"
                                            type="button"
                                            onClick={() => recommander(commande)}
                                        >
                                            <RotateCcw size={16} aria-hidden="true" />
                                            Ajouter à nouveau au panier
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Commandes;
