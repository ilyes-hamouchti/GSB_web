import { useState } from 'react'
import './Login.css'
import Logo from '../../assets/logo-GSB.png';
import { ClipboardList, ShieldCheck, Package, ArrowRight } from 'lucide-react';

function Login() {
    
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('La connexion n’est pas encore reliée à un service d’authentification. Aucune donnée n’a été envoyée.');
    };

    return (
        <>
            <section className="login__wrapper">
                <div className="login__wrapper-gauche">
                    <div className="login__wrapper-logo">
                        <img src={Logo} alt="" />
                        <h3>GSB</h3>
                    </div>
                    <h1>L’e-boutique des professionnels de santé.</h1>
                    <p>Consultez le catalogue du laboratoire Galaxy Swiss Bourdin et passez commande en ligne, en toute sécurité.</p>

                    <ul>
                        <li><Package color="#13a69f" />Catalogue complet, à jour en temps réel</li>
                        <li><ClipboardList color="#13a69f" />Commande et historique centralisés</li>
                        <li><ShieldCheck color="#13a69f" />Accès réservé et données protégées</li>
                    </ul>
                    
                    <p>Galaxy Swiss Bourdin — Siège : Paris. Accès réservé aux comptes habilités.</p>
                </div>
                
                <div className="login__wrapper-droite">
                    <div className="login__wrapper-container">
                        <h1 className="login__wrapper-title">Connexion</h1>
                        <p className="login__wrapper-subtitle">Maquette de l’espace professionnel GSB.</p>

                        <form onSubmit={handleLogin}>
                
                            <div className="form-email">
                                <input
                                    type="email"
                                    className="form-control login-input"
                                    id="email"
                                    placeholder="prenom.nom@exemple.fr"
                                    autoComplete="email"
                                    required
                                />
                                <label htmlFor="email" className="text-muted">Email</label>
                            </div>
                
                            <div className="form-password">
                                <input
                                    type="password"
                                    className="login-password"
                                    id="password"
                                    placeholder="Mot de passe"
                                    autoComplete="current-password"
                                    required
                                />
                                <label htmlFor="password" className="text-muted">Mot de passe</label>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                Essayer la connexion <ArrowRight color="#fff" />
                            </button>
                        </form>

                        {message && <p className="login-status" role="status">{message}</p>}
                        <p className="login-info">
                            Démonstration : aucun compte n’est créé et aucune commande réelle n’est passée.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Login;
