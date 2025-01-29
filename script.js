const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light sources
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(0, 0, 0); // Sun's position
scene.add(pointLight);

// Sun (with texture)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunTexture = new THREE.TextureLoader().load('https://example.com/sun_texture.jpg'); // Replace with actual texture URL
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets with textures
const planetData = [
    { name: "Mercury", radius: 0.4, distance: 4, texture: 'https://example.com/mercury_texture.jpg' },
    { name: "Venus", radius: 0.95, distance: 6, texture: 'https://example.com/venus_texture.jpg' },
    { name: "Earth", radius: 1, distance: 8, texture: 'https://example.com/earth_texture.jpg' },
    { name: "Mars", radius: 0.53, distance: 10, texture: 'https://example.com/mars_texture.jpg' },
    { name: "Jupiter", radius: 11, distance: 15, texture: 'https://example.com/jupiter_texture.jpg' },
    { name: "Saturn", radius: 9.5, distance: 18, texture: 'https://example.com/saturn_texture.jpg' },
    { name: "Uranus", radius: 4, distance: 22, texture: 'https://example.com/uranus_texture.jpg' },
    { name: "Neptune", radius: 3.8, distance: 25, texture: 'https://example.com/neptune_texture.jpg' }
];

const planets = planetData.map((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const texture = new THREE.TextureLoader().load(planet.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    mesh.name = planet.name;
    scene.add(mesh);
    return mesh;
});

// Camera setup
let cameraDistance = 50;
function updateCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const maxDistance = Math.max(...planetData.map(planet => planet.distance)) * 1.5;
    camera.position.z = Math.max(cameraDistance, maxDistance);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCamera();
});

updateCamera();

// Planet rotation and orbit in 3D
let angle = 0;
function animate() {
    requestAnimationFrame(animate);

    angle += 0.01;

    planets.forEach((planet, index) => {
        const orbitAngle = angle * (index + 1); // Different orbit speeds
        planet.position.x = planetData[index].distance * Math.cos(orbitAngle);
        planet.position.z = planetData[index].distance * Math.sin(orbitAngle);
        planet.rotation.y += 0.01; // Rotation of planet itself
    });

    renderer.render(scene, camera);
}

animate();

// Add click event to display planet info
const planetInfo = document.getElementById('planet-info');
const planetName = document.getElementById('planet-name');
const planetDetails = document.getElementById('planet-details');

planets.forEach(planet => {
    planet.userData = { name: planet.name, distance: planetData.find(p => p.name === planet.name).distance };
    planet.addEventListener('click', () => {
        planetName.textContent = planet.userData.name;
        planetDetails.textContent = `Distance from Sun: ${planet.userData.distance} million km`;
    });
});