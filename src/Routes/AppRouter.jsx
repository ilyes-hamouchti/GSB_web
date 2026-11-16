import { Routes, Route, Link } from 'react-router';

import Login from '../pages/login/Login.jsx';
import Catalogue from '../pages/catalogue/Catalogue.jsx';
import Details from '../pages/fiche-produit/Details.jsx';
import Panier from '../pages/panier/Panier.jsx';
import Commandes from '../pages/commandes/Commandes.jsx';

function NotFound() {
    return (
        <main className="not-found">
            <h1>Page introuvable</h1>
            <p>Cette page n’existe pas dans la démonstration GSB.</p>
            <Link to="/">Retour au catalogue</Link>
        </main>
    );
}

function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Catalogue />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRouter;
