import { useState } from 'react';
import { Search } from 'lucide-react';
import './Catalogue.css';
import ProductCard from '../../components/ProductCard.jsx';
import { produits } from '../../data/produits.js';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { useCart } from '../../context/useCart.js';

const CATEGORIES = ['Tous', 'Antalgiques', 'Antibiotiques', 'Anti-inflammatoires', 'Pneumologie', 'Cardiologie'];

const TAILLE_PAGE = 6;

function Catalogue() {
    // Valeurs des filtres : chaîne vide = pas de filtre
    const [categorie, setCategorie] = useState('Tous');
    const [recherche, setRecherche] = useState('');
    const [tri, setTri] = useState('nom-asc');
    const [page, setPage] = useState(1);
    const { ajouterProduit } = useCart();

    // Quand un filtre change, on mémorise sa valeur et on revient à la page 1
    function changerCategorie(valeur) {
        setCategorie(valeur);
        setPage(1);
    }

    function changerRecherche(event) {
        setRecherche(event.target.value);
        setPage(1);
    }

    function changerTri(event) {
        setTri(event.target.value);
        setPage(1);
    }

    function reinitialiserFiltres() {
        setCategorie('Tous');
        setRecherche('');
        setTri('nom-asc');
        setPage(1);
    }

    // 1) Filtrage (équivalent de ce que ferait l'API avec les paramètres)
    const produitsFiltres = produits
        .filter((p) => categorie === 'Tous' || p.categorie === categorie)
        .filter((p) => p.nom.toLowerCase().includes(recherche.trim().toLowerCase()))

    // 2) Tri, sur une copie pour ne pas modifier le tableau d'origine
    const produitsTries = [...produitsFiltres].sort((a, b) => {
        if (tri === 'nom-asc') return a.nom.localeCompare(b.nom);
        if (tri === 'nom-desc') return b.nom.localeCompare(a.nom);
        if (tri === 'prix-asc') return a.prixHT - b.prixHT;
        return b.prixHT - a.prixHT;
    });

    // 3) Pagination (équivalent de { page, taille, total, totalPages } renvoyé par l'API)
    const total = produitsTries.length;
    const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));
    const debut = (page - 1) * TAILLE_PAGE;
    const produitsAffiches = produitsTries.slice(debut, debut + TAILLE_PAGE);

    return (
      <>
        <Header />
        <section className="catalogue-page">
            <div className="catalogue-page__top">
                <div>
                    <h1 className="catalogue-page__title">Catalogue des médicaments</h1>
                    <p className="catalogue-page__subtitle">Données de démonstration — GSB Galaxy Swiss Bourdin</p>
                </div>

                <div className="catalogue-page__search">
                    <Search size={14} color="#9aa5b4" />
                    <input
                        type="search"
                        placeholder="Rechercher un produit..."
                        value={recherche}
                        onChange={changerRecherche}
                    />
                </div>
            </div>

            <div className="catalogue-page__filters">
                <div className="catalogue-page__chips">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`chip ${categorie === cat ? 'chip--active' : ''}`}
                            onClick={() => changerCategorie(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="catalogue-page__options">

                    <label className="catalogue-page__option">
                        Trier :
                        <select value={tri} onChange={changerTri}>
                            <option value="nom-asc">Nom (A → Z)</option>
                            <option value="nom-desc">Nom (Z → A)</option>
                            <option value="prix-asc">Prix croissant</option>
                            <option value="prix-desc">Prix décroissant</option>
                        </select>
                    </label>

                    <button type="button" className="catalogue-page__reset" onClick={reinitialiserFiltres}>
                        Réinitialiser
                    </button>
                </div>
            </div>

            <div className="catalogue-page__list">
                {produitsAffiches.map((p) => (
                    <ProductCard
                        key={p.id}
                        produit={p}
                        onAjouter={() => ajouterProduit(p)}
                    />
                ))}
            </div>

            {/* Aucun résultat */}
            {total === 0 && <p className="products-page__empty">Aucun produit ne correspond aux critères.</p>}

            {/* Pagination, affichée seulement s'il y a plus d'une page */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        ← Précédente
                    </button>

                    <span>Page {page} / {totalPages}</span>

                    <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Suivante →
                    </button>
                </div>
            )}
        </section>

        <Footer />
      </>
    );
}

export default Catalogue;