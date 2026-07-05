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
    title: "Jasmin AI Assistant & OS Automation",
    category: "Featured System",
    description: "Designed a hybrid local/cloud AI assistant ecosystem with an advanced React UI and native OS controls for automated system operations. Built 'MTM' for deep progress analytics and integrated background yt-dlp servers for headless audio streaming.",
    tags: "React, AI/Voice, OS Control, Node.js",
    link: "https://github.com/Vibhathcross/jasmin-AI"
  },
  {
    id: "p2",
    title: "AeroStream",
    category: "Desktop Utility",
    description: "Engineered a premium desktop media companion for ad-free YouTube search, video playback, and offline downloads utilizing Electron, React, and Vite. Intercepted CORS constraints, seamlessly integrating yt-dlp and ffmpeg for automated stream extraction and local transcoding.",
    tags: "Electron, React, Vite, yt-dlp, FFmpeg",
    link: "https://github.com/Vibhathcross/Aerostream/tree/main"
  },
  {
    id: "p3",
    title: "Aether Carbon Unified Sync Matrix",
    category: "Hackathon Winner",
    description: "Designed and engineered this specialized synchronization application exclusively for the Prompt Wars hackathon hosted by Hack2skill and Google. <br><br><a href=\"https://www.linkedin.com/posts/vibhath-t-k-360b2525a_promptwars-hack2skill-googlefordevelopers-ugcPost-7474357143165390848-TXll/?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD_h6bgB0VdAMlYfvDs6G0DYlvJekttGrIk\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: var(--accent-red); font-weight: bold; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;\">LinkedIn Post <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:12px; height:12px;\"><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line></svg></a>",
    tags: "Sync Engine, Data Science, Prompt Wars",
    link: "https://vibhathcross.github.io/unified-carbon-data/"
  },
  {
    id: "p4",
    title: "VidZone Video Editor",
    category: "Desktop Utility",
    description: "Deployed a bespoke desktop video editing utility optimized to streamline content creation workflows for YouTube, automating rendering tasks.",
    tags: "Video Processing, Automation, Electron",
    link: "https://github.com/Vibhathcross/VidZone-Video-Editor"
  },
  {
    id: "p5",
    title: "Thripura Press Digital Platform",
    category: "Full-Stack Web",
    description: "Engineered a highly functional business website, utilizing AI-augmented development methodologies to drive clean UI/UX paradigms, digitalize operations, and manage client inquiries.",
    tags: "AI-Augmented, HTML5, CSS3, JS",
    link: "https://vibhathcross.github.io/Thripura-Buisiness-Webpage/"
  },
  {
    id: "p6",
    title: "Personal Interactive Portfolio",
    category: "Frontend Portfolio",
    description: "Leveraged AI-driven development for rapid UI/UX design and frontend implementation to build a dynamic, responsive single-page web portfolio showcasing ongoing software architectures.",
    tags: "Three.js, Neomorphism, Vanilla JS, CMS",
    link: "https://vibhathcross.github.io/Portfolio/"
  }
];

const fallbackCapabilities = [
  {
    id: "c1",
    title: "Languages & Frameworks",
    label: "L&F",
    percentage: 90,
    description: "<ul><li>C</li><li>Python</li><li>HTML5 / CSS3</li><li>JavaScript / TypeScript</li><li>React JS</li><li>Tailwind CSS</li></ul>"
  },
  {
    id: "c2",
    title: "Core CS Foundations",
    label: "CS",
    percentage: 90,
    description: "<ul><li>Data Structures & Algorithms (DSA)</li><li>Operating Systems (OS)</li><li>Computer Networking</li></ul>"
  },
  {
    id: "c3",
    title: "Engineering Specialties",
    label: "ENG",
    percentage: 90,
    description: "<ul><li>OS Automation</li><li>UI/UX Design</li><li>Data Science</li><li>Full-Stack App Development</li></ul>"
  },
  {
    id: "c4",
    title: "Methodologies",
    label: "MET",
    percentage: 90,
    description: "<ul><li>AI-Augmented Development (UI/UX & App Dev)</li><li>AI-Assisted Rapid Prototyping</li><li>Prompt Engineering</li><li>Generative AI Orchestration</li></ul>"
  }
];

let credentialsData = [];
let resumeBlobUrl = './resume.pdf'; // default fallback

const fallbackCredentials = [
  {
    id: "cr1",
    type: "education",
    title: "B.Tech in Information Technology",
    issuer: "Government Engineering College, Idukki",
    meta: "Expected Graduation: 2028",
    link: ""
  },
  {
    id: "cr2",
    type: "certification",
    title: "5-Day Web Development Bootcamp (HTML, CSS, JS, React, Tailwind)",
    issuer: "µLearn IDK & INOVUS LABS IEDC, Kristu Jyoti College",
    meta: "",
    link: "https://www.linkedin.com/posts/vibhath-t-k-360b2525a_the-certificate-is-a-certificate-of-completion-ugcPost-7477941498307592193-kSFt/?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD_h6bgB0VdAMlYfvDs6G0DYlvJekttGrIk"
  },
  {
    id: "cr3",
    type: "certification",
    title: "Introduction to Generative AI",
    issuer: "Google Cloud Training (via Coursera)",
    meta: "",
    link: "https://www.linkedin.com/posts/vibhath-t-k-360b2525a_my-introduction-to-generative-ai-certification-ugcPost-7476479473157185537-pwDC/?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD_h6bgB0VdAMlYfvDs6G0DYlvJekttGrIk"
  },
  {
    id: "cr4",
    type: "certification",
    title: "Foundations of Cybersecurity",
    issuer: "Google (via Coursera)",
    meta: "",
    link: "https://www.linkedin.com/posts/vibhath-t-k-360b2525a_completed-google-foundations-of-cybersecurity-ugcPost-7431922421286256640-B2QM/"
  },
  {
    id: "cr5",
    type: "certification",
    title: "30-Day Data Analytics MasterClass",
    issuer: "NoviTech R&D",
    meta: "",
    link: "https://www.linkedin.com/posts/vibhath-t-k-360b2525a_dataanalytics-certification-continuouslearning-share-7351878488020176897-5S1P/"
  },
  {
    id: "cr6",
    type: "certification",
    title: "Digital 101 Program",
    issuer: "NASSCOM & MeitY",
    meta: "",
    link: "https://www.linkedin.com/posts/vibhath-t-k-360b2525a_futureskillsprime-digital101-ai-share-7347297810418962436-L3p5/"
  }
];

// Fetch resume asset from database as base64 and generate Object URL
async function fetchResumeAsset() {
  if (!supabaseClient) {
    // No DB: wire up local fallback with JS fetch-blob force download
    wireLocalResumeDownload();
    return;
  }
  try {
    const { data, error } = await supabaseClient.from('assets').select('*').eq('name', 'resume').single();
    if (data && !error) {
      const binaryString = atob(data.file_data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.file_type || 'application/pdf' });
      resumeBlobUrl = URL.createObjectURL(blob);
      
      const downloadBtn = document.getElementById('resume-download-btn');
      if (downloadBtn) {
        // Override click to force download from DB blob
        downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const a = document.createElement('a');
          a.href = resumeBlobUrl;
          a.download = 'Vibhath_TK_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    } else {
      // DB had no resume row - fallback to local file
      wireLocalResumeDownload();
    }
  } catch (err) {
    console.warn('Fallback to local resume PDF due to error:', err);
    wireLocalResumeDownload();
  }
}

// Force-download the local resume.pdf as a blob to bypass GitHub Pages MIME restrictions
function wireLocalResumeDownload() {
  const downloadBtn = document.getElementById('resume-download-btn');
  if (!downloadBtn) return;
  downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('./resume.pdf');
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'Vibhath_TK_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      // Last resort: open in new tab
      window.open('./resume.pdf', '_blank');
    }
  });
}

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
  // Get glow elements
  const glowLeft = document.getElementById('scroll-glow-left');
  const glowRight = document.getElementById('scroll-glow-right');

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

    // ─ Scroll-driven Side Glow Animation ─
    if (glowLeft && glowRight) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? Math.min(Math.max(currentScrollY / maxScroll, 0), 1) : 0;
      
      // Calculate vertical position of the light wave (oscillates between 5% and 95% height)
      const glowYLeft = 50 + Math.sin(scrollPercent * Math.PI * 5) * 45;
      const glowYRight = 50 + Math.cos(scrollPercent * Math.PI * 5) * 45;
      
      // Set background radial gradients centered at edges, fading completely at 45px (no overflow/separation lines)
      glowLeft.style.background = `radial-gradient(circle at 0px ${glowYLeft}%, rgba(211, 47, 47, 0.85) 0%, rgba(211, 47, 47, 0.25) 15px, rgba(211, 47, 47, 0) 45px)`;
      glowRight.style.background = `radial-gradient(circle at 200px ${glowYRight}%, rgba(211, 47, 47, 0.85) 0%, rgba(211, 47, 47, 0.25) 15px, rgba(211, 47, 47, 0) 45px)`;

      // Opacity breathing
      const leftOpacity = 0.6 + 0.35 * Math.sin(scrollPercent * Math.PI * 1.5);
      const rightOpacity = 0.6 + 0.35 * Math.cos(scrollPercent * Math.PI * 1.5);
      glowLeft.style.opacity = Math.max(0.4, Math.min(leftOpacity, 0.95));
      glowRight.style.opacity = Math.max(0.4, Math.min(rightOpacity, 0.95));

      // Horizontal wave translation (subtle 8px shift)
      const waveLeft = Math.sin(scrollPercent * Math.PI * 8) * 8;
      const waveRight = Math.cos(scrollPercent * Math.PI * 8) * 8;
      glowLeft.style.transform = `translateX(${waveLeft}px)`;
      glowRight.style.transform = `translateX(${waveRight}px)`;
    }

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

  const sections = ['hero', 'capabilities', 'projects', 'credentials', 'motivation'];
  const sectionNames = {
    'hero': 'Home',
    'capabilities': 'Capabilities',
    'projects': 'Projects',
    'credentials': 'Credentials',
    'motivation': 'Connect'
  };
  const markerPositions = {
    'hero': 0,
    'capabilities': 25,
    'projects': 50,
    'credentials': 75,
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
  // Check admin state from local/session storage service role key presence strictly (preventing "null"/"undefined" string bypasses)
  const serviceRoleKey = localStorage.getItem('supabase_service_role_key') || sessionStorage.getItem('supabase_service_role_key');
  isAdminMode = !!(serviceRoleKey && serviceRoleKey !== 'null' && serviceRoleKey !== 'undefined' && serviceRoleKey.length > 10);
  
  if (isAdminMode) {
    document.body.classList.add('admin-active');
  }

  // Initialize Supabase if config url is present
  const dbUrl = localStorage.getItem('supabase_url') || SUPABASE_CONFIG.url;
  
  let dbKey = serviceRoleKey;
  if (!dbKey || dbKey === 'null' || dbKey === 'undefined' || dbKey.length < 10) {
    dbKey = localStorage.getItem('supabase_anon_key') || SUPABASE_CONFIG.anonKey;
  }

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

      // Fetch Credentials
      const { data: credData, error: credErr } = await supabaseClient.from('credentials').select('*').order('created_at', { ascending: true });
      if (!credErr && credData) {
        credentialsData = credData;
      } else {
        console.warn("Supabase credentials load error, using fallback:", credErr);
        credentialsData = fallbackCredentials;
      }

      // Fetch Resume File
      await fetchResumeAsset();
    } catch (err) {
      console.warn("Database initialization failed, using fallback values:", err);
      projectsData = fallbackProjects;
      capabilitiesData = fallbackCapabilities;
      credentialsData = fallbackCredentials;
    }
  } else {
    // Default to fallback
    projectsData = fallbackProjects;
    capabilitiesData = fallbackCapabilities;
    credentialsData = fallbackCredentials;
  }

  renderCapabilities();
  renderProjects();
  renderCredentials();
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
          <h3 class="capability-expanded-title">${cap.title}</h3>
          
          <div class="capability-content">
            <p>${cap.description}</p>
            ${isAdminMode ? `
              <div style="text-align: center; margin-top: 15px;">
                <span class="admin-edit-link edit-cap-trigger" data-id="${cap.id}" style="font-size: 0.75rem; text-decoration: underline; cursor: pointer; color: var(--accent-red); font-weight: 600; font-family: var(--font-display); letter-spacing: 0.5px; text-transform: uppercase;">EDIT DETAILS</span>
              </div>
            ` : ''}
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
    // Parse comma-separated tags
    const tagArray = typeof proj.tags === 'string' ? proj.tags.split(',') : (Array.isArray(proj.tags) ? proj.tags : []);
    const tagsHTML = tagArray.map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
    
    return `
      <div class="project-card" id="project-${proj.id}">
        <div class="layton-all">
          <!-- Front of the Layton Card (Title instead of Hat) -->
          <div class="layton-front">
            <div class="layton-front-title">
              <h3>${proj.title}</h3>
            </div>
            <div class="layton-text"><p>PROJECT</p></div>
            <div class="layton-text"><p>00${idx + 1}</p></div>
          </div>
          
          <!-- Back of the Layton Card -->
          <div class="layton-back">
            <div class="layton-back-text-box">
              <h4>${proj.title}</h4>
              <p>${proj.description}</p>
              <div class="layton-back-tags">
                ${tagsHTML}
              </div>
              <div class="layton-back-actions" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: auto;">
                ${proj.link ? `
                  <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="layton-back-btn">
                    <span>VIEW SYSTEM</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px; height:11px; stroke: currentColor;"><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                ` : ''}
                ${isAdminMode ? `
                  <span class="admin-edit-link edit-project-trigger" data-id="${proj.id}" style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: underline; cursor: pointer; color: var(--accent-red); font-family: var(--font-display);">EDIT</span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (isAdminMode) {
    html += `
      <div class="project-card add-project-card-stack" id="add-project-trigger">
        <div class="layton-all">
          <div class="layton-front" style="border-style: dashed; border-color: var(--accent-red); background-color: rgba(211, 47, 47, 0.01); box-shadow: none;">
            <div class="layton-front-title">
              <h3>+ ADD PROJECT</h3>
            </div>
            <div class="layton-text"><p>NEW</p></div>
            <div class="layton-text"><p>PROJECT</p></div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind click/tap triggers for mobile card detail toggles
  const cards = container.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not toggle active status if clicking details action links, buttons, or admin edit controls
      if (e.target.closest('.admin-edit-btn') || e.target.closest('.admin-edit-link') || e.target.closest('#add-project-trigger') || e.target.closest('.layton-back-btn') || e.target.closest('a')) {
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
 * Render Credentials section (Education and Certifications) dynamically
 */
function renderCredentials() {
  const eduContainer = document.getElementById('education-list');
  const certContainer = document.getElementById('certifications-list');
  if (!eduContainer || !certContainer) return;

  const eduItems = credentialsData.filter(c => c.type === 'education');
  const certItems = credentialsData.filter(c => c.type === 'certification');

  // 1. Render Education Items
  let eduHTML = eduItems.map(cred => {
    return `
      <div class="education-item" id="cred-${cred.id}">
        <div class="edu-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="edu-icon"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
        </div>
        <div class="edu-details">
          <h4 class="edu-degree">${cred.title}</h4>
          <p class="edu-school">${cred.issuer}</p>
          ${cred.meta ? `<span class="edu-date">${cred.meta}</span>` : ''}
          ${isAdminMode ? `
            <span class="admin-edit-link edit-credential-trigger" data-id="${cred.id}" style="display: block; margin-top: 8px; font-size: 0.72rem; text-decoration: underline; cursor: pointer; color: var(--accent-red); font-weight: 700; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.5px;">EDIT</span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (isAdminMode) {
    eduHTML += `
      <button class="add-credential-trigger" id="add-edu-trigger" data-type="education">
        + Add Academic Background
      </button>
    `;
  }
  eduContainer.innerHTML = eduHTML;

  // 2. Render Certification Items
  let certHTML = certItems.map(cred => {
    return `
      <div class="cert-item" id="cred-${cred.id}">
        <div class="cert-info">
          <h4 class="cert-title">${cred.title}</h4>
          <p class="cert-issuer">${cred.issuer}</p>
          ${cred.meta ? `<span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 4px;">${cred.meta}</span>` : ''}
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          ${cred.link ? `
            <a href="${cred.link}" target="_blank" rel="noopener noreferrer" class="cert-verify-btn">Verify</a>
          ` : ''}
          ${isAdminMode ? `
            <span class="admin-edit-link edit-credential-trigger" data-id="${cred.id}" style="font-size: 0.72rem; text-decoration: underline; cursor: pointer; color: var(--accent-red); font-weight: 700; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">EDIT</span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (isAdminMode) {
    certHTML += `
      <button class="add-credential-trigger" id="add-cert-trigger" data-type="certification">
        + Add Certification
      </button>
    `;
  }
  certContainer.innerHTML = certHTML;
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
    localStorage.removeItem('supabase_service_role_key');
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
          localStorage.setItem('supabase_service_role_key', creds.supabase_service_role_key);
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

  // Resume upload handler
  const resumeUploadBtn = document.getElementById('admin-resume-upload-btn');
  const resumeFileInput = document.getElementById('admin-resume-file-input');
  
  if (resumeUploadBtn && resumeFileInput) {
    resumeUploadBtn.addEventListener('click', () => {
      resumeFileInput.click();
    });
    
    resumeFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result.split(',')[1];
        try {
          if (!supabaseClient) {
            alert('Supabase is not connected. Credentials upload is only available when online.');
            return;
          }
          
          resumeUploadBtn.innerText = 'Uploading...';
          const { error } = await supabaseClient.from('assets').upsert({
            name: 'resume',
            file_data: base64Data,
            file_type: 'application/pdf',
            updated_at: new Date()
          });
          
          if (error) throw error;
          alert('Resume uploaded successfully! Reloading...');
          location.reload();
        } catch (err) {
          alert('Error uploading resume: ' + err.message);
          resumeUploadBtn.innerText = 'Upload PDF';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Hook Editors
  initProjectEditor();
  initCapabilityEditor();
  initCredentialEditor();
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

/**
 * Credentials editor controller (education and certifications CRUD)
 */
function initCredentialEditor() {
  const modal = document.getElementById('credential-editor-modal');
  const closeBtn = document.getElementById('credential-editor-modal-close');
  const form = document.getElementById('credential-editor-form');
  const deleteBtn = document.getElementById('edit-credential-delete');
  const editorTitle = document.getElementById('credential-editor-title');

  if (!modal || !form || !deleteBtn || !editorTitle) return;

  // Open modal for Adding a new credential
  document.addEventListener('click', (e) => {
    const addEduTrigger = e.target.closest('#add-edu-trigger');
    const addCertTrigger = e.target.closest('#add-cert-trigger');
    
    if (addEduTrigger || addCertTrigger) {
      const type = addEduTrigger ? 'education' : 'certification';
      editorTitle.innerText = addEduTrigger ? "Add Academic Background" : "Add Certification";
      
      form.reset();
      document.getElementById('edit-credential-id').value = "";
      document.getElementById('edit-credential-type').value = type;
      deleteBtn.style.display = "none";
      modal.classList.add('open');
    }
  });

  // Open modal for Editing a credential
  document.addEventListener('click', (e) => {
    const editTrigger = e.target.closest('.edit-credential-trigger');
    if (editTrigger) {
      const credId = editTrigger.getAttribute('data-id');
      const cred = credentialsData.find(c => c.id == credId);
      if (cred) {
        editorTitle.innerText = cred.type === 'education' ? "Edit Academic Background" : "Edit Certification";
        document.getElementById('edit-credential-id').value = cred.id;
        document.getElementById('edit-credential-type').value = cred.type;
        document.getElementById('edit-credential-title').value = cred.title;
        document.getElementById('edit-credential-issuer').value = cred.issuer;
        document.getElementById('edit-credential-meta').value = cred.meta || "";
        document.getElementById('edit-credential-link').value = cred.link || "";
        
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

    const id = document.getElementById('edit-credential-id').value;
    const type = document.getElementById('edit-credential-type').value;
    const title = document.getElementById('edit-credential-title').value;
    const issuer = document.getElementById('edit-credential-issuer').value;
    const meta = document.getElementById('edit-credential-meta').value;
    const link = document.getElementById('edit-credential-link').value;

    const payload = {
      type,
      title,
      issuer,
      meta: meta || null,
      link: link || null
    };

    try {
      if (id) {
        // UPDATE existing credential
        const { error } = await supabaseClient.from('credentials').update(payload).eq('id', id);
        if (error) throw error;
        alert("Credential updated successfully!");
      } else {
        // INSERT new credential
        const { error } = await supabaseClient.from('credentials').insert([payload]);
        if (error) throw error;
        alert("Credential added successfully!");
      }
      location.reload();
    } catch (err) {
      alert("Error saving credential: " + err.message);
    }
  });

  // Delete Credential
  deleteBtn.addEventListener('click', async () => {
    const id = document.getElementById('edit-credential-id').value;
    if (!id) return;
    if (confirm("Are you sure you want to delete this credential?")) {
      try {
        const { error } = await supabaseClient.from('credentials').delete().eq('id', id);
        if (error) throw error;
        alert("Credential deleted successfully!");
        location.reload();
      } catch (err) {
        alert("Error deleting credential: " + err.message);
      }
    }
  });
}
