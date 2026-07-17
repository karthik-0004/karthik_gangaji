import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

console.log('Starting Selection 3 - NASA-Core Tech rocket GLTF generator...');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Polyfill FileReader for Node.js environment (required by GLTFExporter)
global.FileReader = class FileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.onloadend = null;
    this.result = null;
  }

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      setImmediate(() => {
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }).catch((err) => {
      console.error('FileReader error:', err);
      if (this.onerror) this.onerror(err);
      setImmediate(() => {
        if (this.onloadend) this.onloadend({ target: this });
      });
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      const base64 = Buffer.from(buf).toString('base64');
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
      setImmediate(() => {
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }).catch((err) => {
      console.error('FileReader error:', err);
      if (this.onerror) this.onerror(err);
      setImmediate(() => {
        if (this.onloadend) this.onloadend({ target: this });
      });
    });
  }
};

const rocketGroup = new THREE.Group();
rocketGroup.name = 'Rocket';

// Material Definitions
const whiteCeramicMat = new THREE.MeshStandardMaterial({
  color: 0xeeeeee,
  metalness: 0.1,
  roughness: 0.5,
  name: 'WhiteCeramic'
});

const darkDecalMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.2,
  roughness: 0.6,
  name: 'DarkDecal'
});

const solarPanelMat = new THREE.MeshStandardMaterial({
  color: 0x15283c,
  emissive: 0x050e18,
  metalness: 0.9,
  roughness: 0.15,
  name: 'SolarPanel'
});

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 0.95,
  roughness: 0.08,
  name: 'Chrome'
});

const glassWindowMat = new THREE.MeshStandardMaterial({
  color: 0x88ccff,
  emissive: 0x88ccff,
  emissiveIntensity: 1.5,
  metalness: 0.1,
  roughness: 0.02,
  name: 'GlassWindow'
});

const nozzleMat = new THREE.MeshStandardMaterial({
  color: 0x3a3a3a,
  metalness: 0.8,
  roughness: 0.4,
  name: 'Nozzle'
});

// --- 1. SLEEK CYLINDRICAL MAIN BODY (White Ceramic) ---
const bodyRadius = 0.38;
const bodyHeight = 2.3;
const bodyGeom = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32);
// Translate geometry up so base is at y = 0
bodyGeom.translate(0, bodyHeight / 2, 0);
const bodyMesh = new THREE.Mesh(bodyGeom, whiteCeramicMat);
bodyMesh.name = 'Body';
bodyMesh.castShadow = true;
bodyMesh.receiveShadow = true;
rocketGroup.add(bodyMesh);

// --- 2. STRUCTURAL DARK DECALS (Black Joint Rings) ---
// Lower joint ring
const lowerRingGeom = new THREE.CylinderGeometry(bodyRadius + 0.005, bodyRadius + 0.005, 0.06, 32);
const lowerRingMesh = new THREE.Mesh(lowerRingGeom, darkDecalMat);
lowerRingMesh.position.y = 0.6;
rocketGroup.add(lowerRingMesh);

// Upper joint ring
const upperRingGeom = new THREE.CylinderGeometry(bodyRadius + 0.005, bodyRadius + 0.005, 0.06, 32);
const upperRingMesh = new THREE.Mesh(upperRingGeom, darkDecalMat);
upperRingMesh.position.y = 1.7;
rocketGroup.add(upperRingMesh);

// Vertical racing stripe decal
const stripeGeom = new THREE.BoxGeometry(0.06, bodyHeight - 0.2, 0.01);
const stripeMesh = new THREE.Mesh(stripeGeom, darkDecalMat);
stripeMesh.position.set(0, bodyHeight / 2, bodyRadius + 0.002);
rocketGroup.add(stripeMesh);

// --- 3. DUAL INTEGRATED SOLAR ARRAYS ---
// Left solar array
const leftSolarGeom = new THREE.BoxGeometry(0.02, 1.0, 0.18);
const leftSolarMesh = new THREE.Mesh(leftSolarGeom, solarPanelMat);
leftSolarMesh.position.set(bodyRadius + 0.006, 1.15, 0);
rocketGroup.add(leftSolarMesh);

// Right solar array
const rightSolarGeom = new THREE.BoxGeometry(0.02, 1.0, 0.18);
const rightSolarMesh = new THREE.Mesh(rightSolarGeom, solarPanelMat);
rightSolarMesh.position.set(-(bodyRadius + 0.006), 1.15, 0);
rocketGroup.add(rightSolarMesh);

// --- 4. TWO-TONE AERODYNAMIC NOSE CONE (y: 2.3 to 3.25, eggshell curve) ---
const noseHeight = 0.95;
// White nose base (t: 0 to 0.6, y: 2.3 to 2.87)
const noseBasePoints = [];
for (let i = 0; i <= 15; i++) {
  const t = (i / 15) * 0.6;
  const y = bodyHeight + t * noseHeight;
  const radius = bodyRadius * Math.cos(t * Math.PI / 2);
  noseBasePoints.push(new THREE.Vector2(radius, y));
}
const noseBaseGeom = new THREE.LatheGeometry(noseBasePoints, 32);
const noseBaseMesh = new THREE.Mesh(noseBaseGeom, whiteCeramicMat);
noseBaseMesh.name = 'NoseBase';
noseBaseMesh.castShadow = true;
rocketGroup.add(noseBaseMesh);

// Black nose cap (t: 0.6 to 1.0, y: 2.87 to 3.25)
const noseCapPoints = [];
for (let i = 0; i <= 15; i++) {
  const t = 0.6 + (i / 15) * 0.4;
  const y = bodyHeight + t * noseHeight;
  const radius = bodyRadius * Math.cos(t * Math.PI / 2);
  noseCapPoints.push(new THREE.Vector2(radius, y));
}
const noseCapGeom = new THREE.LatheGeometry(noseCapPoints, 32);
const noseCapMesh = new THREE.Mesh(noseCapGeom, darkDecalMat);
noseCapMesh.name = 'NoseCap';
noseCapMesh.castShadow = true;
rocketGroup.add(noseCapMesh);

// --- 5. DETAILED NOZZLE CLUSTER (4 individual nozzles) ---
const nozzleGeom = new THREE.CylinderGeometry(0.07, 0.11, 0.3, 16);
nozzleGeom.translate(0, -0.15, 0);

const offsets = [
  { x: 0.11, z: 0.11 },
  { x: -0.11, z: 0.11 },
  { x: 0.11, z: -0.11 },
  { x: -0.11, z: -0.11 }
];

offsets.forEach((offset, idx) => {
  const nMesh = new THREE.Mesh(nozzleGeom, nozzleMat);
  nMesh.name = `Nozzle_${idx}`;
  nMesh.position.set(offset.x, 0, offset.z);
  nMesh.castShadow = true;
  rocketGroup.add(nMesh);
});

// A base plate for the cluster
const plateGeom = new THREE.CylinderGeometry(bodyRadius - 0.02, bodyRadius - 0.02, 0.04, 32);
plateGeom.translate(0, -0.02, 0);
const plateMesh = new THREE.Mesh(plateGeom, darkDecalMat);
rocketGroup.add(plateMesh);

// --- 6. MODERN COCKPIT WINDOW (NASA visor style) ---
const frameGeom = new THREE.TorusGeometry(0.14, 0.025, 16, 64);
const frameMesh = new THREE.Mesh(frameGeom, chromeMat);
frameMesh.position.set(0, 1.45, bodyRadius + 0.005);
rocketGroup.add(frameMesh);

const glassGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 32);
glassGeom.rotateX(Math.PI / 2);
const glassMesh = new THREE.Mesh(glassGeom, glassWindowMat);
glassMesh.position.set(0, 1.45, bodyRadius);
rocketGroup.add(glassMesh);

// --- 7. FOUR MODERN STABILIZER FINS (Trapezoidal wings, 90-degree spacing) ---
const finShape = new THREE.Shape();
finShape.moveTo(bodyRadius, 0.45); // top attachment
finShape.lineTo(bodyRadius, 0.05); // bottom attachment
finShape.lineTo(bodyRadius + 0.38, -0.05); // wingtip lower
finShape.lineTo(bodyRadius + 0.22, 0.28); // wingtip upper
finShape.lineTo(bodyRadius, 0.45);

const extrudeSettings = {
  depth: 0.03,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 1,
  bevelSize: 0.008,
  bevelThickness: 0.008
};

const finGeom = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
finGeom.center();

for (let i = 0; i < 4; i++) {
  const angle = (i * Math.PI) / 2;
  const finMesh = new THREE.Mesh(finGeom, darkDecalMat);
  finMesh.name = `Fin_${i}`;
  finMesh.rotation.y = -angle;
  finMesh.castShadow = true;
  rocketGroup.add(finMesh);
}

// Center the entire rocket model relative to its height
rocketGroup.position.y = -1.3;

const scene = new THREE.Scene();
scene.add(rocketGroup);

// Export GLTF
function runExport() {
  return new Promise((resolve, reject) => {
    console.log('Calling GLTFExporter.parse...');
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        try {
          console.log('Parse complete! Writing file...');
          const outputDir = path.resolve('public');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          const outputPath = path.join(outputDir, 'rocket.gltf');
          fs.writeFileSync(outputPath, JSON.stringify(gltf, null, 2));
          console.log(`Successfully exported Selection 3 - NASA-Core Tech rocket GLTF to: ${outputPath}`);
          resolve();
        } catch (err) {
          console.error('Error writing file:', err);
          reject(err);
        }
      },
      (error) => {
        console.error('Error during GLTF export:', error);
        reject(error);
      },
      { binary: false }
    );
  });
}

runExport()
  .then(() => console.log('Generator finished successfully.'))
  .catch((err) => {
    console.error('Generator failed:', err);
    process.exit(1);
  });
