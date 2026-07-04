import { SUPABASE_CONFIG } from './supabase_config.js';

// Global state variables
let supabaseClient = null;
let isAdminMode = false;
let projectsData = [];
let capabilitiesData = [];

// Fallback values if Supabase is not connected
const fallbackProjects = [
  {
    id: "p1",
    title: "Jasmin: The Intelligent Assistant Framework",
    category: "Featured System",
    description: "A custom, long-term AI assistant project featuring a dedicated React user interface, local offline wake-word recognition engines, and asynchronous Telegram bot integration operating on a secure local/cloud hybrid strategy.",
    tags: "React, AI/Voice, Hybrid Architecture, Node.js",
    link: "https://github.com/Vibhathcross"
  },
  {
    id: "p2",
    title: "Secure Access Gateway",
    category: "Security Simulation",
    description: "An interactive, browser-based web application utilizing the Web Audio API and hardware-accelerated CSS keyframe animations to create a highly responsive, engineered security simulation interface.",
    tags: "Web Audio API, CSS3 Matrix, Interactive UI",
    link: "https://github.com/Vibhathcross"
  }
];

const fallbackCapabilities = [
  {
    id: "c1",
    title: "Systems Programming",
    label: "SYS",
    percentage: 85,
    description: "Proficient in C and Linux system calls. Focused on low-level OS architecture, process control (fork/exec), and deterministic memory management algorithms."
  },
  {
    id: "c2",
    title: "Data Science & ML",
    label: "DS",
    percentage: 75,
    description: "Mathematical modeling and implementation of rule-based classification, clustering methodologies (KNN, Ward's Linkage), and dimensionality reduction via Principal Component Analysis (PCA)."
  },
  {
    id: "c3",
    title: "UI & Architecture",
    label: "ARC",
    percentage: 80,
    description: "Designing high-performance user interfaces in React, coupled with robust application layer engineering, network socket optimization, and hybrid cloud integration."
  }
];

// Wait for DOM and Third-party libraries to load
document.addEventListener('DOMContentLoaded', async () => {
  initThreeBG();
  initPreloader();
  initFullscreen();
  initCustomScrollNav();
  
  // Load content dynamically, then bind UI events and animations
  await loadAndRenderContent();
  
  initAnimations();
  initCapabilities();
  initCMS();
});

/**
 * Preloader Fade-out Controller
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const enterBtn = document.getElementById('enter-btn');
  if (!preloader) return;

  // Reveal the Enter button after text animation completes (2.2s)
  if (enterBtn) {
    setTimeout(() => {
      enterBtn.classList.add('show');
    }, 2200);

    enterBtn.addEventListener('click', () => {
      // Enter Fullscreen on user interaction
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log('Fullscreen rejected:', err));
      } else if (docEl.webkitRequestFullscreen) { /* Safari */
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) { /* IE11 */
        docEl.msRequestFullscreen();
      }

      // Smooth preloader exit transition
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      
      // Enable body scroll
      document.body.style.overflow = '';

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    });
  }
}

/**
 * 3D WebGL Background Engine (Three.js)
 * — Passive icosahedron with scroll rotation
 * — Explodes into triangle grid when Connect section is reached
 */
function initThreeBG() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4.5;

  // Renderer setup with alpha transparency and antialiasing
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Icosahedron (main mesh) ──────────────────────────────────────────
  const radius = window.innerWidth < 768 ? 1.6 : 2.5;
  const icoGeo = new THREE.IcosahedronGeometry(radius, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xD32F2F,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icosahedron);

  // ── Build individual triangle fragments from icosahedron faces ───────
  // We use a non-indexed copy so every 3 vertices = 1 triangle face
  const indexedGeo = new THREE.IcosahedronGeometry(radius, 1);
  const nonIndexed = indexedGeo.toNonIndexed();
  const posAttr = nonIndexed.attributes.position;
  const faceCount = posAttr.count / 3;           // 80 triangles for detail=1

  const triMat = new THREE.MeshBasicMaterial({
    color: 0xD32F2F,
    wireframe: true,
    transparent: true,
    opacity: 0
  });

  // Store each triangle as a separate Mesh with its own geometry
  const triMeshes = [];
  const triOrigins = [];    // centroid in icosahedron space
  const triTargets = [];    // flat grid target positions

  // Compute grid layout — roughly square arrangement
  const cols = Math.ceil(Math.sqrt(faceCount));
  const spacing = radius * 0.55;
  const gridW = (cols - 1) * spacing;

  for (let f = 0; f < faceCount; f++) {
    const i = f * 3;

    // Extract the 3 vertices of this face
    const ax = posAttr.getX(i),   ay = posAttr.getY(i),   az = posAttr.getZ(i);
    const bx = posAttr.getX(i+1), by = posAttr.getY(i+1), bz = posAttr.getZ(i+1);
    const cx = posAttr.getX(i+2), cy = posAttr.getY(i+2), cz = posAttr.getZ(i+2);

    // Centroid (used for explode direction)
    const centroid = new THREE.Vector3(
      (ax + bx + cx) / 3,
      (ay + by + cy) / 3,
      (az + bz + cz) / 3
    );
    triOrigins.push(centroid.clone());

    // Build a small geometry centred at the centroid
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([
        ax - centroid.x, ay - centroid.y, az - centroid.z,
        bx - centroid.x, by - centroid.y, bz - centroid.z,
        cx - centroid.x, cy - centroid.y, cz - centroid.z,
      ]), 3
    ));

    const tMesh = new THREE.Mesh(tGeo, triMat.clone());
    // Start at centroid position (matches the icosahedron surface)
    tMesh.position.copy(centroid);
    tMesh.visible = false;
    scene.add(tMesh);
    triMeshes.push(tMesh);

    // Flat grid target position
    const col = f % cols;
    const row = Math.floor(f / cols);
    const rows = Math.ceil(faceCount / cols);
    triTargets.push(new THREE.Vector3(
      col * spacing - gridW / 2,
      row * spacing - (rows - 1) * spacing / 2,
      0
    ));
  }
  indexedGeo.dispose();
  nonIndexed.dispose();

  // ── Neon Rain Setup ──────────────────────────────────────────────────
  const rainCount = 120;
  const rainPositions = new Float32Array(rainCount * 3);
  const rainSpeeds = [];
  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3]     = (Math.random() - 0.5) * 15;
    rainPositions[i * 3 + 1] = Math.random() * 20 - 10;
    rainPositions[i * 3 + 2] = Math.random() * 4 - 2;
    rainSpeeds.push(0.02 + Math.random() * 0.04);
  }
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

  const canvasTextureElement = document.createElement('canvas');
  canvasTextureElement.width = 32;
  canvasTextureElement.height = 32;
  const textureCtx = canvasTextureElement.getContext('2d');
  const dropGradient = textureCtx.createRadialGradient(16, 16, 1, 16, 16, 15);
  dropGradient.addColorStop(0,   'rgba(255, 255, 255, 1.0)');
  dropGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  dropGradient.addColorStop(0.4, 'rgba(255, 0, 51, 0.85)');
  dropGradient.addColorStop(1,   'rgba(255, 0, 51, 0)');
  textureCtx.fillStyle = dropGradient;
  textureCtx.beginPath();
  textureCtx.arc(16, 16, 16, 0, Math.PI * 2);
  textureCtx.fill();
  const rainTexture = new THREE.CanvasTexture(canvasTextureElement);
  const rainMaterial = new THREE.PointsMaterial({
    size: 0.22, map: rainTexture,
    transparent: true, opacity: 0.8,
    depthWrite: false, blending: THREE.NormalBlending
  });
  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  scene.add(rain);

  // ── Animation state ───────────────────────────────────────────────────
  const clock = new THREE.Clock();
  let targetScrollY  = 0;
  let currentScrollY = 0;

  // Explode animation state — 0 = icosahedron, 1 = grid
  let explodeProgress  = 0;
  let explodeTarget    = 0;

  window.addEventListener('scroll', () => { targetScrollY = window.scrollY; }, { passive: true });

  // Detect Connect section entry via IntersectionObserver
  const connectSection = document.getElementById('motivation');
  if (connectSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        explodeTarget = entry.isIntersecting ? 1 : 0;
      });
    }, { threshold: 0.25 });
    obs.observe(connectSection);
  }

  // ── Animation loop ────────────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Lerp scroll
    currentScrollY += (targetScrollY - currentScrollY) * 0.06;

    // Lerp explode progress (smooth in/out)
    explodeProgress += (explodeTarget - explodeProgress) * 0.028;
    const t = explodeProgress;            // 0→1 as user enters Connect
    const tEase = t < 0.5               // smooth-step easing
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;

    if (t < 0.02) {
      // ─ Pure icosahedron state ─
      icosahedron.visible = true;
      icosahedron.material.opacity = 0.15;
      icosahedron.rotation.y = elapsedTime * 0.04 + currentScrollY * 0.0028;
      icosahedron.rotation.x = elapsedTime * 0.02 + currentScrollY * 0.0014;
      icosahedron.rotation.z = currentScrollY * 0.0008;

      triMeshes.forEach(m => { m.visible = false; });

    } else {
      // ─ Transition / grid state ─

      // Fade out main icosahedron as fragments take over
      icosahedron.visible = true;
      icosahedron.material.opacity = 0.15 * (1 - Math.min(t * 3, 1));
      icosahedron.rotation.y = elapsedTime * 0.04 + currentScrollY * 0.0028;
      icosahedron.rotation.x = elapsedTime * 0.02 + currentScrollY * 0.0014;
      icosahedron.rotation.z = currentScrollY * 0.0008;

      // For each triangle mesh: lerp from icosahedron surface → explode burst → grid
      triMeshes.forEach((mesh, i) => {
        mesh.visible = true;
        mesh.material.opacity = Math.min(t * 2, 0.55);

        const origin = triOrigins[i];
        const target = triTargets[i];

        // Explode direction = centroid normalised * burst radius
        const burstScale = radius * 2.2;
        const burstX = origin.x / (origin.length() || 1) * burstScale;
        const burstY = origin.y / (origin.length() || 1) * burstScale;
        const burstZ = origin.z / (origin.length() || 1) * burstScale;

        // Two-phase lerp:
        //   t 0→0.5  : icosahedron surface → exploded burst
        //   t 0.5→1  : exploded burst → flat grid
        let px, py, pz;
        if (tEase < 0.5) {
          const s = tEase / 0.5;
          px = origin.x + (burstX - origin.x) * s;
          py = origin.y + (burstY - origin.y) * s;
          pz = origin.z + (burstZ - origin.z) * s;
        } else {
          const s = (tEase - 0.5) / 0.5;
          px = burstX + (target.x - burstX) * s;
          py = burstY + (target.y - burstY) * s;
          pz = burstZ + (target.z - burstZ) * s;
        }

        mesh.position.set(px, py, pz);

        // Spin each fragment during the explode burst, settle at grid
        const spinDecay = Math.max(0, 1 - tEase * 1.6);
        mesh.rotation.x = elapsedTime * (1.2 + i * 0.07) * spinDecay;
        mesh.rotation.y = elapsedTime * (0.9 + i * 0.05) * spinDecay;
        mesh.rotation.z = elapsedTime * (0.6 + i * 0.03) * spinDecay;
      });

      if (t > 0.98) {
        icosahedron.visible = false;
      }
    }

    // ─ Neon Rain ─
    const positions = rainGeometry.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      let y = positions[i * 3 + 1];
      y -= rainSpeeds[i];
      if (y < -10) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        y = 10;
        positions[i * 3 + 2] = Math.random() * 4 - 2;
      }
      positions[i * 3 + 1] = y;
    }
    rainGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize ────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const newRadius = window.innerWidth < 768 ? 1.6 : 2.5;
    icosahedron.geometry.dispose();
    icosahedron.geometry = new THREE.IcosahedronGeometry(newRadius, 1);
  });

  // ── GSAP Scroll-scrub rotation ────────────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(icosahedron.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 3,
      z: Math.PI,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8
      }
    });
  }
}

/**
 * GSAP Scroll-Triggered Layout Animations
 */
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Intersection Fading & Slide-up (GPU Accelerated - strictly transform/opacity)
  gsap.utils.toArray('.animate-on-scroll').forEach(element => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power3.out",
        force3D: true, // Forces execution on GPU composite layer
        scrollTrigger: {
          trigger: element,
          start: "top 85%", // Starts animation when element top is 85% down the viewport
          toggleActions: "play none none reverse"
        }
      }
    );
  });

}

/**
 * Interactive Capability Dials Handler
 */
function initCapabilities() {
  const cards = document.querySelectorAll('.capability-card');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not toggle active state if clicking on admin buttons or trigger widgets
      if (e.target.closest('.admin-edit-btn') || e.target.closest('#add-cap-trigger')) {
        return;
      }

      const isActive = card.classList.contains('active');

      // Collapse all cards first (accordion behavior)
      cards.forEach(otherCard => {
        otherCard.classList.remove('active');
      });

      // Toggle this card
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // Close capability panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.capability-card')) {
      cards.forEach(card => {
        card.classList.remove('active');
      });
    }
  });
}

/**
 * Fullscreen Orchestrator & Toggler
 */
function initFullscreen() {
  const toggleBtn = document.getElementById('fullscreen-toggle');
  const iconExpand = document.getElementById('fs-icon-expand');
  const iconCompress = document.getElementById('fs-icon-compress');
  if (!toggleBtn || !iconExpand || !iconCompress) return;

  // Toggle function
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // Enter fullscreen
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log(err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Update icons based on state
  function updateFullscreenIcons() {
    const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (isFS) {
      iconExpand.style.display = 'none';
      iconCompress.style.display = 'block';
    } else {
      iconExpand.style.display = 'block';
      iconCompress.style.display = 'none';
    }
  }

  // Event listeners
  toggleBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', updateFullscreenIcons);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
  document.addEventListener('msfullscreenchange', updateFullscreenIcons);
}

/**
 * Custom Scroll Progress Navigator Controller
 */
function initCustomScrollNav() {
  const scrollBead = document.getElementById('scroll-bead');
  const markers = document.querySelectorAll('.scroll-marker');
  const navBtns = document.querySelectorAll('.nav-btn');
  if (!scrollBead || !markers.length) return;

  const sections = ['hero', 'capabilities', 'projects', 'motivation'];
  const sectionNames = {
    'hero': 'Home',
    'capabilities': 'Capabilities',
    'projects': 'Projects',
    'motivation': 'Connect'
  };
  const markerPositions = {
    'hero': 0,
    'capabilities': 33.33,
    'projects': 66.66,
    'motivation': 100
  };
  const threshold = 4.0; // Trigger threshold percentage

  function updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const percent = (window.scrollY / scrollHeight) * 100;
    
    // Boundary clamp between 0 and 100
    const clampedPercent = Math.max(0, Math.min(100, percent));
    scrollBead.style.top = `${clampedPercent}%`;

    // Dynamic marker pulsing on active bead reach
    markers.forEach(marker => {
      const section = marker.getAttribute('data-section');
      const markerPercent = markerPositions[section];
      const distance = Math.abs(clampedPercent - markerPercent);
      
      if (distance < threshold) {
        if (!marker.classList.contains('reached')) {
          marker.classList.add('reached');
        }
      } else {
        marker.classList.remove('reached');
      }
    });

    // Determine current active section robustly
    let activeSecId = 'hero';
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isAtBottom) {
      activeSecId = 'motivation';
    } else if (window.scrollY < 100) {
      activeSecId = 'hero';
    } else {
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - sectionCenter);
          if (distance < minDistance) {
            minDistance = distance;
            activeSecId = id;
          }
        }
      });
    }

    // Synchronize Header Nav Buttons
    navBtns.forEach(btn => {
      if (btn.getAttribute('href') === `#${activeSecId}`) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Synchronize Custom Scroll Markers active state
    markers.forEach(marker => {
      if (marker.getAttribute('data-section') === activeSecId) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });

    // Update Floating Active Section Label Box
    updateActiveSectionLabel(sectionNames[activeSecId]);
  }

  // Smooth scroll to targeted section on click
  markers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = marker.getAttribute('data-section');
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress(); // Run once initially to align on load
}

/**
 * Update the floating active section label box with smooth fade slide transition
 */
function updateActiveSectionLabel(name) {
  const labelText = document.getElementById('active-section-text');
  if (!labelText || labelText.innerText === name) return;

  labelText.classList.add('changing');
  setTimeout(() => {
    labelText.innerText = name;
    labelText.classList.remove('changing');
  }, 200);
}

/**
 * Dynamic content loader & compiler
 */
async function loadAndRenderContent() {
  // Check admin state from local/session storage
  isAdminMode = sessionStorage.getItem('portfolio_admin_active') === 'true' || localStorage.getItem('portfolio_admin_active') === 'true';
  if (isAdminMode) {
    document.body.classList.add('admin-active');
  }

  // Initialize Supabase if config url is present
  const dbUrl = localStorage.getItem('supabase_url') || SUPABASE_CONFIG.url;
  const dbKey = sessionStorage.getItem('supabase_service_role_key') || localStorage.getItem('supabase_anon_key') || SUPABASE_CONFIG.anonKey;

  if (dbUrl && dbKey && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(dbUrl, dbKey);
      
      // Fetch Projects
      const { data: projData, error: projErr } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: true });
      if (!projErr && projData) {
        projectsData = projData;
      } else {
        console.warn("Supabase projects load error, using fallback:", projErr);
        projectsData = fallbackProjects;
      }

      // Fetch Capabilities
      const { data: capData, error: capErr } = await supabaseClient.from('capabilities').select('*').order('created_at', { ascending: true });
      if (!capErr && capData) {
        capabilitiesData = capData;
      } else {
        console.warn("Supabase capabilities load error, using fallback:", capErr);
        capabilitiesData = fallbackCapabilities;
      }
    } catch (err) {
      console.warn("Database initialization failed, using fallback values:", err);
      projectsData = fallbackProjects;
      capabilitiesData = fallbackCapabilities;
    }
  } else {
    // Default to fallback
    projectsData = fallbackProjects;
    capabilitiesData = fallbackCapabilities;
  }

  renderCapabilities();
  renderProjects();
}

/**
 * Render Capability dials dynamically
 */
function renderCapabilities() {
  const container = document.getElementById('capabilities-grid');
  if (!container) return;

  let html = capabilitiesData.map(cap => {
    return `
      <div class="capability-card" id="cap-${cap.id}">
        <!-- Vertical Title (visible when collapsed) -->
        <div class="capability-title-wrapper">
          <h3>${cap.title}</h3>
        </div>

        <!-- Details Content (revealed on hover/active) -->
        <div class="capability-details-wrapper">
          <!-- Admin Controls overlay -->
          <div class="admin-controls">
            <button class="admin-edit-btn edit-cap-trigger" data-id="${cap.id}" aria-label="Edit Capability">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>

          <h3 class="capability-expanded-title">${cap.title}</h3>
          
          <div class="capability-content">
            <p>${cap.description}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (isAdminMode) {
    html += `
      <div class="capability-card add-cap-card" id="add-cap-trigger">
        <div class="capability-title-wrapper">
          <h3>+ Add Capability</h3>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Render projects dynamically
 */
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  let html = projectsData.map((proj, idx) => {
    // Calculate card stack layout offsets
    const topOffset = -40 + idx * 22;
    const leftOffset = -40 + idx * 22;
    const zIndex = idx + 1;
    const rotateDeg = -8 + idx * 2.5;

    // Parse comma-separated tags
    const tagArray = typeof proj.tags === 'string' ? proj.tags.split(',') : (Array.isArray(proj.tags) ? proj.tags : []);
    const tagsHTML = tagArray.map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
    
    return `
      <div class="project-card" style="top: ${topOffset}px; left: ${leftOffset}px; z-index: ${zIndex}; transform: rotateZ(${rotateDeg}deg);" id="project-${proj.id}">
        <!-- Left 3D details flap (cardDetails) -->
        <div class="project-card-details">
          <div class="project-details-header">
            <!-- Admin Controls overlay -->
            <div class="admin-controls" style="position: relative; top: 0; right: 0; display: inline-flex; margin-bottom: 10px; z-index: 20;">
              <button class="admin-edit-btn edit-project-trigger" data-id="${proj.id}" aria-label="Edit Project">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            <p class="project-details-desc">${proj.description}</p>
            <div class="project-details-tags">
              ${tagsHTML}
            </div>
          </div>

          ${proj.link ? `
            <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="project-details-button">
              <span>View System</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          ` : ''}
        </div>

        <!-- Main card body content (always visible) -->
        <div class="project-badge">${proj.category || 'Technical System'}</div>
        <h3 class="project-title">${proj.title}</h3>
        <div class="project-card-hint">
          <span>Hover to open</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    `;
  }).join('');

  if (isAdminMode) {
    const idx = projectsData.length;
    const topOffset = -40 + idx * 22;
    const leftOffset = -40 + idx * 22;
    const zIndex = idx + 1;
    const rotateDeg = -8 + idx * 2.5;
    
    html += `
      <div class="project-card add-project-card-stack" id="add-project-trigger" style="top: ${topOffset}px; left: ${leftOffset}px; z-index: ${zIndex}; transform: rotateZ(${rotateDeg}deg);">
        <span>+ Add Project</span>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind click/tap triggers for mobile card detail toggles
  const cards = container.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not toggle active status if clicking details action links or admin edit controls
      if (e.target.closest('.admin-edit-btn') || e.target.closest('#add-project-trigger') || e.target.closest('.project-details-button')) {
        return;
      }
      
      const isActive = card.classList.contains('active');
      
      // Remove active state from all other project cards
      cards.forEach(c => c.classList.remove('active'));
      
      // Toggle this card
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // Close when clicking outside of any card
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
      cards.forEach(c => c.classList.remove('active'));
    }
  });
}

/**
 * Admin Credentials Portal & Logout Orchestrator
 */
function initCMS() {
  const adminBtn = document.getElementById('admin-trigger-btn');
  const adminModal = document.getElementById('admin-modal');
  const adminClose = document.getElementById('admin-modal-close');
  const dropZone = document.getElementById('admin-drop-zone');
  const fileInput = document.getElementById('admin-file-input');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const statusText = document.getElementById('admin-status-text');

  if (!adminBtn || !adminModal) return;

  // Open modal
  adminBtn.addEventListener('click', () => {
    adminModal.classList.add('open');
    updateAdminStatusUI();
  });

  const preloaderAdminBtn = document.getElementById('preloader-admin-btn');
  if (preloaderAdminBtn) {
    preloaderAdminBtn.addEventListener('click', () => {
      adminModal.classList.add('open');
      updateAdminStatusUI();
    });
  }

  // Close modal
  const closeModal = () => adminModal.classList.remove('open');
  adminClose.addEventListener('click', closeModal);
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) closeModal();
  });

  // Update Status UI
  function updateAdminStatusUI() {
    if (isAdminMode) {
      adminModal.classList.add('authorized');
      statusText.innerText = "Admin Mode (Read/Write)";
      logoutBtn.style.display = "block";
      dropZone.style.display = "none";
    } else {
      adminModal.classList.remove('authorized');
      statusText.innerText = "Public Mode (Read Only)";
      logoutBtn.style.display = "none";
      dropZone.style.display = "flex";
    }
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('portfolio_admin_active');
    sessionStorage.removeItem('portfolio_admin_active');
    sessionStorage.removeItem('supabase_service_role_key');
    alert("Admin Mode deactivated.");
    location.reload();
  });

  // Drag & drop handlers
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    handleCredentialsFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleCredentialsFile(file);
  });

  function handleCredentialsFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const creds = JSON.parse(event.target.result);
        if (creds && creds.admin_token === "vib-admin-mode-7a8d29b") {
          // Store credentials securely
          localStorage.setItem('portfolio_admin_active', 'true');
          localStorage.setItem('supabase_url', creds.supabase_url);
          localStorage.setItem('supabase_anon_key', creds.supabase_anon_key);
          sessionStorage.setItem('supabase_service_role_key', creds.supabase_service_role_key);
          sessionStorage.setItem('portfolio_admin_active', 'true');
          
          alert("Admin Mode Activated! Reloading page...");
          location.reload();
        } else {
          alert("Invalid admin credentials token!");
        }
      } catch (err) {
        alert("Error reading credentials JSON file!");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  // Hook Editors
  initProjectEditor();
  initCapabilityEditor();
}

/**
 * Project Content Manager Form
 */
function initProjectEditor() {
  const modal = document.getElementById('editor-modal');
  const closeBtn = document.getElementById('editor-modal-close');
  const form = document.getElementById('editor-form');
  const deleteBtn = document.getElementById('edit-project-delete');
  const editorTitle = document.getElementById('editor-title');

  if (!modal || !form) return;

  // Open modal for Adding a new project
  document.addEventListener('click', (e) => {
    const addTrigger = e.target.closest('#add-project-trigger');
    if (addTrigger) {
      editorTitle.innerText = "Add Project";
      form.reset();
      document.getElementById('edit-project-id').value = "";
      deleteBtn.style.display = "none";
      modal.classList.add('open');
    }
  });

  // Open modal for Editing an existing project
  document.addEventListener('click', (e) => {
    const editTrigger = e.target.closest('.edit-project-trigger');
    if (editTrigger) {
      const projId = editTrigger.getAttribute('data-id');
      const proj = projectsData.find(p => p.id == projId);
      if (proj) {
        editorTitle.innerText = "Edit Project";
        document.getElementById('edit-project-id').value = proj.id;
        document.getElementById('edit-project-title').value = proj.title;
        document.getElementById('edit-project-desc').value = proj.description;
        document.getElementById('edit-project-tags').value = Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags;
        document.getElementById('edit-project-image').value = proj.category || "";
        document.getElementById('edit-project-link').value = proj.link || "";
        
        deleteBtn.style.display = "block";
        modal.classList.add('open');
      }
    }
  });

  // Close modals
  const closeModal = () => modal.classList.remove('open');
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form Submit (Save / Insert)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!supabaseClient) {
      alert("Error: Supabase database is not initialized. Setup your credentials file first.");
      return;
    }

    const id = document.getElementById('edit-project-id').value;
    const title = document.getElementById('edit-project-title').value;
    const description = document.getElementById('edit-project-desc').value;
    const tagsRaw = document.getElementById('edit-project-tags').value;
    const category = document.getElementById('edit-project-image').value;
    const link = document.getElementById('edit-project-link').value;

    const projectPayload = {
      title,
      description,
      tags: tagsRaw,
      category,
      link
    };

    try {
      if (id) {
        // UPDATE existing project
        const { error } = await supabaseClient.from('projects').update(projectPayload).eq('id', id);
        if (error) throw error;
        alert("Project updated successfully!");
      } else {
        // INSERT new project
        const { error } = await supabaseClient.from('projects').insert([projectPayload]);
        if (error) throw error;
        alert("Project added successfully!");
      }
      location.reload();
    } catch (err) {
      alert("Error saving project: " + err.message);
    }
  });

  // Delete Project
  deleteBtn.addEventListener('click', async () => {
    const id = document.getElementById('edit-project-id').value;
    if (!id) return;
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const { error } = await supabaseClient.from('projects').delete().eq('id', id);
        if (error) throw error;
        alert("Project deleted successfully!");
        location.reload();
      } catch (err) {
        alert("Error deleting project: " + err.message);
      }
    }
  });
}

/**
 * Capability dial percentage & text editor
 */
function initCapabilityEditor() {
  const modal = document.getElementById('capability-editor-modal');
  const closeBtn = document.getElementById('cap-editor-modal-close');
  const form = document.getElementById('cap-editor-form');
  const deleteBtn = document.getElementById('edit-cap-delete');
  const editorTitle = document.getElementById('cap-editor-title');

  if (!modal || !form || !deleteBtn || !editorTitle) return;

  // Open modal for Adding a new capability
  document.addEventListener('click', (e) => {
    const addTrigger = e.target.closest('#add-cap-trigger');
    if (addTrigger) {
      editorTitle.innerText = "Add Capability";
      form.reset();
      document.getElementById('edit-cap-id').value = "";
      deleteBtn.style.display = "none";
      modal.classList.add('open');
    }
  });

  // Open modal for Editing capability
  document.addEventListener('click', (e) => {
    const editTrigger = e.target.closest('.edit-cap-trigger');
    if (editTrigger) {
      const capId = editTrigger.getAttribute('data-id');
      const cap = capabilitiesData.find(c => c.id == capId);
      if (cap) {
        editorTitle.innerText = "Edit Capability";
        document.getElementById('edit-cap-id').value = cap.id;
        document.getElementById('edit-cap-title').value = cap.title;
        document.getElementById('edit-cap-label').value = cap.label || cap.title.substring(0, 3).toUpperCase();
        document.getElementById('edit-cap-desc').value = cap.description;
        
        deleteBtn.style.display = "block";
        modal.classList.add('open');
      }
    }
  });

  // Close modals
  const closeModal = () => modal.classList.remove('open');
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form Submit (Save / Update / Insert)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!supabaseClient) {
      alert("Error: Supabase database is not initialized. Setup your credentials file first.");
      return;
    }

    const id = document.getElementById('edit-cap-id').value;
    const title = document.getElementById('edit-cap-title').value;
    const label = document.getElementById('edit-cap-label').value.substring(0, 3).toUpperCase();
    const description = document.getElementById('edit-cap-desc').value;

    // Preserve existing percentage when editing, or default to 90 for new ones
    let percentage = 90;
    if (id) {
      const cap = capabilitiesData.find(c => c.id == id);
      if (cap) {
        percentage = cap.percentage;
      }
    }

    const payload = {
      title,
      label,
      percentage,
      description
    };

    try {
      if (id) {
        // UPDATE existing capability
        const { error } = await supabaseClient.from('capabilities').update(payload).eq('id', id);
        if (error) throw error;
        alert("Capability updated successfully!");
      } else {
        // INSERT new capability
        const { error } = await supabaseClient.from('capabilities').insert([payload]);
        if (error) throw error;
        alert("Capability added successfully!");
      }
      location.reload();
    } catch (err) {
      alert("Error saving capability: " + err.message);
    }
  });

  // Delete Capability
  deleteBtn.addEventListener('click', async () => {
    const id = document.getElementById('edit-cap-id').value;
    if (!id) return;
    if (confirm("Are you sure you want to delete this capability?")) {
      try {
        const { error } = await supabaseClient.from('capabilities').delete().eq('id', id);
        if (error) throw error;
        alert("Capability deleted successfully!");
        location.reload();
      } catch (err) {
        alert("Error deleting capability: " + err.message);
      }
    }
  });
}
