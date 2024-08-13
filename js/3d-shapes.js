import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { RectAreaLightHelper } from './RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js';
import { shapes } from './shapes.js';

init();

function init() {
    // Initialize Three.js scene, camera, and renderer
    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 35, 5, -30 );

    const scene = new THREE.Scene();

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Event listener for window resizing
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    let currentShape = 'torus';
    let currentParams = { ...shapes[currentShape].defaultValues };
    let currentStyle = 'solid';
    let isRainbow = true;
    let currentColor = new THREE.Color(0xff0000);
    let mesh;

    // Add lights
    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight( 0x0000ff, 5, 10, 28 );
    rectLight1.position.set( - 13, 0, 15 );
    scene.add( rectLight1 );

    const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 10, 28 );
    rectLight2.position.set( 0, 0, 15 );
    scene.add( rectLight2 );

    const rectLight3 = new THREE.RectAreaLight( 0xff0000, 5, 10, 28 );
    rectLight3.position.set( 13, 0, 15 );
    scene.add( rectLight3 );

    // Create the RectAreaLight
    const rectLight4 = new THREE.RectAreaLight(0xFFFFFF, 5, 15, 25);
    rectLight4.position.set(0, 0, -80);
    rectLight4.rotation.y += Math.PI;  // 180 degrees in radians
    scene.add(rectLight4);

    // Add the RectAreaLightHelper to visualize the light (optional)
    scene.add( new RectAreaLightHelper( rectLight4 ) );


    scene.add( new RectAreaLightHelper( rectLight1 ) );
    scene.add( new RectAreaLightHelper( rectLight2 ) );
    scene.add( new RectAreaLightHelper( rectLight3 ) );


    // Floor
    const geoFloor = new THREE.BoxGeometry( 1000, 0.1, 1000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xbcbcbc, roughness: 0.1, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    mshStdFloor.position.set(0, - 12.5, -35);
    scene.add( mshStdFloor );

    // Reset camera position and zoom
    function resetCamera() {
        camera.position.set(0, 5, -40);
        controls.reset();
    }

    // Create and add shape to scene
    function createShape() {
        if (mesh) scene.remove(mesh);

        const { geometry: geometryFn } = shapes[currentShape];
        const geometry = geometryFn(currentParams);
        const color = isRainbow ? getRainbowColor(0) : currentColor;

        let material;
        switch (currentStyle) { 
            case 'points': mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 0.5 })); break; 
            case 'line': mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color })); break; 
            case 'basic': mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color })); break; 
            case 'matcap': material = new THREE.MeshMatcapMaterial({ matcap: new THREE.TextureLoader().load('photos/metcap.png') }); material.color.set(color); mesh = new THREE.Mesh(geometry, material); break; 
            case 'normal': mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial()); break; 
            default: mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.5, wireframe: currentStyle === 'wireframe' })); mesh.castShadow = true; break; 
        }

        scene.add(mesh);
    }

    // Update parameter options based on selected shape
    function updateParameterOptions() {
        const parameterSelector = document.getElementById('parameter-selector');
        if (!parameterSelector) return; // Early exit if element not found

        const parameters = shapes[currentShape].parameters;

        // Clear current options
        parameterSelector.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Parameters';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        parameterSelector.appendChild(defaultOption);

        // Add new options based on selected shape
        parameters.forEach(param => {
            const option = document.createElement('option');
            option.value = param;
            option.textContent = param.charAt(0).toUpperCase() + param.slice(1);
            parameterSelector.appendChild(option);
        });

        // Reset current parameters
        currentParams = { ...shapes[currentShape].defaultValues };
        parameterSelector.selectedIndex = 0; // Set default selection to "Select a parameter"

        // Update parameter input field
        const paramInput = document.getElementById('param-input');
        if (paramInput) {
            paramInput.value = currentParams[parameterSelector.value] || '';
        }

        // Show the parameter selector
        parameterSelector.style.display = 'block';

        // Reset camera and zoom
        resetCamera();

        // Create new shape
        createShape();    
    }

    // Update parameter value when selected
    function updateParameterValue(param, value) {
        currentParams[param] = parseFloat(value) || shapes[currentShape].defaultValues[param];
        createShape();
    }

    // Helper function to get a color based on value (0 to 1) cycling through rainbow hues
    function getRainbowColor(value) {
        const hue = value * 360;
        return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    }

    let colorValue = 0;
    let isInteracting = false;


    // Animate function
    function animate() {
        requestAnimationFrame(animate);

        if (mesh) {
            if (!isInteracting) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
            }

            if (isRainbow) {
                colorValue += 0.001;
                if (colorValue > 1) colorValue = 0;
                mesh.material.color = getRainbowColor(colorValue);
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }

    // Event listeners for mouse interactions
    document.addEventListener('mousedown', () => {
        isInteracting = true;
    });

    document.addEventListener('mouseup', () => {
        isInteracting = false;
    });

    // Initialize shape and parameters
    updateParameterOptions();
    createShape();

    // Start animation loop
    animate();

    // Event listeners for UI controls
    document.getElementById('shape-selector').addEventListener('change', (event) => {
        currentShape = event.target.value;
        updateParameterOptions();
    });

    document.getElementById('parameter-selector').addEventListener('change', (event) => {
        const param = event.target.value;

        if (param) {
            let inputField = document.getElementById('param-input');
            if (!inputField) {
                inputField = document.createElement('input');
                inputField.type = 'number';
                inputField.id = 'param-input';
                inputField.min = '0';
                inputField.style.position = 'absolute';
                inputField.style.top = '180px';
                inputField.style.left = '20px';
                inputField.value = currentParams[param] || shapes[currentShape].defaultValues[param];
                inputField.addEventListener('input', (e) => updateParameterValue(param, e.target.value));
                document.body.appendChild(inputField);
            } else {
                inputField.value = currentParams[param] || shapes[currentShape].defaultValues[param];
                inputField.oninput = (e) => updateParameterValue(param, e.target.value);
            }
        }
    });

    document.getElementById('style-selector').addEventListener('change', (event) => {
        currentStyle = event.target.value;
        createShape();
    });

    document.getElementById('color-selector').addEventListener('change', (event) => {
        const value = event.target.value;
        isRainbow = value === 'rainbow';
        currentColor = isRainbow ? new THREE.Color(0xff0000) : new THREE.Color(value);
        createShape();
    });
}