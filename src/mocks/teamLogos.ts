/**
 * Team Logos System for SaumaArena
 * Crafted according to /logo-design principles:
 * - Simple, distinctive, geometric marks that work from 16px to 512px
 * - Pure vector SVG data URIs (self-contained, no external network lag)
 * - Identifiers, not explanations: memorable emblems, monograms, and shields
 */

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const TEAM_SVGS: Record<string, string> = {
  // 1. MIN 1 Kota - Hexagonal Islamic Crest with Bold 'M1' Monogram
  'team-min1': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="min1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <polygon points="128,16 228,74 228,182 128,240 28,182 28,74" fill="url(#min1-bg)" stroke="#f59e0b" stroke-width="8" stroke-linejoin="round"/>
  <polygon points="128,34 212,82 212,174 128,222 44,174 44,82" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
  <!-- Star crown -->
  <polygon points="128,50 134,68 152,68 138,80 143,98 128,86 113,98 118,80 104,68 122,68" fill="#f59e0b"/>
  <!-- Modern Geometric 'M' with central '1' pillar -->
  <path d="M76,170 L76,108 L104,142 L128,114 L152,142 L180,108 L180,170 L158,170 L158,136 L138,162 L118,162 L98,136 L98,170 Z" fill="#ffffff"/>
  <rect x="122" y="126" width="12" height="44" rx="3" fill="#f59e0b"/>
</svg>`,

  // 2. SDN Percobaan 1 - Crimson Heraldic Shield with Torch & 'P'
  'team-sdn-percobaan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="sdn-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <path d="M128,20 C190,20 224,40 224,96 C224,172 168,220 128,238 C88,220 32,172 32,96 C32,40 66,20 128,20 Z" fill="url(#sdn-bg)" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
  <path d="M128,34 C178,34 208,50 208,98 C208,160 160,204 128,220 C96,204 48,160 48,98 C48,50 78,34 128,34 Z" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.7"/>
  <!-- Academic Torch flame -->
  <path d="M128,56 C136,70 146,80 138,98 C132,88 124,84 124,76 C120,84 116,92 110,98 C104,80 120,68 128,56 Z" fill="#fef08a"/>
  <!-- Letter P monogram -->
  <path d="M96,182 L96,108 L142,108 C164,108 174,120 174,136 C174,152 164,162 142,162 L120,162 L120,182 Z M120,126 L120,144 L140,144 C148,144 152,140 152,135 C152,130 148,126 140,126 Z" fill="#ffffff"/>
</svg>`,

  // 3. MIS Al-Hidayah - Octagonal Rub el Hizb with Crescent Diamond
  'team-alhidayah': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="hidayah-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>
  <rect x="52" y="52" width="152" height="152" rx="16" fill="url(#hidayah-bg)" stroke="#fbbf24" stroke-width="6"/>
  <rect x="52" y="52" width="152" height="152" rx="16" fill="none" stroke="#fbbf24" stroke-width="6" transform="rotate(45, 128, 128)"/>
  <circle cx="128" cy="128" r="64" fill="#064e3b" stroke="#ffffff" stroke-width="3"/>
  <!-- Radiant crescent and ray -->
  <path d="M142,90 C122,90 106,106 106,128 C106,150 122,166 142,166 C130,160 122,146 122,128 C122,110 130,96 142,90 Z" fill="#fbbf24"/>
  <polygon points="144,116 148,126 158,128 150,134 152,144 144,138 136,144 138,134 130,128 140,126" fill="#ffffff"/>
</svg>`,

  // 4. SDIT Bina Insani - Modern Hexagonal Pillars 'B'
  'team-bina-insani': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="bi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="106" fill="url(#bi-bg)" stroke="#facc15" stroke-width="8"/>
  <circle cx="128" cy="128" r="92" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4"/>
  <!-- Intertwined Geometric B -->
  <path d="M88,72 L136,72 C158,72 172,84 172,100 C172,112 164,122 152,126 C168,130 178,142 178,158 C178,176 160,188 136,188 L88,188 Z M116,94 L116,116 L134,116 C144,116 148,110 148,105 C148,100 144,94 134,94 Z M116,138 L116,166 L136,166 C146,166 152,160 152,152 C152,144 146,138 136,138 Z" fill="#ffffff"/>
  <circle cx="136" cy="105" r="4" fill="#facc15"/>
  <circle cx="136" cy="152" r="4" fill="#facc15"/>
</svg>`,

  // 5. MI Ma'arif Nurul Ulum - Emerald Globe & Stars
  'team-maarif': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="maarif-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect x="28" y="28" width="200" height="200" rx="48" fill="url(#maarif-bg)" stroke="#d97706" stroke-width="8"/>
  <!-- Globe grid -->
  <circle cx="128" cy="132" r="54" fill="none" stroke="#ffffff" stroke-width="4"/>
  <ellipse cx="128" cy="132" rx="26" ry="54" fill="none" stroke="#ffffff" stroke-width="3"/>
  <line x1="74" y1="132" x2="182" y2="132" stroke="#ffffff" stroke-width="3"/>
  <!-- Center Main Star -->
  <polygon points="128,62 134,74 148,74 136,82 140,94 128,86 116,94 120,82 108,74 122,74" fill="#fbbf24"/>
  <!-- Surrounding Stars -->
  <circle cx="94" cy="78" r="4" fill="#fbbf24"/>
  <circle cx="162" cy="78" r="4" fill="#fbbf24"/>
  <circle cx="76" cy="104" r="3.5" fill="#fbbf24"/>
  <circle cx="180" cy="104" r="3.5" fill="#fbbf24"/>
</svg>`,

  // 6. MIN 2 Unggulan - Royal Navy Laurel & Number 2
  'team-min2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="min2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="106" fill="url(#min2-bg)" stroke="#eab308" stroke-width="8"/>
  <!-- Laurel Wreath ring -->
  <path d="M68,140 C66,100 86,66 128,52 C170,66 190,100 188,140 C186,176 160,202 128,212 C96,202 70,176 68,140 Z" fill="none" stroke="#eab308" stroke-width="4" stroke-dasharray="10,6"/>
  <!-- Dynamic numeral 2 -->
  <path d="M102,106 C102,86 116,74 132,74 C148,74 158,86 158,100 C158,118 136,134 118,152 L162,152 L162,174 L98,174 L98,154 L128,122 C136,114 140,108 140,100 C140,94 136,90 130,90 C124,90 120,94 120,100 Z" fill="#ffffff"/>
  <!-- Small Star at bottom -->
  <polygon points="128,186 131,192 138,192 133,196 135,202 128,198 121,202 123,196 118,192 125,192" fill="#eab308"/>
</svg>`,

  // 7. SDN 2 Harapan - Sunrise Chevron Shield 'H'
  'team-sdn-harapan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="harapan-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </linearGradient>
  </defs>
  <polygon points="128,22 226,62 198,206 128,238 58,206 30,62" fill="url(#harapan-bg)" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
  <!-- Sunrise arcs -->
  <path d="M80,110 A48,48 0 0,1 176,110" fill="none" stroke="#fef08a" stroke-width="6"/>
  <!-- Monogram H -->
  <path d="M86,96 L108,96 L108,130 L148,130 L148,96 L170,96 L170,186 L148,186 L148,148 L108,148 L108,186 L86,186 Z" fill="#ffffff"/>
</svg>`,

  // 8. MIS Darussalam - Gateway of Peace & Star
  'team-darussalam': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="darus-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#115e59"/>
    </linearGradient>
  </defs>
  <rect x="36" y="36" width="184" height="184" rx="36" fill="url(#darus-bg)" stroke="#2dd4bf" stroke-width="8"/>
  <!-- Dome arch gate -->
  <path d="M84,188 L84,124 C84,92 104,74 128,60 C152,74 172,92 172,124 L172,188 Z" fill="none" stroke="#ffffff" stroke-width="6"/>
  <!-- Geometric Peace Diamond -->
  <polygon points="128,94 146,114 128,134 110,114" fill="#facc15"/>
  <rect x="110" y="146" width="36" height="42" rx="4" fill="#ffffff"/>
</svg>`,

  // 9. SDIT Harapan Umat (HARUM) - Unity Fellowship Sprout
  'team-harum': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="harum-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="106" fill="url(#harum-bg)" stroke="#fde047" stroke-width="8"/>
  <!-- Fellowship ring -->
  <circle cx="128" cy="128" r="68" fill="none" stroke="#ffffff" stroke-width="5" stroke-dasharray="14,8"/>
  <!-- Leaf of youth and hope -->
  <path d="M128,68 C148,88 162,118 152,148 C142,176 116,182 104,182 C98,154 104,124 128,68 Z" fill="#fde047"/>
  <path d="M128,106 C114,120 106,140 114,162" fill="none" stroke="#1e3a8a" stroke-width="3"/>
</svg>`,

  // 10. MI Tarbiyatul Islam - Collegiate Shield with Quill
  'team-tarbiyah': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="tarbiyah-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
  </defs>
  <path d="M128,26 L220,58 L196,176 C184,208 148,228 128,236 C108,228 72,208 60,176 L36,58 Z" fill="url(#tarbiyah-bg)" stroke="#ca8a04" stroke-width="8" stroke-linejoin="round"/>
  <!-- Open Book of Knowledge -->
  <path d="M84,136 C104,126 120,132 128,140 C136,132 152,126 172,136 L172,172 C152,162 136,168 128,176 C120,168 104,162 84,172 Z" fill="#ffffff"/>
  <!-- Quill pen -->
  <polygon points="128,70 134,106 128,124 122,106" fill="#facc15"/>
</svg>`,
};

// Tournament Team Mappings
TEAM_SVGS['team-sdi-kardina'] = TEAM_SVGS['team-min1'];
TEAM_SVGS['team-min7-blitar'] = TEAM_SVGS['team-sdn-percobaan'];
TEAM_SVGS['team-min8-blitar'] = TEAM_SVGS['team-alhidayah'];
TEAM_SVGS['team-sdn1-srengat'] = TEAM_SVGS['team-bina-insani'];
TEAM_SVGS['team-min14-blitar'] = TEAM_SVGS['team-maarif'];
TEAM_SVGS['team-mi-mambaululum'] = TEAM_SVGS['team-tarbiyah'];
TEAM_SVGS['team-min13-b'] = TEAM_SVGS['team-min2'];
TEAM_SVGS['team-min2-blitar'] = TEAM_SVGS['team-min2'];
TEAM_SVGS['team-mi-wahidhasyim'] = TEAM_SVGS['team-alhidayah'];
TEAM_SVGS['team-min13-c'] = TEAM_SVGS['team-sdn-harapan'];
TEAM_SVGS['team-mi-ploso'] = TEAM_SVGS['team-bina-insani'];
TEAM_SVGS['team-mi-darussalam'] = TEAM_SVGS['team-darussalam'];
TEAM_SVGS['team-mi-yabunaya'] = TEAM_SVGS['team-harum'];
TEAM_SVGS['team-min5-tulungagung'] = TEAM_SVGS['team-sdn-percobaan'];


// Real Team Logo Assets (from src/Logo) - Transparent Background PNGs
export const REAL_TEAM_LOGOS: Record<string, { name: string; url: string }> = {
  'team-sdi-kardina': { name: 'SDI Kardina Massa Blitar', url: '/logos/sdi-kardina-massa.png' },
  'team-min7-blitar': { name: 'MIN 7 Blitar', url: '/logos/min-7-blitar.png' },
  'team-min8-blitar': { name: 'MIN 8 Blitar', url: '/logos/min-8-blitar.png' },
  'team-sdn1-srengat': { name: 'UPT SDN 1 Srengat Blitar', url: '/logos/sdn-srengat-1.png' },
  'team-min14-blitar': { name: 'MIN 14 Blitar', url: '/logos/min-14-blitar.png' },
  'team-mi-mambaululum': { name: 'MI Mambaul Ulum Buntaran', url: '/logos/manbaul-ulum.png' },
  'team-min13-b': { name: 'MIN 13 Blitar', url: '/logos/min-13-blitar.png' },
  'team-min2-blitar': { name: 'MIN 2 Blitar', url: '/logos/min-2-blitar.png' },
  'team-mi-wahidhasyim': { name: 'MI Wahid Hasyim Bakung', url: '/logos/mi-wahid-hasyim.png' },
  'team-min13-c': { name: 'MIN 13 Blitar', url: '/logos/min-13-blitar.png' },
  'team-mi-ploso': { name: 'MIN Ploso Mojo Kediri', url: '/logos/min-ploso-kediri.png' },
  'team-mi-darussalam': { name: 'MI Unggulan Darussalam', url: '/logos/mi-darussalam.png' },
  'team-mi-yabunaya': { name: 'MI Ya Bunayya Srengat', url: '/logos/mi-yaa-bunayya.png' },
  'team-min5-tulungagung': { name: 'MIN 5 Tulungagung', url: '/logos/min-5-tulungagung.png' },
};

export const OFFICIAL_PRESET_LOGOS = [
  { label: 'SDI Kardina Massa Blitar', url: '/logos/sdi-kardina-massa.png' },
  { label: 'MIN 7 Blitar', url: '/logos/min-7-blitar.png' },
  { label: 'MIN 8 Blitar', url: '/logos/min-8-blitar.png' },
  { label: 'UPT SDN 1 Srengat Blitar', url: '/logos/sdn-srengat-1.png' },
  { label: 'MIN 14 Blitar', url: '/logos/min-14-blitar.png' },
  { label: 'MI Mambaul Ulum Buntaran', url: '/logos/manbaul-ulum.png' },
  { label: 'MIN 13 Blitar', url: '/logos/min-13-blitar.png' },
  { label: 'MIN 2 Blitar', url: '/logos/min-2-blitar.png' },
  { label: 'MI Wahid Hasyim Bakung', url: '/logos/mi-wahid-hasyim.png' },
  { label: 'MIN Ploso Mojo Kediri', url: '/logos/min-ploso-kediri.png' },
  { label: 'MI Unggulan Darussalam', url: '/logos/mi-darussalam.png' },
  { label: 'MI Ya Bunayya Srengat', url: '/logos/mi-yaa-bunayya.png' },
  { label: 'MIN 5 Tulungagung', url: '/logos/min-5-tulungagung.png' },
];

/**
 * Returns the official photo logo URL for the given team ID.
 * Falls back to SVG data URI if real logo is not mapped.
 */
export const getTeamLogoUrl = (teamId: string): string => {
  if (REAL_TEAM_LOGOS[teamId]?.url) {
    return REAL_TEAM_LOGOS[teamId].url;
  }
  const svg = TEAM_SVGS[teamId] || TEAM_SVGS['team-min1'];
  return encodeSvg(svg);
};
