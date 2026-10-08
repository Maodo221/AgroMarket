/* =====================================================
   AGROMARKET - JAVASCRIPT
===================================================== */

/* =====================================================
   1. INITIALISATION DU PANIER
===================================================== */

// Récupérer les produits sauvegardés dans le navigateur
let panier = JSON.parse(localStorage.getItem("panier")) || [];

/* =====================================================
   2. AFFICHER LE PANIER
===================================================== */

function afficherPanier() {
  const liste = document.getElementById("liste-panier");
  const totalEl = document.getElementById("total");
  const totalResume = document.getElementById("total-resume");
  const nbEl = document.getElementById("nb-panier");
  const panierVide = document.querySelector(".panier-vide");

  // Mettre à jour le nombre de produits dans le header
  if (nbEl) {
    nbEl.textContent = panier.length;
  }

  // Vérifier si les éléments du panier existent
  if (!liste || !totalEl) {
    return;
  }

  // Vider l'ancienne liste
  liste.innerHTML = "";

  let total = 0;

  // Vérifier si le panier est vide
  if (panier.length === 0) {
    if (panierVide) {
      panierVide.style.display = "block";
    }
  } else {
    if (panierVide) {
      panierVide.style.display = "none";
    }
  }

  // Afficher chaque produit
  panier.forEach((item, index) => {
    total += Number(item.prix);

    const li = document.createElement("li");

    li.innerHTML = `
            <div class="produit-panier-info">
                <strong>${item.nom}</strong>
                <span>${item.prix} FCFA</span>
            </div>

            <button
                type="button"
                onclick="supprimer(${index})">
                Supprimer
            </button>
        `;

    liste.appendChild(li);
  });

  // Afficher le total principal
  totalEl.textContent = total.toLocaleString("fr-FR");

  // Afficher le total dans le résumé
  if (totalResume) {
    totalResume.textContent = total.toLocaleString("fr-FR");
  }
}

/* =====================================================
   3. AJOUTER UN PRODUIT AU PANIER
===================================================== */

function ajouterPanier(nom, prix) {
  const prixNumerique = Number(prix);

  // Vérifier que le prix est valide
  if (!nom || isNaN(prixNumerique) || prixNumerique < 0) {
    console.error("Nom ou prix du produit invalide.");
    return;
  }

  // Ajouter le produit
  panier.push({
    nom: nom,
    prix: prixNumerique,
    id: Date.now(),
  });

  // Sauvegarder les modifications
  sauvegarderPanier();

  // Actualiser l'affichage
  afficherPanier();

  // Afficher une notification
  showMessage(`${nom} ajouté au panier ✅`);
}

/* =====================================================
   4. SUPPRIMER UN PRODUIT
===================================================== */

function supprimer(index) {
  // Vérifier si le produit existe
  if (!panier[index]) {
    return;
  }

  const nomProduit = panier[index].nom;

  // Supprimer un seul produit
  panier.splice(index, 1);

  // Sauvegarder et actualiser
  sauvegarderPanier();
  afficherPanier();

  showMessage(`${nomProduit} supprimé du panier 🗑️`);
}

/* =====================================================
   5. SAUVEGARDER LE PANIER
===================================================== */

function sauvegarderPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

/* =====================================================
   6. VIDER LE PANIER
===================================================== */

function viderPanier() {
  panier = [];

  sauvegarderPanier();
  afficherPanier();

  // Réinitialiser le numéro de paiement
  const numero = document.getElementById("numero");

  if (numero) {
    numero.value = "";
  }

  showMessage("Votre panier a été vidé 🛒");
}

/* =====================================================
   7. NOTIFICATION
===================================================== */

function showMessage(text) {
  const msg = document.createElement("div");

  msg.textContent = text;

  msg.style.position = "fixed";
  msg.style.bottom = "90px";
  msg.style.right = "20px";
  msg.style.background = "#2e7d32";
  msg.style.color = "white";
  msg.style.padding = "12px 18px";
  msg.style.borderRadius = "10px";
  msg.style.fontSize = "14px";
  msg.style.fontFamily = "Arial, sans-serif";
  msg.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 2500);
}

/* =====================================================
   8. COMMANDER VIA WHATSAPP
===================================================== */

function commander() {
  // Vérifier si le panier est vide
  if (panier.length === 0) {
    alert("Votre panier est vide !");

    return;
  }

  let message = "🥕 *Nouvelle commande AgroMarket*\n\n";
  let total = 0;

  panier.forEach((item) => {
    message += `• ${item.nom} - ${item.prix} FCFA\n`;

    total += Number(item.prix);
  });

  message += `\n💰 *Total : ${total} FCFA*`;

  const numero = "221705404081";

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

/* =====================================================
   9. SIMULATION DE PAIEMENT
===================================================== */

function payer() {
  const methodeEl = document.getElementById("methode");
  const numeroEl = document.getElementById("numero");

  // Vérifier la présence des champs
  if (!methodeEl || !numeroEl) {
    console.error("Champs de paiement introuvables.");

    return;
  }

  const methode = methodeEl.value;
  const numero = numeroEl.value.trim();

  // Vérifier si le panier est vide
  if (panier.length === 0) {
    alert("Votre panier est vide !");

    return;
  }

  // Vérifier le numéro
  if (!numero || numero.length < 9) {
    alert("Numéro invalide !");

    return;
  }

  // Calculer le total
  const total = panier.reduce((somme, item) => somme + Number(item.prix), 0);

  // Déterminer le nom du moyen de paiement
  const nomMethode =
    methode === "orange"
      ? "Orange Money"
      : methode === "wave"
        ? "Wave"
        : "Autre";

  alert(
    `✅ Paiement réussi !\n\n` +
      `Méthode : ${nomMethode}\n` +
      `Montant : ${total} FCFA`,
  );

  // Vider le panier après la simulation
  viderPanier();
}

/* =====================================================
   10. CARROUSEL DES CATÉGORIES
===================================================== */

// Déplacer vers la droite
function slideRight() {
  const slider = document.getElementById("categories-slider");

  if (!slider) {
    return;
  }

  slider.scrollBy({
    left: 300,
    behavior: "smooth",
  });
}

// Déplacer vers la gauche
function slideLeft() {
  const slider = document.getElementById("categories-slider");

  if (!slider) {
    return;
  }

  slider.scrollBy({
    left: -300,
    behavior: "smooth",
  });
}

/* =====================================================
   11. DÉFILEMENT AUTOMATIQUE
===================================================== */

function demarrerCarrouselAutomatique() {
  const slider = document.getElementById("categories-slider");

  // Arrêter si le carrousel n'existe pas
  if (!slider) {
    return;
  }

  setInterval(() => {
    const estAlaFin =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;

    if (estAlaFin) {
      // Retourner au début
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      // Continuer vers la droite
      slider.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }, 3000);
}

/* =====================================================
   12. FORMULAIRE DE CONTACT
===================================================== */

function initialiserFormulaireContact() {
  const formulaireContact = document.getElementById("contact-form");

  // Vérifier si le formulaire existe
  if (!formulaireContact) {
    return;
  }

  formulaireContact.addEventListener("submit", function (event) {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs
    const nom = document.getElementById("nom")?.value || "";

    const email = document.getElementById("email")?.value || "";

    const telephone = document.getElementById("telephone")?.value || "";

    const sujet = document.getElementById("sujet")?.value || "";

    const message = document.getElementById("message")?.value || "";

    // Préparer le message
    const texte = `
Bonjour AgroMarket !

Nouveau message reçu depuis le formulaire de contact.

Nom : ${nom}

E-mail : ${email}

Téléphone : ${telephone}

Sujet : ${sujet}

Message :

${message}
            `;

    // Encoder le message
    const messageEncode = encodeURIComponent(texte);

    // Numéro WhatsApp
    const numeroWhatsApp = "221705404081";

    // Créer le lien WhatsApp
    const lienWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${messageEncode}`;

    // Ouvrir WhatsApp
    window.open(lienWhatsApp, "_blank");
  });
}

/* =====================================================
   13. INITIALISATION DU SITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Afficher le panier au chargement
  afficherPanier();

  // Lancer le carrousel automatique
  demarrerCarrouselAutomatique();

  // Activer le formulaire de contact
  initialiserFormulaireContact();

  console.log("AgroMarket JavaScript chargé avec succès ✅");
});

// Toggle button

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", function () {
  nav.classList.toggle("active");
});
