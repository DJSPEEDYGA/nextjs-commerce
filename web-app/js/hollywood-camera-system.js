/**
 * GOAT Royalty — Hollywood Camera System
 * Cinema-grade camera profiles for movie-quality renders.
 * Used across Movie Studio, Production Studio, and Agent-007.
 */

const HOLLYWOOD_CAMERAS = {
  arri_alexa35: {
    id: 'arri_alexa35',
    name: 'ARRI Alexa 35',
    manufacturer: 'ARRI',
    tier: 'flagship',
    icon: '🎬',
    sensor: {
      type: 'Super 35 ALEV 4 CMOS',
      size: '27.99 × 19.22 mm',
      resolution: { width: 4608, height: 3164 },
      label: '4.6K Super 35'
    },
    dynamicRange: 17,
    frameRates: { min: 0.75, max: 120, common: [23.976, 24, 25, 29.97, 30, 48, 60, 120] },
    colorScience: 'ARRI LogC4 / ARRI Wide Gamut 4',
    recording: ['ARRIRAW', 'Apple ProRes 4444 XQ', 'Apple ProRes 4444', 'Apple ProRes 422 HQ'],
    aspectRatios: ['1.78:1 (16:9)', '2.39:1 (Anamorphic)', '1.85:1', '2.00:1', '4:3 Open Gate'],
    isoRange: { native: 800, min: 160, max: 6400 },
    lensMount: 'LPL (ARRI)',
    bodyPrice: '$65,000',
    usedIn: ['Oppenheimer', 'Barbie', 'The Batman', 'Dune Part Two'],
    strengths: ['Best color science in the industry', '17 stops dynamic range', 'Texture modes for grain/film look']
  },

  red_v_raptor_xl: {
    id: 'red_v_raptor_xl',
    name: 'RED V-Raptor XL',
    manufacturer: 'RED',
    tier: 'flagship',
    icon: '🔴',
    sensor: {
      type: 'Vista Vision CMOS (VV)',
      size: '40.96 × 21.60 mm',
      resolution: { width: 8192, height: 4320 },
      label: '8K Full Frame'
    },
    dynamicRange: 16.5,
    frameRates: { min: 1, max: 600, common: [23.976, 24, 25, 29.97, 30, 48, 60, 120, 240] },
    colorScience: 'REDWideGamutRGB / Log3G10 (IPP2)',
    recording: ['REDCODE RAW', 'Apple ProRes'],
    aspectRatios: ['16:9', '2.39:1', '2.4:1', '17:9', '6:5 Anamorphic'],
    isoRange: { native: 800, min: 250, max: 12800 },
    lensMount: 'Canon RF / PL',
    bodyPrice: '$45,000',
    usedIn: ['Aquaman', 'The Flash', 'Guardians of the Galaxy Vol. 3', 'Avatar: The Way of Water'],
    strengths: ['8K resolution for extreme cropping', 'Up to 600fps in lower res', 'Electronic ND']
  },

  red_epic: {
    id: 'red_epic',
    name: 'RED EPIC Dragon',
    manufacturer: 'RED',
    tier: 'professional',
    icon: '🐉',
    sensor: {
      type: 'Dragon CMOS',
      size: '30.7 × 15.8 mm',
      resolution: { width: 6144, height: 3160 },
      label: '6K Super 35'
    },
    dynamicRange: 16.5,
    frameRates: { min: 1, max: 300, common: [23.976, 24, 25, 30, 48, 60, 96, 120] },
    colorScience: 'REDcolor / Dragon Color Science',
    recording: ['REDCODE RAW'],
    aspectRatios: ['16:9', '2.39:1', '2:1'],
    isoRange: { native: 800, min: 250, max: 12800 },
    lensMount: 'PL / Canon EF',
    bodyPrice: '$25,000',
    usedIn: ['The Dark Knight Rises', 'The Hobbit', 'Gone Girl', 'Jurassic World'],
    strengths: ['3D capability', 'Battle-tested Hollywood workhorse', 'High frame rates']
  },

  sony_venice2: {
    id: 'sony_venice2',
    name: 'Sony VENICE 2',
    manufacturer: 'Sony',
    tier: 'flagship',
    icon: '🎥',
    sensor: {
      type: 'Full-Frame 8.6K CMOS',
      size: '36 × 24 mm',
      resolution: { width: 8640, height: 5760 },
      label: '8.6K Full Frame'
    },
    dynamicRange: 16,
    frameRates: { min: 1, max: 120, common: [23.976, 24, 25, 29.97, 30, 48, 60, 90, 120] },
    colorScience: 'S-Gamut3.Cine / S-Log3',
    recording: ['X-OCN (16-bit RAW)', 'Apple ProRes 4444', 'Apple ProRes 422 HQ', 'XAVC'],
    aspectRatios: ['16:9', '2.39:1', '1.85:1', '17:9', '4:3', '6:5'],
    isoRange: { native: [500, 2500], min: 100, max: 16000 },
    lensMount: 'PL / E-mount (interchangeable)',
    bodyPrice: '$38,000',
    usedIn: ['Top Gun: Maverick', 'Elvis', 'Bullet Train', 'The Color Purple'],
    strengths: ['Dual native ISO', '8.6K for max flexibility', 'Interchangeable lens mounts']
  },

  sony_f65: {
    id: 'sony_f65',
    name: 'Sony F65',
    manufacturer: 'Sony',
    tier: 'professional',
    icon: '📹',
    sensor: {
      type: '8K Single-chip CMOS',
      size: '24.7 × 13.1 mm',
      resolution: { width: 8192, height: 4320 },
      label: '8K Super 35'
    },
    dynamicRange: 14,
    frameRates: { min: 1, max: 120, common: [23.976, 24, 25, 29.97, 30, 60, 120] },
    colorScience: 'S-Gamut / S-Log2',
    recording: ['F65RAW (16-bit)', 'SStP'],
    aspectRatios: ['16:9', '2.39:1'],
    isoRange: { native: 800, min: 320, max: 12800 },
    lensMount: 'PL',
    bodyPrice: '$35,000',
    usedIn: ['The Hunger Games', 'Spotlight', 'Oblivion', 'After Earth'],
    strengths: ['True 8K sensor', 'Rotary shutter for film-like motion', 'Excellent color reproduction']
  },

  panavision_dxl2: {
    id: 'panavision_dxl2',
    name: 'Panavision Millennium DXL2',
    manufacturer: 'Panavision',
    tier: 'flagship',
    icon: '🌟',
    sensor: {
      type: 'RED Monstro 8K VV CMOS',
      size: '40.96 × 21.60 mm',
      resolution: { width: 8192, height: 4320 },
      label: '8K Vista Vision'
    },
    dynamicRange: 16.5,
    frameRates: { min: 1, max: 120, common: [23.976, 24, 25, 30, 48, 60, 120] },
    colorScience: 'Light Iron Color2 / REDWideGamutRGB',
    recording: ['REDCODE RAW'],
    aspectRatios: ['2.39:1', '1.85:1', '16:9', '2:1', 'Full Open Gate'],
    isoRange: { native: 1600, min: 250, max: 12800 },
    lensMount: 'Panavision PV (exclusive)',
    bodyPrice: 'Rental only (~$5,000/week)',
    usedIn: ['Venom', 'A Quiet Place', 'Rocketman', 'Hustlers'],
    strengths: ['Legendary Panavision glass', 'Light Iron color pipeline', 'Film-like rendering']
  },

  imax_msm9802: {
    id: 'imax_msm9802',
    name: 'IMAX MSM 9802',
    manufacturer: 'IMAX / Panavision',
    tier: 'ultra',
    icon: '🏔️',
    sensor: {
      type: '65mm / 70mm Film',
      size: '69.6 × 48.5 mm',
      resolution: { width: 18000, height: 12500 },
      label: '18K equivalent (65mm film)'
    },
    dynamicRange: 20,
    frameRates: { min: 24, max: 48, common: [24, 48] },
    colorScience: 'Photochemical (film stock dependent)',
    recording: ['65mm Film Negative (Kodak Vision3 500T / 250D)'],
    aspectRatios: ['1.43:1 (IMAX)', '1.90:1 (IMAX Digital)'],
    isoRange: { native: 500, min: 50, max: 500 },
    lensMount: 'IMAX (custom Hasselblad / Panavision)',
    bodyPrice: 'Rental only (~$16,000/week)',
    usedIn: ['Oppenheimer', 'Interstellar', 'Dunkirk', 'Tenet', 'The Dark Knight'],
    strengths: ['Unmatched resolution (65mm film)', '20+ stops DR on film', 'Immersive IMAX format']
  }
};

// Render presets matching Hollywood standards
const CINEMA_RENDER_PRESETS = {
  theatrical_4k_dci: {
    name: 'DCI 4K Theatrical',
    width: 4096, height: 2160,
    fps: 24, codec: 'ProRes 4444 XQ',
    bitDepth: 12, colorSpace: 'DCI-P3',
    bitrate: '500 Mbps',
    icon: '🎬',
    use: 'Theater projection / final master'
  },
  theatrical_2k_dci: {
    name: 'DCI 2K Theatrical',
    width: 2048, height: 1080,
    fps: 24, codec: 'JPEG 2000',
    bitDepth: 12, colorSpace: 'DCI-P3',
    bitrate: '250 Mbps',
    icon: '🎞️',
    use: 'Standard theatrical release'
  },
  imax_laser: {
    name: 'IMAX Laser',
    width: 5120, height: 3620,
    fps: 48, codec: 'JPEG 2000',
    bitDepth: 16, colorSpace: 'Rec.2020',
    bitrate: '1.2 Gbps',
    icon: '🏔️',
    use: 'IMAX Laser projection (1.43:1)'
  },
  hdr_dolby_vision: {
    name: 'Dolby Vision HDR',
    width: 3840, height: 2160,
    fps: 24, codec: 'H.265 (HEVC)',
    bitDepth: 12, colorSpace: 'Rec.2020 / Dolby Vision',
    bitrate: '80 Mbps',
    icon: '🌈',
    use: 'Streaming / Dolby Cinema'
  },
  uhd_hdr10: {
    name: 'UHD HDR10+',
    width: 3840, height: 2160,
    fps: 24, codec: 'H.265 (HEVC)',
    bitDepth: 10, colorSpace: 'Rec.2020 / HDR10+',
    bitrate: '60 Mbps',
    icon: '📺',
    use: 'UHD Blu-ray / Samsung TVs'
  },
  streaming_4k: {
    name: '4K Streaming (Netflix Approved)',
    width: 3840, height: 2160,
    fps: 23.976, codec: 'H.265 (HEVC)',
    bitDepth: 10, colorSpace: 'Rec.709',
    bitrate: '16 Mbps',
    icon: '📡',
    use: 'Netflix / Apple TV+ / Disney+'
  },
  music_video_4k: {
    name: 'Music Video 4K',
    width: 3840, height: 2160,
    fps: 29.97, codec: 'Apple ProRes 422 HQ',
    bitDepth: 10, colorSpace: 'Rec.709',
    bitrate: '220 Mbps',
    icon: '🎵',
    use: 'Music video master / color grade source'
  },
  social_vertical: {
    name: 'Social Vertical (TikTok/Reels/Shorts)',
    width: 1080, height: 1920,
    fps: 30, codec: 'H.264',
    bitDepth: 8, colorSpace: 'sRGB',
    bitrate: '12 Mbps',
    icon: '📱',
    use: 'TikTok, Instagram Reels, YouTube Shorts'
  },
  vfx_exr_plates: {
    name: 'VFX Plates (OpenEXR)',
    width: 4608, height: 3164,
    fps: 24, codec: 'OpenEXR (PIZ)',
    bitDepth: 16, colorSpace: 'ACES AP0 (Linear)',
    bitrate: 'Uncompressed (~50 MB/frame)',
    icon: '🧪',
    use: 'VFX compositing / Nuke / Unreal Engine'
  },
  previz_realtime: {
    name: 'Previz / Real-Time (Unreal Engine)',
    width: 3840, height: 2160,
    fps: 60, codec: 'H.264 (CQP 18)',
    bitDepth: 8, colorSpace: 'sRGB',
    bitrate: '40 Mbps',
    icon: '🎮',
    use: 'Virtual production previz / game engine output'
  }
};

// Hollywood color grading LUTs
const CINEMA_LUTS = [
  { id: 'arri_logc4_to_709', name: 'ARRI LogC4 → Rec.709', camera: 'arri_alexa35', type: 'technical' },
  { id: 'arri_logc4_to_p3', name: 'ARRI LogC4 → DCI-P3', camera: 'arri_alexa35', type: 'technical' },
  { id: 'red_ipp2_to_709', name: 'RED IPP2 → Rec.709', camera: 'red_v_raptor_xl', type: 'technical' },
  { id: 'sony_slog3_to_709', name: 'Sony S-Log3 → Rec.709', camera: 'sony_venice2', type: 'technical' },
  { id: 'aces_to_709', name: 'ACES → Rec.709 (sRGB)', camera: 'all', type: 'technical' },
  { id: 'aces_to_p3', name: 'ACES → DCI-P3', camera: 'all', type: 'technical' },
  { id: 'teal_orange', name: 'Teal & Orange (Blockbuster)', camera: 'all', type: 'creative' },
  { id: 'bleach_bypass', name: 'Bleach Bypass (Desaturated)', camera: 'all', type: 'creative' },
  { id: 'film_noir', name: 'Film Noir (High Contrast B&W)', camera: 'all', type: 'creative' },
  { id: 'kodak_2383', name: 'Kodak 2383 Print Film', camera: 'all', type: 'film_emulation' },
  { id: 'kodak_vision3_500t', name: 'Kodak Vision3 500T (Tungsten)', camera: 'all', type: 'film_emulation' },
  { id: 'kodak_vision3_250d', name: 'Kodak Vision3 250D (Daylight)', camera: 'all', type: 'film_emulation' },
  { id: 'fuji_eterna', name: 'Fuji ETERNA (Cinema)', camera: 'all', type: 'film_emulation' }
];

// Aspect ratio presets used in Hollywood
const CINEMA_ASPECT_RATIOS = [
  { ratio: '2.39:1', name: 'Anamorphic Scope', use: 'Most blockbusters, sci-fi, epics', width: 2.39, height: 1 },
  { ratio: '1.85:1', name: 'Flat Widescreen', use: 'Standard theatrical (comedies, dramas)', width: 1.85, height: 1 },
  { ratio: '1.43:1', name: 'IMAX', use: 'Full IMAX frame (Nolan films)', width: 1.43, height: 1 },
  { ratio: '1.90:1', name: 'IMAX Digital', use: 'IMAX digital projection', width: 1.90, height: 1 },
  { ratio: '16:9', name: 'HD Widescreen', use: 'Television, streaming, YouTube', width: 16, height: 9 },
  { ratio: '4:3', name: 'Academy', use: 'Classic film, artistic choice', width: 4, height: 3 },
  { ratio: '2.76:1', name: 'Ultra Panavision 70', use: 'The Hateful Eight, Ben-Hur', width: 2.76, height: 1 },
  { ratio: '9:16', name: 'Vertical', use: 'TikTok, Reels, Shorts', width: 9, height: 16 },
  { ratio: '1:1', name: 'Square', use: 'Instagram feed', width: 1, height: 1 }
];

/**
 * Render the Hollywood Camera Selector UI component.
 * @param {string} containerId - DOM element ID to render into
 * @param {object} options - { showPresets: true, showLUTs: true, onSelect: fn }
 */
function renderHollywoodCameraSystem(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { showPresets = true, showLUTs = true, onSelect } = options;

  let html = `
    <div class="hollywood-camera-system">
      <div class="hcs-header">
        <h2>🎬 Hollywood Camera System</h2>
        <p class="hcs-subtitle">Cinema-grade camera profiles used in major productions</p>
      </div>

      <div class="hcs-cameras">
        ${Object.values(HOLLYWOOD_CAMERAS).map(cam => `
          <div class="hcs-camera-card" data-camera="${cam.id}" onclick="selectHollywoodCamera('${cam.id}', '${containerId}')">
            <div class="hcs-camera-icon">${cam.icon}</div>
            <div class="hcs-camera-info">
              <h4>${cam.name}</h4>
              <span class="hcs-sensor">${cam.sensor.label}</span>
              <span class="hcs-dr">${cam.dynamicRange} stops DR</span>
            </div>
            <div class="hcs-camera-tier hcs-tier-${cam.tier}">${cam.tier.toUpperCase()}</div>
          </div>
        `).join('')}
      </div>

      <div class="hcs-details" id="${containerId}-details" style="display:none;">
        <div class="hcs-details-inner" id="${containerId}-details-inner"></div>
      </div>`;

  if (showPresets) {
    html += `
      <div class="hcs-presets">
        <h3>📤 Render Presets</h3>
        <div class="hcs-presets-grid">
          ${Object.entries(CINEMA_RENDER_PRESETS).map(([key, p]) => `
            <div class="hcs-preset-card" data-preset="${key}" onclick="selectRenderPreset('${key}', '${containerId}')">
              <span class="hcs-preset-icon">${p.icon}</span>
              <strong>${p.name}</strong>
              <small>${p.width}×${p.height} @ ${p.fps}fps</small>
              <small class="hcs-preset-use">${p.use}</small>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  if (showLUTs) {
    html += `
      <div class="hcs-luts">
        <h3>🎨 Color Science / LUTs</h3>
        <div class="hcs-luts-grid">
          ${CINEMA_LUTS.map(lut => `
            <div class="hcs-lut-pill hcs-lut-${lut.type}">${lut.name}</div>
          `).join('')}
        </div>
      </div>`;
  }

  html += `
      <div class="hcs-aspect-ratios">
        <h3>📐 Aspect Ratios</h3>
        <div class="hcs-ar-grid">
          ${CINEMA_ASPECT_RATIOS.map(ar => `
            <div class="hcs-ar-card">
              <div class="hcs-ar-preview" style="aspect-ratio: ${ar.width}/${ar.height};"></div>
              <strong>${ar.ratio}</strong>
              <small>${ar.name}</small>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;

  container.innerHTML = html;
}

function selectHollywoodCamera(cameraId, containerId) {
  const cam = HOLLYWOOD_CAMERAS[cameraId];
  if (!cam) return;

  document.querySelectorAll(`#${containerId} .hcs-camera-card`).forEach(c => c.classList.remove('active'));
  document.querySelector(`#${containerId} [data-camera="${cameraId}"]`).classList.add('active');

  const detailsDiv = document.getElementById(`${containerId}-details`);
  const inner = document.getElementById(`${containerId}-details-inner`);
  detailsDiv.style.display = 'block';

  inner.innerHTML = `
    <div class="hcs-detail-header">
      <span class="hcs-detail-icon">${cam.icon}</span>
      <div>
        <h3>${cam.name}</h3>
        <span class="hcs-manufacturer">${cam.manufacturer} • ${cam.bodyPrice}</span>
      </div>
    </div>
    <div class="hcs-detail-grid">
      <div class="hcs-spec"><label>Sensor</label><span>${cam.sensor.type}</span></div>
      <div class="hcs-spec"><label>Resolution</label><span>${cam.sensor.resolution.width} × ${cam.sensor.resolution.height}</span></div>
      <div class="hcs-spec"><label>Dynamic Range</label><span>${cam.dynamicRange} stops</span></div>
      <div class="hcs-spec"><label>Frame Rates</label><span>${cam.frameRates.min}–${cam.frameRates.max} fps</span></div>
      <div class="hcs-spec"><label>Color Science</label><span>${cam.colorScience}</span></div>
      <div class="hcs-spec"><label>Recording</label><span>${cam.recording.join(', ')}</span></div>
      <div class="hcs-spec"><label>ISO Range</label><span>${Array.isArray(cam.isoRange.native) ? 'Dual ISO ' + cam.isoRange.native.join('/') : 'Native ' + cam.isoRange.native} (${cam.isoRange.min}–${cam.isoRange.max})</span></div>
      <div class="hcs-spec"><label>Lens Mount</label><span>${cam.lensMount}</span></div>
      <div class="hcs-spec"><label>Aspect Ratios</label><span>${cam.aspectRatios.join(', ')}</span></div>
    </div>
    <div class="hcs-detail-films">
      <label>Used in:</label>
      <div class="hcs-film-tags">${cam.usedIn.map(f => `<span class="hcs-film-tag">${f}</span>`).join('')}</div>
    </div>
    <div class="hcs-detail-strengths">
      <label>Key Strengths:</label>
      <ul>${cam.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  `;
}

function selectRenderPreset(presetId, containerId) {
  const preset = CINEMA_RENDER_PRESETS[presetId];
  if (!preset) return;
  document.querySelectorAll(`#${containerId} .hcs-preset-card`).forEach(c => c.classList.remove('active'));
  document.querySelector(`#${containerId} [data-preset="${presetId}"]`).classList.add('active');
}

// Export for Agent-007 integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOLLYWOOD_CAMERAS, CINEMA_RENDER_PRESETS, CINEMA_LUTS, CINEMA_ASPECT_RATIOS };
}
