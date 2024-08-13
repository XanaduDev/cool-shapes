import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { RectAreaLightHelper } from './RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js';
import { shapes } from './shapes.js';
import { createMesh} from './styles.js';

init();

function init() {
    // Renderer Setup
    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 0, -30);

    // Scene and Controls Setup
    const scene = new THREE.Scene();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Window Resize Event Listener
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Initial Variables
    let currentShape = 'torusKnot',
        currentParams = { ...shapes[currentShape].defaultValues },
        currentStyle = 'solid',
        isRainbow = true,
        currentColor = 'rainbow',
        mesh;

    // Lighting Setup
    RectAreaLightUniformsLib.init();

    const pointLight = new THREE.PointLight(0xffffff, 50);
    pointLight.position.set(5, 10, -5);
    scene.add(pointLight); 

    const lights = [
        { color: 0x0000ff, position: [-13, 0, 15] },
        { color: 0x00ff00, position: [0, 0, 15] },
        { color: 0xff0000, position: [13, 0, 15] },
        { color: 0xffffff, position: [0, 0, -80], rotation: Math.PI }
    ];

    // Add RectAreaLights to Scene
    lights.forEach(({ color, position, rotation = 0 }) => {
        const rectLight = new THREE.RectAreaLight(color, 5, 10, 28);
        rectLight.position.set(...position);
        rectLight.rotation.y += rotation;
        scene.add(rectLight);
        scene.add(new RectAreaLightHelper(rectLight));
    });

    // Floor Setup
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 0.1, 1000),
        new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.1, metalness: 0 })
    );
    floor.position.set(0, -12.5, -35);
    scene.add(floor);

        // Create Shape Function
    function createShape() {
        if (mesh) scene.remove(mesh);
    
        const { geometry: geometryFn } = shapes[currentShape];
        const geometry = geometryFn(currentParams);
        const color = isRainbow ? getRainbowColor(0) : currentColor;
    
        // Use the imported function to create the mesh
        mesh = createMesh(geometry, currentStyle, color);
    
        scene.add(mesh);
    }

    // Update Parameter Options Function
    function updateParameterOptions() {
        const parameterSelector = document.getElementById('parameter-selector');
        if (!parameterSelector) return;

        // Populate parameter selector with options
        parameterSelector.innerHTML = '<option value="" disabled selected>Parameters</option>';
        shapes[currentShape].parameters.forEach(param => {
            parameterSelector.innerHTML += `<option value="${param}">${param.charAt(0).toUpperCase() + param.slice(1)}</option>`;
        });

        currentParams = { ...shapes[currentShape].defaultValues };
        resetCamera();
        createShape();
    }

    // Update Parameter Value Function
    function updateParameterValue(param, value) {
        currentParams[param] = parseFloat(value) || shapes[currentShape].defaultValues[param];
        createShape();
    }

    // Rainbow Color Function
    function getRainbowColor(value) {
        return new THREE.Color(`hsl(${value * 360}, 100%, 50%)`);
    }

    // Reset Camera Function
    function resetCamera() {
        camera.position.set(0, 5, -40);
        controls.reset();
    }

    // Animation Loop
    let colorValue = 0, isInteracting = false;
    function animate() {
        requestAnimationFrame(animate);
        if (mesh && !isInteracting) { // Rotate the shape unless interacting
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            if (isRainbow) {
                colorValue = (colorValue + 0.001) % 1;
                mesh.material.color = getRainbowColor(colorValue);
            }
        }
        controls.update();
        renderer.render(scene, camera);
    }

    // Mouse Interaction Event Listeners
    document.addEventListener('mousedown', () => isInteracting = true);
    document.addEventListener('mouseup', () => isInteracting = false);

    // Initialize Parameter Options and Start Animation
    updateParameterOptions();
    animate();

    // Event Listeners for Selectors
    document.getElementById('shape-selector').addEventListener('change', e => {
        currentShape = e.target.value;
        updateParameterOptions();
    });

    document.getElementById('parameter-selector').addEventListener('change', e => {
        const param = e.target.value, inputField = document.getElementById('param-input') || document.createElement('input');
        if (!inputField.id) {
            inputField.type = 'number';
            inputField.id = 'param-input';
            inputField.min = '1';
            inputField.style.position = 'absolute';
            inputField.style.top = '180px';
            inputField.style.left = '20px';
            document.body.appendChild(inputField);
        }
        inputField.value = currentParams[param] || shapes[currentShape].defaultValues[param];
        inputField.oninput = e => updateParameterValue(param, e.target.value);
    });

    document.getElementById('style-selector').addEventListener('change', e => {
        currentStyle = e.target.value;
        createShape();
    });

    document.getElementById('color-selector').addEventListener('change', e => {
        isRainbow = e.target.value === 'rainbow';
        currentColor = isRainbow ? new THREE.Color(0xff0000) : new THREE.Color(e.target.value);
        createShape();
    });
}
