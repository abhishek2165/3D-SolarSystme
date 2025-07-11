  // Global variables
        let scene, camera, renderer, controls;
        let planets = [];
        let sun;
        let isPaused = false;
        let clock = new THREE.Clock();
        let starField;
        let orbitLines = [];
        let planetLabels = [];
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        let selectedPlanet = null;
        let followingPlanet = null;
let cameraFollowOffset = { x: 0, y: 10, z: 15 };
        
        // 360 View Controls
        let mouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let cameraAngleX = 0;
        let cameraAngleY = 0;
        let cameraDistance = 100;
        let autoRotate = true;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartDistance = 0;
        let isTouch = false;

        // Planet data with realistic properties
        const planetData = [
    { 
        name: 'Mercury', 
        size: 0.38, 
        distance: 10, 
        speed: 4.74, 
        color: 0x8C7853, 
        info: 'Closest planet to the Sun. Extremely hot days and cold nights.',
        history: {
            distanceFromSun: '36 million miles (58 million km)',
            discoveredBy: 'Known to ancient civilizations',
            yearDiscovered: 'Prehistoric times',
            composition: 'Iron core with thin silicate mantle',
            atmosphere: 'Extremely thin - mostly oxygen, sodium, hydrogen',
            temperature: 'Day: 800°F (430°C), Night: -300°F (-180°C)',
            dayLength: '176 Earth days',
            yearLength: '88 Earth days',
            moons: '0',
            funFacts: [
                'Smallest planet in our solar system',
                'Has the most eccentric orbit',
                'Has water ice at its poles',
                'Named after Roman messenger god'
            ]
        }
    },
    { 
        name: 'Venus', 
        size: 0.95, 
        distance: 15, 
        speed: 3.5, 
        color: 0xFFC649, 
        info: 'Hottest planet in our solar system due to greenhouse effect.',
        history: {
            distanceFromSun: '67 million miles (108 million km)',
            discoveredBy: 'Known to ancient civilizations',
            yearDiscovered: 'Prehistoric times',
            composition: 'Iron core, rocky mantle, thick atmosphere',
            atmosphere: '96% carbon dioxide, 3.5% nitrogen',
            temperature: '900°F (462°C) - hottest planet',
            dayLength: '243 Earth days (retrograde rotation)',
            yearLength: '225 Earth days',
            moons: '0',
            funFacts: [
                'Rotates backwards (retrograde)',
                'Brightest planet in our sky',
                'Has crushing atmospheric pressure',
                'Named after Roman goddess of love'
            ]
        }
    },
    { 
        name: 'Earth', 
        size: 1, 
        distance: 20, 
        speed: 2.98, 
        color: 0x6B93D6, 
        info: 'Our home planet. The only known planet with life.',
        history: {
            distanceFromSun: '93 million miles (150 million km)',
            discoveredBy: 'Our home planet',
            yearDiscovered: 'Always known',
            composition: 'Iron core, silicate mantle and crust',
            atmosphere: '78% nitrogen, 21% oxygen, 1% other gases',
            temperature: 'Average: 57°F (14°C)',
            dayLength: '24 hours',
            yearLength: '365.25 days',
            moons: '1 (The Moon)',
            funFacts: [
                'Only known planet with life',
                '71% of surface covered by water',
                'Has plate tectonics',
                'Protected by magnetic field'
            ]
        }
    },
    { 
        name: 'Mars', 
        size: 0.53, 
        distance: 25, 
        speed: 2.41, 
        color: 0xC1440E, 
        info: 'The Red Planet. Has the largest volcano in the solar system.',
        history: {
            distanceFromSun: '142 million miles (228 million km)',
            discoveredBy: 'Known to ancient civilizations',
            yearDiscovered: 'Prehistoric times',
            composition: 'Iron core, basaltic mantle, iron oxide surface',
            atmosphere: '95% carbon dioxide, 3% nitrogen, 2% argon',
            temperature: 'Average: -80°F (-62°C)',
            dayLength: '24 hours 37 minutes',
            yearLength: '687 Earth days',
            moons: '2 (Phobos and Deimos)',
            funFacts: [
                'Home to largest volcano (Olympus Mons)',
                'Has polar ice caps',
                'Evidence of ancient water flows',
                'Named after Roman god of war'
            ]
        }
    },
    { 
        name: 'Jupiter', 
        size: 2.5, 
        distance: 35, 
        speed: 1.31, 
        color: 0xD8CA9D, 
        info: 'Largest planet. Has a Great Red Spot storm.',
        history: {
            distanceFromSun: '484 million miles (778 million km)',
            discoveredBy: 'Known to ancient civilizations',
            yearDiscovered: 'Prehistoric times',
            composition: 'Mostly hydrogen and helium gas',
            atmosphere: '89% hydrogen, 10% helium, 1% other gases',
            temperature: 'Average: -234°F (-148°C)',
            dayLength: '9 hours 56 minutes',
            yearLength: '12 Earth years',
            moons: '95+ known moons',
            funFacts: [
                'Largest planet in solar system',
                'Great Red Spot is a giant storm',
                'Acts as solar system vacuum cleaner',
                'Named after Roman king of gods'
            ]
        }
    },
    { 
        name: 'Saturn', 
        size: 2.1, 
        distance: 45, 
        speed: 0.97, 
        color: 0xFAD5A5, 
        info: 'Famous for its spectacular ring system.',
        history: {
            distanceFromSun: '886 million miles (1.4 billion km)',
            discoveredBy: 'Known to ancient civilizations',
            yearDiscovered: 'Prehistoric times',
            composition: 'Mostly hydrogen and helium gas',
            atmosphere: '96% hydrogen, 3% helium, 1% other gases',
            temperature: 'Average: -288°F (-178°C)',
            dayLength: '10 hours 42 minutes',
            yearLength: '29 Earth years',
            moons: '146+ known moons',
            funFacts: [
                'Has spectacular ring system',
                'Less dense than water',
                'Moon Titan has thick atmosphere',
                'Named after Roman god of agriculture'
            ]
        }
    },
    { 
        name: 'Uranus', 
        size: 1.6, 
        distance: 55, 
        speed: 0.68, 
        color: 0x4FD0E7, 
        info: 'Tilted planet that rotates on its side.',
        history: {
            distanceFromSun: '1.8 billion miles (2.9 billion km)',
            discoveredBy: 'William Herschel',
            yearDiscovered: '1781',
            composition: 'Water, methane, ammonia ices with rocky core',
            atmosphere: '83% hydrogen, 15% helium, 2% methane',
            temperature: 'Average: -357°F (-216°C)',
            dayLength: '17 hours 14 minutes',
            yearLength: '84 Earth years',
            moons: '27 known moons',
            funFacts: [
                'Rotates on its side (98° tilt)',
                'Has faint ring system',
                'Coldest planetary atmosphere',
                'Named after Greek god of sky'
            ]
        }
    },
    { 
        name: 'Neptune', 
        size: 1.5, 
        distance: 65, 
        speed: 0.54, 
        color: 0x4B70DD, 
        info: 'Windiest planet with speeds up to 2,100 km/h.',
        history: {
            distanceFromSun: '2.8 billion miles (4.5 billion km)',
            discoveredBy: 'Urbain Le Verrier, John Couch Adams',
            yearDiscovered: '1846',
            composition: 'Water, methane, ammonia ices with rocky core',
            atmosphere: '80% hydrogen, 19% helium, 1% methane',
            temperature: 'Average: -373°F (-225°C)',
            dayLength: '16 hours 6 minutes',
            yearLength: '165 Earth years',
            moons: '16 known moons',
            funFacts: [
                'Windiest planet in solar system',
                'First planet discovered by mathematics',
                'Has Great Dark Spot storm',
                'Named after Roman god of sea'
            ]
        }
    }
];

        // Initialize the scene
        function init() {
            // Create scene
            scene = new THREE.Scene();
            
            // Create camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 20, 80);
            
            // Create renderer
            renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
            scene.add(ambientLight);
            
            // Create sun
            createSun();
            
            // Create planets
            createPlanets();
            
            // Create star field
            createStarField();
            
            // Create orbit lines
            createOrbitLines();
            
            // Setup controls
            setupControls();
            
            // Setup event listeners
            setupEventListeners();
            
            // Start animation
            animate();
            
            // Hide loading screen
            document.getElementById('loading').style.display = 'none';
        }

        function createSun() {
            const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
            const sunMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFD700,
                emissive: 0xFFD700,
                emissiveIntensity: 0.5
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            scene.add(sun);
            
            // Add sun light
            const sunLight = new THREE.PointLight(0xFFFFFF, 2, 200);
            sunLight.position.set(0, 0, 0);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 2048;
            sunLight.shadow.mapSize.height = 2048;
            scene.add(sunLight);
            
            // Add sun glow effect
            const glowGeometry = new THREE.SphereGeometry(4, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.3
            });
            const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(sunGlow);
        }

        function createPlanets() {
            planetData.forEach((data, index) => {
                const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
                const planetMaterial = new THREE.MeshPhongMaterial({ 
                    color: data.color,
                    shininess: 30
                });
                
                const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                planet.position.x = data.distance;
                planet.castShadow = true;
                planet.receiveShadow = true;
                planet.userData = { ...data, angle: Math.random() * Math.PI * 2, originalSpeed: data.speed };
                
                scene.add(planet);
                planets.push(planet);
                
               // Add planet rings for Saturn
if (data.name === 'Saturn') {
    const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2.5, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFAD5A5,
        transparent: true,
        opacity: 1.6,
        side: THREE.DoubleSide
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    planet.add(rings);
}
            });
        }

        function createStarField() {
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 5000;
            const starPositions = new Float32Array(starCount * 3);
            
            for (let i = 0; i < starCount * 3; i += 3) {
                starPositions[i] = (Math.random() - 0.5) * 400;
                starPositions[i + 1] = (Math.random() - 0.5) * 400;
                starPositions[i + 2] = (Math.random() - 0.5) * 400;
            }
            
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            
            const starMaterial = new THREE.PointsMaterial({
                color: 0xFFFFFF,
                size: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            starField = new THREE.Points(starGeometry, starMaterial);
            scene.add(starField);
        }

        function createOrbitLines() {
            planetData.forEach(data => {
                const orbitGeometry = new THREE.BufferGeometry();
                const orbitPoints = [];
                
                for (let i = 0; i <= 64; i++) {
                    const angle = (i / 64) * Math.PI * 2;
                    orbitPoints.push(
                        Math.cos(angle) * data.distance,
                        0,
                        Math.sin(angle) * data.distance
                    );
                }
                
                orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
                
                const orbitMaterial = new THREE.LineBasicMaterial({ 
                    color: 0x444444,
                    transparent: true,
                    opacity: 0.3
                });
                
                const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
                orbitLines.push(orbitLine);
                scene.add(orbitLine);
            });
        }

        function setupControls() {
            // Create planet controls
            const controlsContainer = document.getElementById('planetControls');
            
            planets.forEach((planet, index) => {
                const controlDiv = document.createElement('div');
                controlDiv.className = 'planet-control';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'planet-name';
                nameDiv.innerHTML = `
                    <span class="planet-color" style="background-color: #${planet.userData.color.toString(16).padStart(6, '0')}"></span>
                    ${planet.userData.name}
                `;
                
                const speedDiv = document.createElement('div');
                speedDiv.className = 'speed-control';
                
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '0';
                slider.max = '10';
                slider.value = planet.userData.speed.toString();
                slider.step = '0.1';
                slider.className = 'speed-slider';
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'speed-value';
                valueSpan.textContent = planet.userData.speed.toFixed(1);
                
                slider.addEventListener('input', (e) => {
                    const newSpeed = parseFloat(e.target.value);
                    planet.userData.speed = newSpeed;
                    valueSpan.textContent = newSpeed.toFixed(1);
                });
                
                speedDiv.appendChild(slider);
                speedDiv.appendChild(valueSpan);
                
                controlDiv.appendChild(nameDiv);
                controlDiv.appendChild(speedDiv);
                controlsContainer.appendChild(controlDiv);
            });
        }

        function setupEventListeners() {
            // Pause/Resume button
            document.getElementById('pauseBtn').addEventListener('click', () => {
                isPaused = !isPaused;
                document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
            });
            
            // Reset button
            document.getElementById('resetBtn').addEventListener('click', () => {
                planets.forEach(planet => {
                    planet.userData.speed = planet.userData.originalSpeed;
                    planet.userData.angle = Math.random() * Math.PI * 2;
                });
                
                // Reset sliders
                document.querySelectorAll('.speed-slider').forEach((slider, index) => {
                    slider.value = planets[index].userData.originalSpeed;
                    slider.nextElementSibling.textContent = planets[index].userData.originalSpeed.toFixed(1);
                });
                
                // Reset camera
                cameraAngleX = 0;
                cameraAngleY = 0;
                cameraDistance = 100;
                document.getElementById('zoomSlider').value = 100;
                
                isPaused = false;
                document.getElementById('pauseBtn').textContent = 'Pause';
            });
            
            // 360 View Controls - Mouse Events
            const canvas = document.getElementById('canvas');
            
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('wheel', onMouseWheel);
            canvas.addEventListener('contextmenu', e => e.preventDefault());
            
            // Touch Events for Mobile
            canvas.addEventListener('touchstart', onTouchStart);
            canvas.addEventListener('touchmove', onTouchMove);
            canvas.addEventListener('touchend', onTouchEnd);
            
            // Settings checkboxes
            document.getElementById('orbitsCheck').addEventListener('click', (e) => {
                e.target.classList.toggle('checked');
                const show = e.target.classList.contains('checked');
                orbitLines.forEach(line => line.visible = show);
            });
            
            document.getElementById('starsCheck').addEventListener('click', (e) => {
                e.target.classList.toggle('checked');
                const show = e.target.classList.contains('checked');
                starField.visible = show;
            });
            
            document.getElementById('autoRotateCheck').addEventListener('click', (e) => {
                e.target.classList.toggle('checked');
                autoRotate = e.target.classList.contains('checked');
            });
            
            // Zoom slider
            document.getElementById('zoomSlider').addEventListener('input', (e) => {
                cameraDistance = parseInt(e.target.value);
            });
            
            // Window resize
            window.addEventListener('resize', onWindowResize);
        }
        
        // Mouse Control Functions
        function onMouseDown(event) {
            if (event.button === 0) { // Left click
                mouseDown = true;
                mouseX = event.clientX;
                mouseY = event.clientY;
                autoRotate = false;
                document.getElementById('autoRotateCheck').classList.remove('checked');
                canvas.style.cursor = 'grabbing';
            }
        }
        
        function onMouseUp(event) {
            mouseDown = false;
            canvas.style.cursor = 'grab';
            
            // Check for planet click only if mouse didn't move much
            if (Math.abs(event.clientX - mouseX) < 5 && Math.abs(event.clientY - mouseY) < 5) {
                onMouseClick(event);
            }
        }
        
        function onMouseWheel(event) {
            event.preventDefault();
            const delta = event.deltaY > 0 ? 10 : -10;
            cameraDistance = Math.max(30, Math.min(300, cameraDistance + delta));
            document.getElementById('zoomSlider').value = cameraDistance;
        }
        
        // Touch Control Functions
        function onTouchStart(event) {
            event.preventDefault();
            if (event.touches.length === 1) {
                isTouch = true;
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                mouseX = touchStartX;
                mouseY = touchStartY;
                autoRotate = false;
                document.getElementById('autoRotateCheck').classList.remove('checked');
            } else if (event.touches.length === 2) {
                // Handle pinch zoom
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                touchStartDistance = distance;
            }
        }
        
        function onTouchMove(event) {
            event.preventDefault();
            if (event.touches.length === 1 && isTouch) {
                const deltaX = event.touches[0].clientX - mouseX;
                const deltaY = event.touches[0].clientY - mouseY;
                
                cameraAngleX += deltaX * 0.01;
                cameraAngleY += deltaY * 0.01;
                cameraAngleY = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraAngleY));
                
                mouseX = event.touches[0].clientX;
                mouseY = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                // Handle pinch zoom
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const distance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                if (touchStartDistance) {
                    const scale = distance / touchStartDistance;
                    cameraDistance = Math.max(30, Math.min(300, cameraDistance / scale));
                    document.getElementById('zoomSlider').value = cameraDistance;
                    touchStartDistance = distance;
                }
            }
        }
        
        function onTouchEnd(event) {
            event.preventDefault();
            if (event.touches.length === 0) {
                isTouch = false;
                
                // Check for planet tap
                if (Math.abs(event.changedTouches[0].clientX - touchStartX) < 10 && 
                    Math.abs(event.changedTouches[0].clientY - touchStartY) < 10) {
                    // Simulate mouse click for planet selection
                    const fakeEvent = {
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY
                    };
                    onMouseClick(fakeEvent);
                }
            }
        }

        function onMouseMove(event) {
            // Handle camera rotation
            if (mouseDown) {
                const deltaX = event.clientX - mouseX;
                const deltaY = event.clientY - mouseY;
                
                cameraAngleX += deltaX * 0.01;
                cameraAngleY += deltaY * 0.01;
                cameraAngleY = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraAngleY));
                
                mouseX = event.clientX;
                mouseY = event.clientY;
                return;
            }
            
            // Handle planet hover detection
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets);
            
            if (intersects.length > 0) {
                const planet = intersects[0].object;
                showPlanetInfo(planet.userData);
                if (!mouseDown) {
                    document.getElementById('canvas').style.cursor = 'pointer';
                }
            } else {
                hidePlanetInfo();
                if (!mouseDown) {
                    document.getElementById('canvas').style.cursor = 'grab';
                }
            }
        }

        function onMouseClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets);
            
            if (intersects.length > 0) {
                const planet = intersects[0].object;
                focusOnPlanet(planet);
            }
        }

        function showPlanetInfo(planetData) {
            const infoDiv = document.getElementById('planetInfo');
            infoDiv.innerHTML = `
                <h4>${planetData.name}</h4>
                <p><strong>Size:</strong> ${planetData.size}x Earth</p>
                <p><strong>Distance:</strong> ${planetData.distance} AU</p>
                <p><strong>Speed:</strong> ${planetData.speed.toFixed(1)} km/s</p>
                <p>${planetData.info}</p>
            `;
        }

        function hidePlanetInfo() {
            document.getElementById('planetInfo').innerHTML = '<p>Hover over a planet to see details</p>';
        }

        function focusOnPlanet(planet) {
    // Set following planet
    followingPlanet = planet;
    
    // Calculate optimal viewing distance based on planet size
    const optimalDistance = planet.userData.size * 8 + 15;
    
    // Calculate target position relative to planet
    const planetPos = planet.position.clone();
    const targetDistance = optimalDistance;
    
    // Update camera follow offset
    cameraFollowOffset = {
        x: targetDistance * 0.5,
        y: targetDistance * 0.3,
        z: targetDistance * 0.8
    };
    
    // Show detailed planet information
    showDetailedPlanetInfo(planet.userData);
    
    // Smoothly transition to planet focus
    const startAngleX = cameraAngleX;
    const startAngleY = cameraAngleY;
    const startDistance = cameraDistance;
    
    // Calculate target angles to look at planet
    const targetAngleX = Math.atan2(planetPos.z, planetPos.x) + Math.PI;
    const targetAngleY = Math.atan2(planetPos.y, Math.sqrt(planetPos.x * planetPos.x + planetPos.z * planetPos.z));
    
    const duration = 1500;
    const startTime = Date.now();
    
    // Disable auto rotate during focus
    autoRotate = false;
    document.getElementById('autoRotateCheck').classList.remove('checked');
    
    function animateToTarget() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const ease = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate angles
        cameraAngleX = startAngleX + (targetAngleX - startAngleX) * ease;
        cameraAngleY = startAngleY + (targetAngleY - startAngleY) * ease;
        cameraDistance = startDistance + (targetDistance - startDistance) * ease;
        
        // Update zoom slider
        document.getElementById('zoomSlider').value = cameraDistance;
        
        if (progress < 1) {
            requestAnimationFrame(animateToTarget);
        }
    }
    
    animateToTarget();
}
// 6. Add this new function to show detailed planet information
function showDetailedPlanetInfo(planetData) {
    const infoPanel = document.querySelector('.info-panel');
    const detailsDiv = document.getElementById('planetDetails');
    const basicInfo = document.getElementById('planetInfo');
    
    // Hide basic info and show detailed info
    basicInfo.style.display = 'none';
    detailsDiv.classList.add('active');
    infoPanel.classList.add('detailed');
    
    const history = planetData.history;
    
    detailsDiv.innerHTML = `
        <div class="detail-section">
            <h4>🌟 ${planetData.name}</h4>
            <div class="detail-row">
                <span class="detail-label">Distance from Sun:</span>
                <span class="detail-value">${history.distanceFromSun}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Discovered by:</span>
                <span class="detail-value">${history.discoveredBy}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Year Discovered:</span>
                <span class="detail-value">${history.yearDiscovered}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🏗️ Physical Properties</h4>
            <div class="detail-row">
                <span class="detail-label">Composition:</span>
                <span class="detail-value">${history.composition}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Atmosphere:</span>
                <span class="detail-value">${history.atmosphere}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Temperature:</span>
                <span class="detail-value">${history.temperature}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🕐 Time & Motion</h4>
            <div class="detail-row">
                <span class="detail-label">Day Length:</span>
                <span class="detail-value">${history.dayLength}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Year Length:</span>
                <span class="detail-value">${history.yearLength}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Moons:</span>
                <span class="detail-value">${history.moons}</span>
            </div>
        </div>
        
        <div class="fun-facts">
            <h4>✨ Fun Facts</h4>
            <ul>
                ${history.funFacts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button class="follow-indicator" onclick="toggleFollow()">
                ${followingPlanet ? 'Following Planet' : 'Follow Planet'}
            </button>
            <button class="close-details" onclick="closeDetailedInfo()">
                Close Details
            </button>
        </div>
    `;
}

// 7. Add these new functions
function toggleFollow() {
    if (followingPlanet) {
        followingPlanet = null;
        document.querySelector('.follow-indicator').textContent = 'Follow Planet';
        autoRotate = true;
        document.getElementById('autoRotateCheck').classList.add('checked');
    } else {
        // This will be handled by planet click
    }
}

function closeDetailedInfo() {
    const infoPanel = document.querySelector('.info-panel');
    const detailsDiv = document.getElementById('planetDetails');
    const basicInfo = document.getElementById('planetInfo');
    
    // Show basic info and hide detailed info
    basicInfo.style.display = 'block';
    detailsDiv.classList.remove('active');
    infoPanel.classList.remove('detailed');
    
    // Reset basic info
    basicInfo.innerHTML = '<p>Click on a planet to see detailed information</p>';
    
    // Stop following planet
    followingPlanet = null;
    autoRotate = true;
    document.getElementById('autoRotateCheck').classList.add('checked');
}



        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            
            if (!isPaused) {
                // Rotate sun
                sun.rotation.y += delta * 0.5;
                
                // Update planet positions
                planets.forEach(planet => {
                    planet.userData.angle += delta * planet.userData.speed * 0.1;
                    
                    planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
                    planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
                    
                    // Rotate planet
                    planet.rotation.y += delta * 2;
                });
                
                // Rotate star field slowly
                starField.rotation.y += delta * 0.05;
            }
            
            // Update camera position based on 360 controls
            updateCameraPosition();
            
            renderer.render(scene, camera);
        }
        
        // 8. Update your updateCameraPosition function to include planet following
function updateCameraPosition() {
    if (followingPlanet && !mouseDown && !isTouch) {
        // Follow the selected planet
        const planetPos = followingPlanet.position.clone();
        
        // Calculate camera position relative to planet
        const targetX = planetPos.x + cameraFollowOffset.x;
        const targetY = planetPos.y + cameraFollowOffset.y;
        const targetZ = planetPos.z + cameraFollowOffset.z;
        
        // Smoothly move camera to follow planet
        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.02);
        camera.lookAt(planetPos);
        
        return;
    }
    
    if (autoRotate && !mouseDown && !isTouch && !followingPlanet) {
        // Auto rotate around the solar system
        const time = Date.now() * 0.0005;
        cameraAngleX = time;
        cameraAngleY = Math.sin(time * 0.3) * 0.2;
    }
    
    // Calculate camera position based on spherical coordinates
    const x = Math.cos(cameraAngleY) * Math.cos(cameraAngleX) * cameraDistance;
    const y = Math.sin(cameraAngleY) * cameraDistance;
    const z = Math.cos(cameraAngleY) * Math.sin(cameraAngleX) * cameraDistance;
    
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
}

// 1. Add this function to your existing JavaScript code (around line 600, after the animate function)
function setupSearchBar() {
    const searchInput = document.getElementById('planetSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.classList.remove('active');
            return;
        }
        
        // Filter planets based on search query
        const filteredPlanets = planetData.filter(planet => 
            planet.name.toLowerCase().includes(query) ||
            planet.info.toLowerCase().includes(query)
        );
        
        if (filteredPlanets.length > 0) {
            searchResults.innerHTML = filteredPlanets.map(planet => `
                <div class="search-result-item" onclick="searchAndFocusPlanet('${planet.name}')">
                    <div class="result-planet-name">${planet.name}</div>
                    <div class="result-planet-info">${planet.info}</div>
                </div>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No planets found</div>';
            searchResults.classList.add('active');
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-panel')) {
            searchResults.classList.remove('active');
        }
    });
}

// 2. Add this function right after setupSearchBar()
function searchAndFocusPlanet(planetName) {
    const planet = planets.find(p => p.userData.name === planetName);
    if (planet) {
        focusOnPlanet(planet);
        document.getElementById('planetSearch').value = '';
        document.getElementById('searchResults').classList.remove('active');
    }
}

let ambientSound;

// Add this function to initialize the background space sound
function initSpaceSound() {
    ambientSound = new Audio('sound/WhatsApp Audio 2025-07-11 at 10.36.59_405572d8.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0.3;
    
    // Auto-play with user interaction fallback
    ambientSound.play().catch(() => {
        // Fallback: play on first user interaction
        document.addEventListener('click', () => {
            ambientSound.play();
        }, { once: true });
    });
}

initSpaceSound();
setupSearchBar();
        init();
