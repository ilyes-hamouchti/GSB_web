import { Link, useParams } from 'react-router';
import { ChevronLeft, Minus, Pill, Plus } from 'lucide-react';
import { useState } from 'react';
import './Details.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { useCart } from '../../context/useCart.js';
import { produits } from '../../data/produits.js';

const TVA = 0.021;

function Details() {
    const { id } = useParams();
    const produit = produits.find((item) => String(item.id) === id);
    const [quantite, setQuantite] = useState(1);
    const { ajouterProduit } = useCart();

    if (!produit) {
        return (
            <>
                <Header />
                <main className="details__container details__not-found">
                    <h1>Produit introuvable</h1>
                    <Link to="/">Retour au catalogue</Link>
                </main>
                <Footer />
            </>
        );
    }

    const prixTTC = produit.prixHT * (1 + TVA);
    const informations = [
        ['Substance active', produit.substance],
        ['Dosage', produit.dosage],
        ['Forme', produit.forme],
        ['Conditionnement', produit.conditionnement],
        ['Fournisseur', produit.fournisseur],
        ['Référence', produit.reference],
    ];

    return (
        <>
            <Header />
            <main className="details__container">
                <Link to="/" className="details__back-link">
                    <ChevronLeft aria-hidden="true" />
                    Retour au catalogue
                </Link>

                <div className="details__grid">
                    <div className="details__img">
                        {produit.image ? (
                            <img src={produit.image} alt={produit.nom} />
                        ) : (
                            <Pill aria-hidden="true" size={48} color="#13a69f" />
                        )}
                    </div>

                    <div className="details__content">
                        <span className="details__badge">{produit.categorie}</span>
                        <h1 className="details__title">{produit.nom}</h1>
                        <p className="details__description">{produit.description}</p>
                        <p className="details__price">
                            <span className="details__ht">
                                {produit.prixHT.toFixed(2).replace('.', ',')} € HT
                            </span>
                            <strong>{prixTTC.toFixed(2).replace('.', ',')} €</strong>
                            <span className="details__ttc">TTC</span>
                        </p>

                        <div className="details__actions">
                            <div className="quantite" aria-label="Quantité">
                                <button
                                    type="button"
                                    onClick={() => setQuantite((value) => Math.max(1, value - 1))}
                                    aria-label="Diminuer la quantité"
                                >
                                    <Minus size={14} />
                                </button>
                                <span aria-live="polite">{quantite}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantite((value) => value + 1)}
                                    aria-label="Augmenter la quantité"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <button
                                type="button"
                                className="details__add"
                                onClick={() => ajouterProduit(produit, quantite)}
                            >
                                Ajouter au panier
                            </button>
                        </div>

                        <section className="details__info" aria-labelledby="product-info-title">
                            <h2 id="product-info-title">Informations produit</h2>
                            <table>
                                <tbody>
                                    {informations.map(([label, valeur]) => (
                                        <tr key={label}>
                                            <th scope="row">{label}</th>
                                            <td>{valeur || 'Non renseigné'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Details;
