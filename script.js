const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a light source
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(0, 0, 0);
scene.add(light);

// Create a sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets with auto-adjusted sizes
const planetData = [
    { name: "Mercury", radius: 0.4, distance: 4 },
    { name: "Venus", radius: 0.95, distance: 6 },
    { name: "Earth", radius: 1, distance: 8 },
    { name: "Mars", radius: 0.53, distance: 10 },
    { name: "Jupiter", radius: 11, distance: 15 },
    { name: "Saturn", radius: 9.5, distance: 18 },
    { name: "Uranus", radius: 4, distance: 22 },
    { name: "Neptune", radius: 3.8, distance: 25 }
];

const planets = planetData.map((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    mesh.name = planet.name;
    scene.add(mesh);
    return mesh;
});

// Adjust camera to fit everything and make it responsive
let cameraDistance = 50;
function updateCamera() {
    // Calculate camera distance based on window size
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

// Planet rotation and orbit
let angle = 0;
function animate() {
    requestAnimationFrame(animate);

    // Rotate the planets in their orbits
    angle += 0.01;

    planets.forEach((planet, index) => {
        planet.position.x = planetData[index].distance * Math.cos(angle * (index + 1));
        planet.position.z = planetData[index].distance * Math.sin(angle * (index + 1));
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

// Utility function to generate random planet colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}