export type Language = 'EN' | 'RW'

const dict: Record<Language, Record<string, string>> = {
  EN: {
    'nav.browse': 'Browse',
    'nav.residential': 'Residential',
    'nav.commercial': 'Commercial',
    'nav.map': 'Map View',
    'nav.myBookings': 'My Bookings',
    'nav.saved': 'Saved Properties',
    'nav.settings': 'Settings',
    'search.placeholder': 'Try: furnished shop near Kimironko market under 300k RWF',
    'label.verified': 'Verified',
    'button.bookVisit': 'Book a Visit',
    'button.whatsapp': 'Contact via WhatsApp',
    'empty.noResults': 'No properties found in this area. Try different filters.',
    'empty.noSaved': 'No saved properties yet.',
    'empty.noCompare': 'Select at least 2 properties to compare.',
    'button.compare': 'Compare',
    'button.report': 'Report',
    'button.save': 'Save',
    'button.saved': 'Saved',
    'toast.savedLogin': 'Login to save properties.',
    'toast.reportSubmitted': 'Report submitted. Our team will review within 24 hours.',
  },
  RW: {
    'nav.browse': 'Reba',
    'nav.residential': 'Ahantu ho Kubamo',
    'nav.commercial': 'Ahantu ho Gukorera',
    'nav.map': 'Reba Ku Mepu',
    'nav.myBookings': 'Amabukiro Yanjye',
    'nav.saved': 'Ibintu Nabikiye',
    'nav.settings': 'Igenamiterere',
    'search.placeholder': 'Urugero: iduka ryiza hafi ya Kimironko munsi ya 300k RWF',
    'label.verified': 'Emejwe',
    'button.bookVisit': 'Saba Gusura',
    'button.whatsapp': 'Twandikire kuri WhatsApp',
    'empty.noResults': 'Nta mpapuro ziboneka muri iyi zone. Gerageza izindi filtration.',
    'empty.noSaved': 'Nta kintu nabitswe hano kugeza ubu.',
    'empty.noCompare': 'Hitamo nibura ibipimo 2 byo kugereranya.',
    'button.compare': 'Gereranya',
    'button.report': 'Tangaza Ikibazo',
    'button.save': 'Kubika',
    'button.saved': 'Byabitswe',
    'toast.savedLogin': 'Injira ngo ubike ibibanza.',
    'toast.reportSubmitted': 'Raporo yoherejwe. Ikipe yacu izabireba mu masaha 24.',
  },
}

export function t(lang: Language, key: string) {
  return dict[lang]?.[key] ?? dict.EN[key] ?? key
}

