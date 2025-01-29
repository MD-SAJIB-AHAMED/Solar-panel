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

// Create planets
const planetData = [
    { name: "Mercury", radius: 0.4, distance: 4, color: 0xaaaaaa },
    { name: "Venus", radius: 0.95, distance: 6, color: 0xffa500 },
    { name: "Earth", radius: 1, distance: 8, color: 0x0000ff },
    { name: "Mars", radius: 0.53, distance: 10, color: 0xff0000 },
    { name: "Jupiter", radius: 11, distance: 15, color: 0xffcc00 },
    { name: "Saturn", radius: 9.5, distance: 18, color: 0xf4a300 },
    { name: "Uranus", radius: 4, distance: 22, color: 0x00ffff },
    { name: "Neptune", radius: 3.8, distance: 25, color: 0x0000ff }
];

const planets = planetData.map((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    mesh.name = planet.name;
    scene.add(mesh);
    return mesh;
});

// Adjust camera position to ensure planets are visible
camera.position.z = 40;

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