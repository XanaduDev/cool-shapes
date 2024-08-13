// styles.js
import * as THREE from './three.module.js';

export function createMesh(geometry, currentStyle, color) {
    let material;
    let mesh;

    switch (currentStyle) {
        case 'points':
            mesh = new THREE.Points(
                geometry,
                new THREE.PointsMaterial({ color, size: 0.5 })
            );
            break;

        case 'line':
            mesh = new THREE.LineSegments(
                new THREE.EdgesGeometry(geometry),
                new THREE.LineBasicMaterial({ color })
            );
            break;

        case 'basic':
            mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color })
            );
            break;

        case 'matcap':
            material = new THREE.MeshMatcapMaterial({
                matcap: new THREE.TextureLoader().load('photos/metcap.png')
            });
            material.color.set(color);
            mesh = new THREE.Mesh(geometry, material);
            break;

        case 'normal':
            mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshNormalMaterial()
            );
            break;

        case 'mirror':
            mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    color,
                    metalness: 1,
                    roughness: 0
                })
            );
            break;

        default:
            mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                    color,
                    metalness: 0.8,
                    roughness: 0.4,
                    wireframe: currentStyle === 'wireframe'
                })
            );
            mesh.castShadow = true;
            break;
    }

    return mesh;
}
