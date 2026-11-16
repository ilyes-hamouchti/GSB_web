import { Link } from 'react-router';
import './Header.css';
import Logo from '../assets/logo-GSB.png';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/useCart.js';

function Header() {
    const { nombreArticles } = useCart();

    return (
        <header className="site-header">
            <Link className="site-header__logo" to="/" aria-label="GSB, accueil">
                <img src={Logo} alt="" />
                <h3>GSB</h3>
            </Link>

            <nav className="site-header__nav">
                <Link className="site-header__link" to="/">
                    Catalogue
                </Link>
                <Link className="site-header__link" to="/login">
                    Connexion
                </Link>
            </nav>

            <div className="site-header__panier">
                <Link to="/panier" className="site-header__cart-link">
                    <ShoppingCart aria-hidden="true" />
                    <span>Mon panier</span>
                    <span className="site-header__cart-count" aria-label={`${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`}>
                        {nombreArticles}
                    </span>
                </Link>
            </div>
        </header>
    );
}

export default Header;