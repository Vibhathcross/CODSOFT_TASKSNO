// Wait for DOM and Third-party libraries to load
document.addEventListener('DOMContentLoaded', () => {
  initThreeBG();
  initAnimations();
  initCapabilities();
  initPreloader();
  initFullscreen();
  initCustomScrollNav();
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
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Geometry - low-poly 3D Icosahedron wireframe
  const radius = window.innerWidth < 768 ? 1.6 : 2.5; // Responsive scaling on init
  const geometry = new THREE.IcosahedronGeometry(radius, 1); // 1 detail level for perfect low-poly wireframe

  // Wireframe material - opacity of 0.15 for ambient overlay
  const material = new THREE.MeshBasicMaterial({
    color: 0xD32F2F,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  // Create Mesh
  const icosahedron = new THREE.Mesh(geometry, material);
  scene.add(icosahedron);

  // Position adjustment
  icosahedron.position.set(0, 0, 0);

  // --- Neon Rain Setup ---
  const rainCount = 120;
  const rainPositions = new Float32Array(rainCount * 3); // 1 vertex per point (x,y,z)
  const rainSpeeds = [];

  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 15;
    rainPositions[i * 3 + 1] = Math.random() * 20 - 10;
    rainPositions[i * 3 + 2] = Math.random() * 4 - 2;
    rainSpeeds.push(0.02 + Math.random() * 0.04);
  }

  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

  // Create circular neon drop texture programmatically
  const canvasTextureElement = document.createElement('canvas');
  canvasTextureElement.width = 32;
  canvasTextureElement.height = 32;
  const textureCtx = canvasTextureElement.getContext('2d');

  // Radial gradient: white hot center, transitioning to neon red, transitioning to transparent edge
  const dropGradient = textureCtx.createRadialGradient(16, 16, 1, 16, 16, 15);
  dropGradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');     // Pure white hot core
  dropGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  dropGradient.addColorStop(0.4, 'rgba(255, 0, 51, 0.85)');     // Glowing neon red boundary
  dropGradient.addColorStop(1, 'rgba(255, 0, 51, 0)');          // Fading edge

  textureCtx.fillStyle = dropGradient;
  textureCtx.beginPath();
  textureCtx.arc(16, 16, 16, 0, Math.PI * 2);
  textureCtx.fill();

  const rainTexture = new THREE.CanvasTexture(canvasTextureElement);

  const rainMaterial = new THREE.PointsMaterial({
    size: 0.22,
    map: rainTexture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  scene.add(rain);

  // Animation Loop / Passive Rotation
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth constant ambient rotation
    const elapsedTime = clock.getElapsedTime();
    icosahedron.rotation.y = elapsedTime * 0.04;
    icosahedron.rotation.x = elapsedTime * 0.02;

    // Update Neon Rain Positions
    const positions = rainGeometry.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      let y = positions[i * 3 + 1];
      y -= rainSpeeds[i];
      
      // Reset if below viewport bounds
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

  // Responsive Window Resize Listener
  window.addEventListener('resize', () => {
    // Camera Aspect Ratio Update
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Renderer Resize
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic Geometry Rescale on Resize
    const newRadius = window.innerWidth < 768 ? 1.6 : 2.5;
    icosahedron.geometry.dispose();
    icosahedron.geometry = new THREE.IcosahedronGeometry(newRadius, 1);
  });

  // Bind WebGL Mesh Rotation to Window Scroll (Scroll Scrubbing) via GSAP
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(icosahedron.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 3,
      z: Math.PI,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8 // smooth scroll-bound scrubbing
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

  // 2. Active State Page Scroll Tracker for Nav Buttons
  const sections = ['hero', 'capabilities', 'projects', 'motivation'];
  const navBtns = document.querySelectorAll('.nav-btn');
  const scrollMarkers = document.querySelectorAll('.scroll-marker');

  sections.forEach(secId => {
    ScrollTrigger.create({
      trigger: `#${secId}`,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: self => {
        if (self.isActive) {
          // Update header buttons
          navBtns.forEach(btn => {
            if (btn.getAttribute('href') === `#${secId}`) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });

          // Update custom side scroll markers
          scrollMarkers.forEach(marker => {
            if (marker.getAttribute('data-section') === secId) {
              marker.classList.add('active');
            } else {
              marker.classList.remove('active');
            }
          });
        }
      }
    });
  });
}

/**
 * Interactive Capability Dials Handler
 */
function initCapabilities() {
  const cards = document.querySelectorAll('.capability-card');

  cards.forEach(card => {
    const dial = card.querySelector('.neomorphic-dial');
    const wrapper = card.querySelector('.capability-content-wrapper');
    const content = card.querySelector('.capability-content');

    if (!dial || !wrapper || !content) return;

    dial.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = card.classList.contains('active');

      if (isActive) {
        // Collapse currently active dial
        card.classList.remove('active');
        wrapper.style.maxHeight = '0px';
        dial.setAttribute('aria-expanded', 'false');
      } else {
        // Close all other active dials (Accordion style)
        cards.forEach(otherCard => {
          if (otherCard.classList.contains('active')) {
            otherCard.classList.remove('active');
            otherCard.querySelector('.capability-content-wrapper').style.maxHeight = '0px';
            otherCard.querySelector('.neomorphic-dial').setAttribute('aria-expanded', 'false');
          }
        });

        // Expand this dial
        card.classList.add('active');
        // Set dynamic height from DOM scrollHeight to execute smooth transition
        wrapper.style.maxHeight = `${content.scrollHeight + 20}px`;
        dial.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close capability panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.capability-card')) {
      cards.forEach(card => {
        if (card.classList.contains('active')) {
          card.classList.remove('active');
          card.querySelector('.capability-content-wrapper').style.maxHeight = '0px';
          card.querySelector('.neomorphic-dial').setAttribute('aria-expanded', 'false');
        }
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
  if (!scrollBead || !markers.length) return;

  // Update active bead offset position relative to scroll height percentage
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
