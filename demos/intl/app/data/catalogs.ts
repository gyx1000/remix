import type { IntlCatalogs } from 'remix/intl'

export const catalogs = {
  en: {
    'app.title': 'Remix Intl',
    'app.subtitle': 'One request-scoped translator across SSR, hydration, and Frames.',
    'language.label': 'Language',
    'language.submit': 'Reload document',
    'nav.home': 'Overview',
    'section.ssr': 'Full SSR',
    'section.scopes': 'Scopes',
    'section.pluralMessages': 'Plural messages',
    'section.intl': 'Native Intl examples',
    'badge.locale': 'Active locale',
    'badge.fallbacks': 'Fallback chain',
    'button.save': 'Save',
    'account.settings.save': 'Save account settings',
    checkout: {
      actions: {
        confirm: 'Confirm order',
      },
      pay_now: 'Pay now',
      summary: {
        total: 'Total due',
      },
    },
    home: {
      'hero.title': 'Request-scoped internationalization',
      'hero.copy':
        'The server negotiates the locale, resolves fallback catalogs, and renders translated HTML for each request.',
      'ssr.copy':
        'Rendered on the server with locale fallback. In Swiss French, checkout uses fr-CH while account settings fall back to fr.',
      'checkout.label': 'Checkout',
      'checkout.title': 'Checkout',
      'scopes.copy':
        'Use route-local scopes to keep translation keys short while lookup and fallback stay server-side.',
      'intl.copy':
        'The request-scoped translator also exposes native Intl primitives for formatting, sorting, segmenting, and inspecting locale data.',
      'intl.numberFormat.description': 'Currency and number formatting',
      'intl.dateTimeFormat.description': 'Date, time, calendar, and timezone formatting',
      'intl.relativeTimeFormat.description': 'Human relative time',
      'intl.listFormat.description': 'Localized list separators',
      'intl.displayNames.description': 'Localized names for regions, languages, scripts, and more',
      'intl.pluralRules.description': 'Locale-specific plural categories',
      'pluralMessages.description': 'The translator selects the right message by count.',
      'pluralMessages.value': {
        zero: 'No unread messages',
        one: '%{count} unread message',
        other: '%{count} unread messages',
      },
      'intl.collator.description': 'Language-sensitive string sorting and comparison',
      'intl.segmenter.description': 'Locale-aware text segmentation',
      'intl.locale.description': 'Locale parsing and normalization',
      'intl.durationFormat.description':
        'Localized structured durations when supported by the runtime',
      'intl.getCanonicalLocales.description': 'Locale tag canonicalization',
      'intl.supportedValuesOf.description':
        'Runtime-supported calendars, currencies, units, timezones, and more',
    },
  },
  fr: {
    'app.title': 'Remix Intl',
    'app.subtitle': 'Un traducteur par requête pour le SSR, l’hydratation et les Frames.',
    'language.label': 'Langue',
    'language.submit': 'Recharger le document',
    'nav.home': 'Vue d’ensemble',
    'section.ssr': 'SSR complet',
    'section.scopes': 'Scopes',
    'section.pluralMessages': 'Messages pluriels',
    'section.intl': 'Exemples Intl natifs',
    'badge.locale': 'Locale active',
    'badge.fallbacks': 'Chaîne de fallback',
    'button.save': 'Enregistrer',
    'account.settings.save': 'Enregistrer les paramètres du compte',
    checkout: {
      actions: {
        confirm: 'Confirmer la commande',
      },
      pay_now: 'Payer maintenant',
      summary: {
        total: 'Total à payer',
      },
    },
    home: {
      'hero.title': 'Internationalisation par requête',
      'hero.copy':
        'Le serveur négocie la locale, résout les catalogues de fallback, et rend le HTML traduit à chaque requête.',
      'ssr.copy':
        'Rendu côté serveur avec fallback de locale. En français suisse, le paiement utilise fr-CH pendant que les paramètres du compte retombent sur fr.',
      'checkout.label': 'Paiement',
      'checkout.title': 'Paiement',
      'scopes.copy':
        'Utilisez des scopes locaux à la route pour garder des clés courtes pendant que la résolution et le fallback restent côté serveur.',
      'intl.copy':
        'Le traducteur de la requête expose aussi des primitives Intl natives pour formater, trier, segmenter et inspecter les données de locale.',
      'intl.numberFormat.description': 'Formatage des devises et des nombres',
      'intl.dateTimeFormat.description':
        'Formatage des dates, heures, calendriers et fuseaux horaires',
      'intl.relativeTimeFormat.description': 'Temps relatif lisible',
      'intl.listFormat.description': 'Séparateurs de listes localisés',
      'intl.displayNames.description':
        'Noms localisés pour les régions, langues, écritures et plus encore',
      'intl.pluralRules.description': 'Catégories de pluriel propres à la locale',
      'pluralMessages.description': 'Le traducteur choisit le bon message selon le nombre.',
      'pluralMessages.value': {
        zero: 'Aucun message non lu',
        one: '%{count} message non lu',
        other: '%{count} messages non lus',
      },
      'intl.collator.description': 'Tri et comparaison de chaînes sensibles à la langue',
      'intl.segmenter.description': 'Segmentation de texte adaptée à la locale',
      'intl.locale.description': 'Analyse et normalisation des tags de locale',
      'intl.durationFormat.description':
        'Durées structurées localisées lorsque le runtime les prend en charge',
      'intl.getCanonicalLocales.description': 'Canonicalisation des tags de locale',
      'intl.supportedValuesOf.description':
        'Calendriers, devises, unités, fuseaux horaires et autres valeurs pris en charge par le runtime',
    },
  },
  'fr-CH': {
    'language.submit': 'Recharger la page',
    checkout: {
      actions: {
        confirm: 'Confirmer la commande',
      },
      pay_now: 'Payer maintenant',
      summary: {
        total: 'Montant à payer',
      },
    },
    home: {
      'checkout.label': 'Commande',
      'checkout.title': 'Commande',
      'pluralMessages.description': 'Le traducteur choisit le bon message selon le nombre.',
      'pluralMessages.value': {
        zero: 'Aucun message non lu',
        one: '%{count} message non lu',
        other: '%{count} messages non lus',
      },
    },
  },
  it: {
    'app.title': 'Remix Intl',
    'app.subtitle': 'Un traduttore per richiesta per SSR, idratazione e Frames.',
    'language.label': 'Lingua',
    'language.submit': 'Ricarica il documento',
    'nav.home': 'Panoramica',
    'section.ssr': 'SSR completo',
    'section.scopes': 'Scope',
    'section.pluralMessages': 'Messaggi plurali',
    'section.intl': 'Esempi Intl nativi',
    'badge.locale': 'Locale attiva',
    'badge.fallbacks': 'Catena di fallback',
    'button.save': 'Salva',
    'account.settings.save': "Salva le impostazioni dell'account",
    checkout: {
      actions: {
        confirm: "Conferma l'ordine",
      },
      pay_now: 'Paga ora',
      summary: {
        total: 'Totale da pagare',
      },
    },
    home: {
      'hero.title': 'Internazionalizzazione per richiesta',
      'hero.copy':
        'Il server negozia la locale, risolve i cataloghi di fallback e renderizza HTML tradotto per ogni richiesta.',
      'ssr.copy':
        "Rendering sul server con fallback di locale. In francese svizzero, il checkout usa fr-CH mentre le impostazioni dell'account ricadono su fr.",
      'checkout.label': 'Pagamento',
      'checkout.title': 'Pagamento',
      'scopes.copy':
        'Usa scope locali alla route per mantenere brevi le chiavi mentre risoluzione e fallback restano sul server.',
      'intl.copy':
        'Il traduttore della richiesta espone anche primitive Intl native per formattare, ordinare, segmentare e ispezionare i dati della locale.',
      'intl.numberFormat.description': 'Formattazione di valute e numeri',
      'intl.dateTimeFormat.description': 'Formattazione di date, orari, calendari e fusi orari',
      'intl.relativeTimeFormat.description': 'Tempo relativo leggibile',
      'intl.listFormat.description': 'Separatori di elenco localizzati',
      'intl.displayNames.description':
        'Nomi localizzati per regioni, lingue, scritture e altro ancora',
      'intl.pluralRules.description': 'Categorie plurali specifiche della locale',
      'pluralMessages.description':
        'Il traduttore sceglie il messaggio corretto in base al conteggio.',
      'pluralMessages.value': {
        zero: 'Nessun messaggio non letto',
        one: '%{count} messaggio non letto',
        other: '%{count} messaggi non letti',
      },
      'intl.collator.description': 'Ordinamento e confronto di stringhe sensibili alla lingua',
      'intl.segmenter.description': 'Segmentazione del testo sensibile alla locale',
      'intl.locale.description': 'Analisi e normalizzazione dei tag di locale',
      'intl.durationFormat.description':
        'Durate strutturate localizzate quando supportate dal runtime',
      'intl.getCanonicalLocales.description': 'Canonicalizzazione dei tag di locale',
      'intl.supportedValuesOf.description':
        'Calendari, valute, unità, fusi orari e altri valori supportati dal runtime',
    },
  },
  de: {
    'app.title': 'Remix Intl',
    'app.subtitle': 'Ein Übersetzer pro Request für SSR, Hydration und Frames.',
    'language.label': 'Sprache',
    'language.submit': 'Dokument neu laden',
    'nav.home': 'Übersicht',
    'section.ssr': 'Vollständiges SSR',
    'section.scopes': 'Scopes',
    'section.pluralMessages': 'Pluralnachrichten',
    'section.intl': 'Native Intl-Beispiele',
    'badge.locale': 'Aktive Locale',
    'badge.fallbacks': 'Fallback-Kette',
    'button.save': 'Speichern',
    'account.settings.save': 'Kontoeinstellungen speichern',
    checkout: {
      actions: {
        confirm: 'Bestellung bestätigen',
      },
      pay_now: 'Jetzt bezahlen',
      summary: {
        total: 'Zu zahlender Gesamtbetrag',
      },
    },
    home: {
      'hero.title': 'Internationalisierung pro Request',
      'hero.copy':
        'Der Server handelt die Locale aus, löst Fallback-Kataloge auf und rendert übersetztes HTML für jeden Request.',
      'ssr.copy':
        'Serverseitig gerendert mit Locale-Fallback. In Schweizer Französisch verwendet Checkout fr-CH, während Kontoeinstellungen auf fr zurückfallen.',
      'checkout.label': 'Kasse',
      'checkout.title': 'Kasse',
      'scopes.copy':
        'Verwende route-lokale Scopes, um Übersetzungsschlüssel kurz zu halten, während Auflösung und Fallback serverseitig bleiben.',
      'intl.copy':
        'Der Request-Übersetzer stellt auch gecachte native Intl-Primitive zum Formatieren, Sortieren, Segmentieren und Prüfen von Locale-Daten bereit.',
      'intl.numberFormat.description': 'Währungs- und Zahlenformatierung',
      'intl.dateTimeFormat.description': 'Formatierung von Datum, Uhrzeit, Kalendern und Zeitzonen',
      'intl.relativeTimeFormat.description': 'Lesbare relative Zeitangaben',
      'intl.listFormat.description': 'Lokalisierte Listentrennzeichen',
      'intl.displayNames.description':
        'Lokalisierte Namen für Regionen, Sprachen, Schriften und mehr',
      'intl.pluralRules.description': 'Locale-spezifische Pluralkategorien',
      'pluralMessages.description':
        'Der Übersetzer wählt anhand der Anzahl die passende Nachricht.',
      'pluralMessages.value': {
        zero: 'Keine ungelesenen Nachrichten',
        one: '%{count} ungelesene Nachricht',
        other: '%{count} ungelesene Nachrichten',
      },
      'intl.collator.description': 'Sprachsensitives Sortieren und Vergleichen von Zeichenfolgen',
      'intl.segmenter.description': 'Locale-bewusste Textsegmentierung',
      'intl.locale.description': 'Parsen und Normalisieren von Locale-Tags',
      'intl.durationFormat.description':
        'Lokalisierte strukturierte Dauern, wenn sie vom Runtime unterstützt werden',
      'intl.getCanonicalLocales.description': 'Kanonisierung von Locale-Tags',
      'intl.supportedValuesOf.description':
        'Vom Runtime unterstützte Kalender, Währungen, Einheiten, Zeitzonen und weitere Werte',
    },
  },
} satisfies IntlCatalogs
