import { Pill } from 'lucide-react';
import { Link } from 'react-router';
import './ProductCard.css';

const TVA = 0.021; // taux de TVA des médicaments remboursables

function ProductCard({ produit, onAjouter }) {
    const { id, nom, categorie, description, prixHT, image } = produit;
    const prixTTC = prixHT * (1 + TVA);

    return (
        <article className="product-card">
            <div className="product-card__media">
                <span className="product-card__badge">{categorie}</span>
                {image ? (
                    <img src={image} alt={nom} />
                ) : (
                    <Pill size={36} color="#13a69f" />
                )}
            </div>

            <div className="product-card__content">
                <h2 className="product-card__title">{nom}</h2>
                <p className="product-card__description">{description}</p>

                <p className="product-card__price">
                    <span className="product-card__ht">{prixHT.toFixed(2).replace('.', ',')} € HT</span>
                    <strong>{prixTTC.toFixed(2).replace('.', ',')} €</strong>
                    <span className="product-card__ttc">TTC</span>
                </p>

                <div className="product-card__actions">
                    <button type="button" className="product-card__add" onClick={onAjouter}>
                        Ajouter au panier
                    </button>
                    <Link className="product-card__details" to={`/details/${id}`}>
                        Détails
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;