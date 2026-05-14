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
    checkout: {
      pay_now: 'Pay now',
    },
    home: {
      'hero.title': 'Internationalization without global state',
      'hero.copy':
        'The server negotiates the locale, resolves fallback catalogs, and renders translated HTML for each request.',
      'ssr.copy':
        'This card is rendered entirely on the server. Switch to Swiss French to see "Checkout" come from fr-CH while "Save" falls back to fr.',
      'checkout.label': 'Checkout',
      'scopes.copy':
        'Route code can use direct hierarchical keys or a Rails-style scope option while all translation lookup stays on the server.',
      'intl.copy':
        'The request-scoped translator also exposes cached native Intl primitives for formatting, sorting, segmenting, and inspecting locale data.',
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
    checkout: {
      pay_now: 'Payer maintenant',
    },
    home: {
      'hero.title': 'Internationalisation sans état global',
      'hero.copy':
        'Le serveur négocie la locale, résout les catalogues de fallback, et rend le HTML traduit à chaque requête.',
      'ssr.copy':
        'Cette carte est entièrement rendue côté serveur. Passez en français suisse pour voir "Checkout" venir de fr-CH pendant que "Save" retombe sur fr.',
      'checkout.label': 'Paiement',
      'scopes.copy':
        'Le code des routes peut utiliser des clés hiérarchiques directes ou une option scope façon Rails pendant que toute la traduction reste côté serveur.',
      'intl.copy':
        'Le traducteur de la requête expose aussi des primitives Intl natives mises en cache pour formater, trier, segmenter et inspecter les données de locale.',
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
      pay_now: 'Payer maintenant',
    },
    home: {
      'checkout.label': 'Commande',
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
    checkout: {
      pay_now: 'Paga ora',
    },
    home: {
      'hero.title': 'Internazionalizzazione senza stato globale',
      'hero.copy':
        'Il server negozia la locale, risolve i cataloghi di fallback e renderizza HTML tradotto per ogni richiesta.',
      'ssr.copy':
        'Questa scheda viene renderizzata interamente sul server. Passa al francese svizzero per vedere "Checkout" arrivare da fr-CH mentre "Save" ricade su fr.',
      'checkout.label': 'Pagamento',
      'scopes.copy':
        'Il codice delle route può usare chiavi gerarchiche dirette o un’opzione scope in stile Rails mentre tutta la risoluzione delle traduzioni resta sul server.',
      'intl.copy':
        'Il traduttore della richiesta espone anche primitive Intl native in cache per formattare, ordinare, segmentare e ispezionare i dati della locale.',
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
    checkout: {
      pay_now: 'Jetzt bezahlen',
    },
    home: {
      'hero.title': 'Internationalisierung ohne globalen Zustand',
      'hero.copy':
        'Der Server handelt die Locale aus, löst Fallback-Kataloge auf und rendert übersetztes HTML für jeden Request.',
      'ssr.copy':
        'Diese Karte wird vollständig auf dem Server gerendert. Wechsle zu Schweizer Französisch, um zu sehen, wie "Checkout" aus fr-CH kommt, während "Save" auf fr zurückfällt.',
      'checkout.label': 'Kasse',
      'scopes.copy':
        'Route-Code kann direkte hierarchische Schlüssel oder eine Rails-artige scope-Option verwenden, während die gesamte Übersetzungsauflösung auf dem Server bleibt.',
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
