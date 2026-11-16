import { useState } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import './Compte.css';

const COMPTE_STORAGE_KEY = 'gsb-compte';
const dateFormattee = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function donneesInitiales() {
    return {
        profil: { nom: '', email: '', etablissement: '' },
        commentaires: [],
        erreur: '',
    };
}

function lireCompte() {
    try {
        const contenu = window.localStorage.getItem(COMPTE_STORAGE_KEY);
        if (!contenu) return donneesInitiales();

        const sauvegarde = JSON.parse(contenu);
        if (!sauvegarde || typeof sauvegarde !== 'object') {
            throw new Error('Le format des données du compte est invalide.');
        }

        const commentaires = Array.isArray(sauvegarde.commentaires)
            ? sauvegarde.commentaires.filter((commentaire) => (
                commentaire
                && typeof commentaire.id === 'number'
                && typeof commentaire.texte === 'string'
                && !Number.isNaN(Date.parse(commentaire.date))
            ))
            : [];

        return {
            profil: {
                nom: typeof sauvegarde.profil?.nom === 'string' ? sauvegarde.profil.nom : '',
                email: typeof sauvegarde.profil?.email === 'string' ? sauvegarde.profil.email : '',
                etablissement: typeof sauvegarde.profil?.etablissement === 'string'
                    ? sauvegarde.profil.etablissement
                    : '',
            },
            commentaires,
            erreur: '',
        };
    } catch (error) {
        console.error('Impossible de lire les données du compte de démonstration.', error);
        return {
            ...donneesInitiales(),
            erreur: 'Les données locales du compte sont indisponibles sur ce navigateur.',
        };
    }
}

function Compte() {
    const [compte, setCompte] = useState(lireCompte);
    const [profil, setProfil] = useState(compte.profil);
    const [nouveauCommentaire, setNouveauCommentaire] = useState('');
    const [message, setMessage] = useState('');

    function sauvegarder(donnees) {
        try {
            window.localStorage.setItem(COMPTE_STORAGE_KEY, JSON.stringify(donnees));
            setCompte({ ...donnees, erreur: '' });
            setMessage('Les données ont été enregistrées dans ce navigateur.');
            return true;
        } catch (error) {
            console.error('Impossible d’enregistrer les données du compte de démonstration.', error);
            setCompte({ ...donnees, erreur: 'Enregistrement local indisponible.' });
            setMessage('Les modifications ne sont conservées que jusqu’à la fermeture de cette session.');
            return false;
        }
    }

    function enregistrerProfil(event) {
        event.preventDefault();
        sauvegarder({ ...compte, profil });
    }

    function ajouterCommentaire(event) {
        event.preventDefault();
        const texte = nouveauCommentaire.trim();
        if (!texte) return;

        const commentaires = [
            {
                id: Date.now(),
                texte,
                date: new Date().toISOString(),
            },
            ...compte.commentaires,
        ];

        if (sauvegarder({ ...compte, commentaires })) {
            setNouveauCommentaire('');
        }
    }

    function supprimerCommentaire(id) {
        const commentaires = compte.commentaires.filter((commentaire) => commentaire.id !== id);
        sauvegarder({ ...compte, commentaires });
    }

    return (
        <>
            <Header />
            <main className="account-page">
                <div className="account-page__heading">
                    <h1>Mon compte</h1>
                    <p>Gérez vos informations et vos commentaires de démonstration.</p>
                </div>

                <p className="account-page__notice">
                    Mode démonstration : aucun compte n’est authentifié. Les informations et commentaires
                    saisis restent dans le stockage local de ce navigateur et ne sont envoyés à personne.
                </p>

                {compte.erreur && (
                    <p className="account-page__error" role="status">{compte.erreur}</p>
                )}
                {message && <p className="account-page__status" role="status">{message}</p>}

                <div className="account-page__grid">
                    <section className="account-card">
                        <h2>Informations du profil</h2>
                        <form className="account-form" onSubmit={enregistrerProfil}>
                            <label htmlFor="account-name">Nom</label>
                            <input
                                id="account-name"
                                type="text"
                                autoComplete="name"
                                maxLength={100}
                                value={profil.nom}
                                onChange={(event) => setProfil({ ...profil, nom: event.target.value })}
                            />

                            <label htmlFor="account-email">Adresse e-mail</label>
                            <input
                                id="account-email"
                                type="email"
                                autoComplete="email"
                                maxLength={254}
                                value={profil.email}
                                onChange={(event) => setProfil({ ...profil, email: event.target.value })}
                            />

                            <label htmlFor="account-organization">Établissement (facultatif)</label>
                            <input
                                id="account-organization"
                                type="text"
                                autoComplete="organization"
                                maxLength={120}
                                value={profil.etablissement}
                                onChange={(event) => setProfil({ ...profil, etablissement: event.target.value })}
                            />

                            <button className="account-form__submit" type="submit">
                                Enregistrer le profil
                            </button>
                        </form>
                    </section>

                    <section className="account-card account-card--comments">
                        <h2>Commentaires</h2>
                        <p className="account-card__description">
                            Ajoutez une note à cette maquette. Elle est visible uniquement sur cet appareil.
                        </p>
                        <form className="comment-form" onSubmit={ajouterCommentaire}>
                            <label htmlFor="account-comment">Votre commentaire</label>
                            <textarea
                                id="account-comment"
                                rows="4"
                                maxLength={500}
                                required
                                value={nouveauCommentaire}
                                onChange={(event) => setNouveauCommentaire(event.target.value)}
                                placeholder="Écrivez un commentaire (500 caractères maximum)"
                            />
                            <div className="comment-form__footer">
                                <span>{nouveauCommentaire.length}/500</span>
                                <button className="account-form__submit" type="submit">
                                    Ajouter le commentaire
                                </button>
                            </div>
                        </form>

                        {compte.commentaires.length === 0 ? (
                            <p className="account-comments__empty">Aucun commentaire enregistré.</p>
                        ) : (
                            <ul className="account-comments">
                                {compte.commentaires.map((commentaire) => (
                                    <li className="account-comment" key={commentaire.id}>
                                        <div>
                                            <time dateTime={commentaire.date}>
                                                {dateFormattee.format(new Date(commentaire.date))}
                                            </time>
                                            <p>{commentaire.texte}</p>
                                        </div>
                                        <button
                                            className="account-comment__delete"
                                            type="button"
                                            aria-label="Supprimer ce commentaire"
                                            onClick={() => supprimerCommentaire(commentaire.id)}
                                        >
                                            <Trash2 size={16} aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <nav className="account-shortcuts" aria-label="Accès rapides">
                    <Link to="/commandes">
                        <ShoppingBag size={18} aria-hidden="true" />
                        Consulter mes commandes
                    </Link>
                    <Link to="/panier">
                        <ShoppingCart size={18} aria-hidden="true" />
                        Voir mon panier
                    </Link>
                </nav>
            </main>
            <Footer />
        </>
    );
}

export default Compte;
