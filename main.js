import './style.css';
import * as THREE from 'three';

let scene, camera, renderer, starGeo, stars;
let starParticles = []; // To store the individual star objects with velocity and acceleration

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Create and position camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2; // Looking down the Z-axis

  // Create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create star geometry
  starGeo = new THREE.BufferGeometry();
  const starVertices = [];

  for (let i = 0; i < 7000; i++) {
    let star = {
      position: new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300
      ),
      velocity: 0,
      acceleration: 0.02
    };
    starParticles.push(star);
    starVertices.push(star.position.x, star.position.y, star.position.z);
  }

  // Assign the positions to the buffer geometry
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  // Load star texture
  const sprite = new THREE.TextureLoader().load('/circle-64.png');

  // Create material with star texture
  const starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.9,
    map: sprite,
    transparent: true // Make background of texture transparent
  });

  // Create star points
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  // Start animation
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate the star field
  stars.rotation.y += 0.003;
  // stars.rotation.z += 0.002;

  // Update star positions
  let positions = starGeo.attributes.position.array;
  for (let i = 0; i < starParticles.length; i++) {
    let p = starParticles[i];
    p.velocity += p.acceleration;
    p.position.y -= p.velocity;

    if (p.position.y < -200) {
      p.position.y = 200;
      p.velocity = 0;
    }

    // positions[i * 3] = p.position.x;
    positions[i * 3 + 1] = p.position.y;
    // positions[i * 3 + 2] = p.position.z;
  }

  // Flag the position attribute for updates
  starGeo.attributes.position.needsUpdate = true;

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();
