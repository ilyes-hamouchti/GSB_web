# GSB Web

Projet de deuxième année de BTS SIO : maquette d'une boutique GSB destinée aux professionnels de santé.

## Lancer le projet

Prérequis : Node.js et npm.

```sh
npm install
npm run dev
```

Les scripts `npm run lint` et `npm run build` permettent respectivement de lancer Oxlint et de produire la version de production.

## Fonctionnalités de la maquette

- Parcourir, rechercher, filtrer, trier et paginer le catalogue local.
- Consulter la fiche d'un produit et ajuster la quantité.
- Ajouter et retirer des produits du panier, modifier les quantités et consulter les totaux HT/TTC.
- Créer des commandes de démonstration depuis le panier, consulter l'historique local et recommander les mêmes articles.
- Accéder à une page de connexion de démonstration.

Le catalogue et le panier sont gérés côté navigateur. Le panier est conservé pendant la navigation, mais n'est pas enregistré après le rechargement de la page. L'historique des commandes de démonstration est conservé dans le stockage local du navigateur. Aucun service d'authentification, de paiement ou de commande n'est connecté : les données affichées sont fictives et aucune commande réelle n'est envoyée.

## Publication

Le workflow GitHub Actions `.github/workflows/deploy-pages.yml` vérifie, construit et publie le site GitHub Pages à chaque push sur la branche `ilyes-hamouchti-portfolio-completion`. L'application utilise le préfixe `/GSB_web/` et une page de repli pour prendre en charge les URL directes des fiches produit.
