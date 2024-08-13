import * as THREE from './three.module.js';

const shapes = {
    // Basic Shapes
    torus: {
        geometry: (params) => new THREE.TorusGeometry(
            params.radius || 7,
            params.tube || 3.5,
            params.radialSegments || 100,
            params.tubularSegments || 100
        ),
        parameters: ['radius', 'tube', 'radialSegments', 'tubularSegments'],
        defaultValues: { radius: 7, tube: 3.5, radialSegments: 100, tubularSegments: 100 }
    },
    cube: {
        geometry: (params) => new THREE.BoxGeometry(
            params.width || 9,
            params.height || 9,
            params.depth || 9
        ),
        parameters: ['width', 'height', 'depth'],
        defaultValues: { width: 9, height: 9, depth: 9 }
    },
    sphere: {
        geometry: (params) => new THREE.SphereGeometry(
            params.radius || 7,
            params.widthSegments || 50,
            params.heightSegments || 50
        ),
        parameters: ['radius', 'widthSegments', 'heightSegments'],
        defaultValues: { radius: 7, widthSegments: 50, heightSegments: 50 }
    },
    
    // Polyhedra
    dodecahedron: {
        geometry: (params) => new THREE.DodecahedronGeometry(params.radius || 7),
        parameters: ['radius'],
        defaultValues: { radius: 7 }
    },
    octahedron: {
        geometry: (params) => new THREE.OctahedronGeometry(params.radius || 7),
        parameters: ['radius'],
        defaultValues: { radius: 7 }
    },
    icosahedron: {
        geometry: (params) => new THREE.IcosahedronGeometry(params.radius || 7),
        parameters: ['radius'],
        defaultValues: { radius: 7 }
    },
    tetrahedron: {
        geometry: (params) => new THREE.TetrahedronGeometry(params.radius || 7),
        parameters: ['radius'],
        defaultValues: { radius: 7 }
    },

    // Cylindrical Shapes
    cylinder: {
        geometry: (params) => new THREE.CylinderGeometry(
            params.radiusTop || 7,
            params.radiusBottom || 7,
            params.height || 7,
            params.radialSegments || 32
        ),
        parameters: ['radiusTop', 'radiusBottom', 'height', 'radialSegments'],
        defaultValues: { radiusTop: 7, radiusBottom: 7, height: 7, radialSegments: 32 }
    },
    cone: {
        geometry: (params) => new THREE.ConeGeometry(
            params.radius || 7,
            params.height || 14,
            params.radialSegments || 100
        ),
        parameters: ['radius', 'height', 'radialSegments'],
        defaultValues: { radius: 7, height: 14, radialSegments: 100 }
    },

    // Advanced Shapes
    torusKnot: {
        geometry: (params) => new THREE.TorusKnotGeometry(
            params.radius || 6,
            params.tube || 2,
            params.radialSegments || 200,
            params.tubularSegments || 50
        ),
        parameters: ['radius', 'tube', 'radialSegments', 'tubularSegments'],
        defaultValues: { radius: 6, tube: 2, radialSegments: 200, tubularSegments: 50 }
    },
    pyramid: {
        geometry: (params) => {
            const geo = new THREE.ConeGeometry(
                params.radius || 7,
                params.height || 14,
                params.radialSegments || 4
            );
            geo.rotateX(Math.PI / 2);
            return geo;
        },
        parameters: ['radius', 'height', 'radialSegments'],
        defaultValues: { radius: 7, height: 14, radialSegments: 4 }
    },
    ring: {
        geometry: (params) => new THREE.RingGeometry(
            params.innerRadius || 5,
            params.outerRadius || 10,
            params.thetaSegments || 32
        ),
        parameters: ['innerRadius', 'outerRadius', 'thetaSegments'],
        defaultValues: { innerRadius: 5, outerRadius: 10, thetaSegments: 32 }
    },
    tube: {
        geometry: (params) => {
            const path = new THREE.CurvePath();
            path.add(new THREE.LineCurve3(
                new THREE.Vector3(-params.radius || -5, 0, 0),
                new THREE.Vector3(params.radius || 5, 0, 0)
            ));
            return new THREE.TubeGeometry(
                path,
                params.radialSegments || 8,
                params.radius || 5,
                params.tubularSegments || 64
            );
        },
        parameters: ['radius', 'radialSegments', 'tubularSegments'],
        defaultValues: { radius: 5, radialSegments: 8, tubularSegments: 64 }
    }
};

export { shapes };
