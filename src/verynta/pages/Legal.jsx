// DRAFT legal texts. Every [BRACKETED] field must be completed, and the texts
// reviewed by an accountant or lawyer, before the site takes payments.
import { Header, Footer } from '../Layout'

const SELLER = {
  name: '[DÉNOMINATION SOCIALE DE LA SAS]',
  capital: '[CAPITAL] €',
  address: '[ADRESSE DU SIÈGE]',
  rcs: '[RCS VILLE + SIREN]',
  vat: '[N° TVA INTRACOMMUNAUTAIRE]',
  director: '[NOM DU PRÉSIDENT DE LA SAS]',
}

function Mentions() {
  return (
    <>
      <h1 className="vy-h2">Mentions légales</h1>
      <h2>Éditeur du site</h2>
      <p>Le site verynta.com est édité par {SELLER.name}, société par actions simplifiée au capital de {SELLER.capital}, dont le siège est situé {SELLER.address}, immatriculée au {SELLER.rcs}, n° TVA {SELLER.vat}.</p>
      <p>Directeur de la publication : {SELLER.director}.</p>
      <p>Contact : hello@verynta.com</p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. [ADRESSE À VÉRIFIER]</p>
      <h2>Propriété intellectuelle</h2>
      <p>La marque Verynta, le nom de domaine verynta.com, la méthode d'évaluation et la plateforme sont la propriété de Vitaliy Charushin et sont exploités par {SELLER.name} sous licence. Toute reproduction sans autorisation est interdite.</p>
    </>
  )
}

function Cgv() {
  return (
    <>
      <h1 className="vy-h2">Conditions générales de vente</h1>
      <p className="vy-muted">English translation for information below the French text is to be added. In case of discrepancy, the French version prevails.</p>
      <h2>1. Objet</h2>
      <p>Les présentes conditions régissent la vente, par {SELLER.name} (« le Prestataire »), sous la marque Verynta, de l'évaluation de préparation au marché français (« l'Évaluation ») et, le cas échéant, du plan d'entrée sur le marché français (« le Plan »).</p>
      <h2>2. Prix</h2>
      <p>L'Évaluation est proposée au prix de 39 € hors taxes ; le Plan au prix de 790 € hors taxes. La TVA est appliquée selon les règles en vigueur en fonction de la qualité et du pays du client : autoliquidation pour les clients assujettis établis dans l'Union européenne hors de France, hors champ de la TVA française pour les clients professionnels établis hors de l'Union européenne, TVA française au taux en vigueur dans les autres cas. L'Évaluation et le Plan sont des prestations distinctes, facturées séparément ; le prix de l'une n'est pas déductible du prix de l'autre.</p>
      <h2>3. Commande et paiement</h2>
      <p>La commande est passée en ligne et payée par carte via Stripe. Une facture est émise à la validation du paiement.</p>
      <h2>4. Exécution</h2>
      <p>Après paiement, le Prestataire adresse au client par email un questionnaire sectoriel dans un délai de 2 jours ouvrés. Le rapport d'évaluation est remis dans un délai de 5 jours ouvrés à compter de la réception du questionnaire complété. Le client s'engage à fournir des informations exactes ; l'Évaluation repose sur ces informations.</p>
      <h2>5. Questionnaire non retourné</h2>
      <p>Si le questionnaire complété n'est pas retourné dans un délai de 30 jours à compter de son envoi, la prestation est réputée abandonnée par le client et aucun remboursement n'est dû.</p>
      <h2>6. Droit de rétractation</h2>
      <p>Les clients professionnels ne bénéficient pas du droit de rétractation. Le client consommateur dispose d'un délai de 14 jours à compter de la commande ; en demandant l'exécution de la prestation avant la fin de ce délai, il reconnaît perdre son droit de rétractation une fois la prestation pleinement exécutée, et doit à défaut le montant correspondant aux services fournis jusqu'à la rétractation.</p>
      <h2>7. Nature de la prestation et responsabilité</h2>
      <p>L'Évaluation est un avis professionnel d'aide à la décision. Elle ne constitue ni un conseil juridique, fiscal ou réglementaire, ni une garantie de résultat commercial. La responsabilité du Prestataire est limitée au montant payé pour la prestation concernée.</p>
      <h2>8. Données personnelles</h2>
      <p>Voir la politique de confidentialité.</p>
      <h2>9. Droit applicable et litiges</h2>
      <p>Les présentes conditions sont soumises au droit français. Le client consommateur peut recourir gratuitement au médiateur de la consommation : [NOM ET COORDONNÉES DU MÉDIATEUR]. À défaut d'accord amiable, les tribunaux de [VILLE] sont compétents pour les clients professionnels.</p>
    </>
  )
}

function Privacy() {
  return (
    <>
      <h1 className="vy-h2">Politique de confidentialité</h1>
      <h2>Responsable du traitement</h2>
      <p>{SELLER.name}, {SELLER.address}. Contact : hello@verynta.com</p>
      <h2>Données collectées et finalités</h2>
      <p>Informations sur l'entreprise et coordonnées fournies dans le questionnaire d'admission, réponses au questionnaire sectoriel, données de facturation. Elles servent à calculer la position préliminaire, à réaliser l'Évaluation commandée, à facturer et à répondre aux demandes.</p>
      <h2>Bases légales</h2>
      <p>Exécution du contrat pour les prestations commandées ; intérêt légitime pour le traitement des demandes et le suivi commercial ; obligation légale pour la facturation.</p>
      <h2>Destinataires et sous-traitants</h2>
      <p>Vitaliy Charushin (réalisation des évaluations), Supabase (stockage des données), Stripe (paiement), Resend (envoi d'emails), Vercel (hébergement). Certains prestataires sont établis hors de l'Union européenne ; les transferts sont encadrés par les clauses contractuelles types de la Commission européenne.</p>
      <h2>Durée de conservation</h2>
      <p>Données de prospection : 3 ans après le dernier contact. Données liées aux prestations : durée de la relation puis 5 ans. Pièces comptables : 10 ans.</p>
      <h2>Vos droits</h2>
      <p>Accès, rectification, effacement, limitation, opposition et portabilité, en écrivant à hello@verynta.com. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).</p>
    </>
  )
}

const PAGES = { mentions: Mentions, cgv: Cgv, privacy: Privacy }

export default function Legal({ page }) {
  const Page = PAGES[page] || Mentions
  return (
    <div className="vy-app">
      <Header />
      <main className="vy-wrap vy-narrow vy-section vy-legal" lang="fr">
        <Page />
      </main>
      <Footer />
    </div>
  )
}
