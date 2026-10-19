/**
 * NexusAI - Hyper-Realistic 3D WebGL Metaverse Corporate Headquarters & 3D AI Employee Engine
 * Featuring:
 * - Real 3D Workstations: Polished Wood Tops, Metal Frames, Glowing Dual Screens, Mechanical Keyboards, Lamps & Ergonomic Mesh Chairs
 * - Realistic 3D Human AI Characters: Modeled Heads, Styled Hair, Suits/Collared Shirts, Posable Arms, Idle Typing & Smooth Walking Animations
 * - Deluxe Corporate Architecture: Executive Glass Suites, Biophilic Plants, Espresso Lounge with Steam & Boardroom
 */

let scene, camera, renderer, controls;
let threeEmployees = [];
let isThreeInitialized = false;

// 3D Spatial Office Layout Coordinates
const THREE_CABINS = {
  owner_cabin: { name: "👑 Owner / CEO Suite", x: -26, z: -18, w: 14, d: 11, color: 0xfbbf24, label: "👑 OWNER / CEO SUITE", colorStr: "#fbbf24" },
  hm_cabin: { name: "🤖 Head Manager Suite", x: -10, z: -18, w: 14, d: 11, color: 0x6366f1, label: "🤖 HEAD MGR CABIN", colorStr: "#6366f1" },
  pm_cabin: { name: "💻 PM Executive Cabin", x: 8, z: -18, w: 14, d: 11, color: 0x06b6d4, label: "💻 PM CABIN", colorStr: "#06b6d4" },
  sales_cabin: { name: "💼 Sales Mgr Cabin", x: 26, z: -18, w: 14, d: 11, color: 0x10b981, label: "💼 SALES MGR CABIN", colorStr: "#10b981" },
  
  dev_bay: { name: "👨‍💻 Developer & QA Pods", x: -10, z: -2, w: 22, d: 14, color: 0x38bdf8, label: "💻 DEVELOPER BAY", colorStr: "#38bdf8" },
  mkt_bay: { name: "📢 Marketing & Design Studio", x: 18, z: -2, w: 22, d: 14, color: 0xa855f7, label: "📢 MARKETING BAY", colorStr: "#a855f7" },

  coffee_bar: { name: "☕ Espresso Coffee Lounge", x: -26, z: 16, w: 14, d: 13, color: 0xf59e0b, label: "☕ ESPRESSO COFFEE LOUNGE", colorStr: "#f59e0b" },
  conference_room: { name: "🤝 Main Conference Room", x: -4, z: 16, w: 22, d: 13, color: 0x818cf8, label: "🤝 CONFERENCE ROOM A", colorStr: "#818cf8" },
  print_room: { name: "🖨️ Print & Resource Room", x: 18, z: 16, w: 10, d: 13, color: 0x34d399, label: "🖨️ PRINT HUB", colorStr: "#34d399" },
  server_room: { name: "⚡ Lead Gen Server Room", x: 29, z: 16, w: 10, d: 13, color: 0xf43f5e, label: "⚡ SERVER ROOM", colorStr: "#f43f5e" }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initThreeOffice, 200);
});

function initThreeOffice() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || isThreeInitialized) return;

  // 1. Create 3D Scene & Perspective Camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060911);
  scene.fog = new THREE.FogExp2(0x060911, 0.008);

  const width = container.clientWidth || 960;
  const height = 550;
  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  camera.position.set(0, 52, 64);

  // 2. WebGL Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 3. OrbitControls (Full 360° Interaction)
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0, 2);
  }

  // 4. Lighting System
  setupLighting();

  // 5. Build Hyper-Realistic Office Architecture & Tables
  buildHyperRealisticOfficeFloor();

  // 6. Spawn Realistic 3D AI Employee Characters
  spawnDeluxeEmployees();

  // 7. Event Listeners & Loops
  window.addEventListener('resize', onThreeWindowResize);
  isThreeInitialized = true;

  animateThreeLoop();
  startThreeWalkingLoop();
}

function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(35, 60, 35);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Executive Warm Spotlights
  const ownerSpot = new THREE.SpotLight(0xfbbf24, 1.6, 30, Math.PI / 4, 0.4);
  ownerSpot.position.set(-26, 14, -18);
  scene.add(ownerSpot);

  const coffeeSpot = new THREE.SpotLight(0xf59e0b, 1.8, 25, Math.PI / 3, 0.5);
  coffeeSpot.position.set(-26, 12, 16);
  scene.add(coffeeSpot);

  const confSpot = new THREE.SpotLight(0x818cf8, 1.8, 32, Math.PI / 3, 0.5);
  confSpot.position.set(-4, 14, 16);
  scene.add(confSpot);

  // Server Room Neon Glow
  const serverSpot = new THREE.PointLight(0x06b6d4, 2.2, 16);
  serverSpot.position.set(29, 6, 16);
  scene.add(serverSpot);
}

function buildHyperRealisticOfficeFloor() {
  // Main Polished Hardwood Base Floor
  const floorGeo = new THREE.PlaneGeometry(84, 64);
  const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0x090d18, 
    roughness: 0.4, 
    metalness: 0.3 
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Glowing Cyan Grid Lines
  const grid = new THREE.GridHelper(84, 34, 0x6366f1, 0x1e293b);
  grid.position.y = 0.02;
  scene.add(grid);

  // Perimeter Outer Enclosure Walls with LED base strip
  buildOuterPerimeterWalls();

  // Build All Cabins & Glass Partitions
  for (const key in THREE_CABINS) {
    const c = THREE_CABINS[key];
    createDeluxeCabin(c);
  }

  // Developer Pod Desks (Bay 1 & Bay 2)
  buildDeveloperBayWorkstations();

  // Detailed Furniture & Facilities
  buildCoffeeBarDetails();
  buildConferenceRoomDetails();
  buildServerRoomDetails();
  buildPrinterHubDetails();
  addOfficePlantsAndDecor();
}

function buildOuterPerimeterWalls() {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });

  // Back Outer Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(84, 3.5, 0.4), wallMat);
  backWall.position.set(0, 1.75, -32);
  scene.add(backWall);

  const backLed = new THREE.Mesh(new THREE.BoxGeometry(84, 0.1, 0.2), ledMat);
  backLed.position.set(0, 0.05, -31.8);
  scene.add(backLed);

  // Left Outer Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 64), wallMat);
  leftWall.position.set(-42, 1.75, 0);
  scene.add(leftWall);

  // Right Outer Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.5, 64), wallMat);
  rightWall.position.set(42, 1.75, 0);
  scene.add(rightWall);
}

function createDeluxeCabin(c) {
  // Cabin Flooring Tile
  const tileGeo = new THREE.PlaneGeometry(c.w - 0.4, c.d - 0.4);
  const tileMat = new THREE.MeshStandardMaterial({ color: c.color, transparent: true, opacity: 0.14, roughness: 0.3 });
  const tile = new THREE.Mesh(tileGeo, tileMat);
  tile.rotation.x = -Math.PI / 2;
  tile.position.set(c.x, 0.04, c.z);
  scene.add(tile);

  // Glass Partition Walls
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: c.color,
    transmission: 0.8,
    opacity: 0.5,
    transparent: true,
    roughness: 0.1,
    ior: 1.5
  });

  const wallHeight = 2.6;

  // Back Glass Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(c.w, wallHeight, 0.2), glassMat);
  backWall.position.set(c.x, wallHeight / 2, c.z - c.d / 2);
  scene.add(backWall);

  // Left Glass Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, wallHeight, c.d), glassMat);
  leftWall.position.set(c.x - c.w / 2, wallHeight / 2, c.z);
  scene.add(leftWall);

  // Metallic Door Posts
  const doorPostMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallHeight, 0.3), doorPostMat);
  p1.position.set(c.x - 2.2, wallHeight / 2, c.z + c.d / 2);
  scene.add(p1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallHeight, 0.3), doorPostMat);
  p2.position.set(c.x + 2.2, wallHeight / 2, c.z + c.d / 2);
  scene.add(p2);

  // Floating 3D Signboard
  const signboard = create3DSignboardSprite(c.label, c.colorStr || "#6366f1");
  signboard.position.set(c.x, 4.4, c.z + c.d / 2);
  scene.add(signboard);

  // Hyper-Realistic Executive L-Shaped Desk Setup
  if (c.name.includes("Cabin") || c.name.includes("Suite")) {
    createRealistic3DExecutiveDesk(c.x, c.z, c.color);
  }
}

// Hyper-Realistic 3D Executive Desk with Real Wood, Aluminum Legs & Dual Monitors
function createRealistic3DExecutiveDesk(x, z, accentColor = 0x6366f1) {
  const deskGroup = new THREE.Group();

  // 1. Walnut Wood Table Top with Bevel
  const topMat = new THREE.MeshStandardMaterial({ 
    color: 0x3e2723, 
    roughness: 0.35, 
    metalness: 0.1 
  });
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.18, 2.2), topMat);
  deskTop.position.set(0, 1.3, -1);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  // L-Extension Return
  const sideTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 2.4), topMat);
  sideTop.position.set(-2.1, 1.25, -0.9);
  sideTop.castShadow = true;
  deskGroup.add(sideTop);

  // 2. Brushed Aluminum Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const legPositions = [
    { x: 1.9, z: -0.1 }, { x: 1.9, z: -1.9 },
    { x: -1.9, z: -0.1 }, { x: -2.7, z: -1.9 }, { x: -2.7, z: 0.1 }
  ];
  legPositions.forEach(lp => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.25, 8), legMat);
    leg.position.set(lp.x, 0.625, lp.z);
    leg.castShadow = true;
    deskGroup.add(leg);
  });

  // 3. Leather Desk Pad
  const padMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const pad = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 1.2), padMat);
  pad.position.set(0, 1.4, -0.9);
  deskGroup.add(pad);

  // 4. Dual Curved Glowing Monitors with Stands
  const standMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
  const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 0.6, 8), standMat);
  monStand.position.set(0, 1.65, -1.6);
  deskGroup.add(monStand);

  // Left & Right Screens
  const screenMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const screenMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
  
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.08), screenMat1);
  m1.position.set(-0.85, 2.1, -1.6);
  m1.rotation.y = 0.15;
  deskGroup.add(m1);

  const m2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.08), screenMat2);
  m2.position.set(0.85, 2.1, -1.6);
  m2.rotation.y = -0.15;
  deskGroup.add(m2);

  // 5. Mechanical Keyboard & Mouse
  const kb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x020617 }));
  kb.position.set(0, 1.42, -0.6);
  deskGroup.add(kb);

  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
  mouse.position.set(0.75, 1.42, -0.6);
  deskGroup.add(mouse);

  // 6. Ceramic Coffee Cup ☕
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  cup.position.set(-1.4, 1.5, -0.6);
  deskGroup.add(cup);

  // 7. Ergonomic Office Mesh Chair (Behind Desk)
  create3DErgonomicChair(deskGroup, 0, 0, 0.1, accentColor);

  deskGroup.position.set(x, 0, z);
  scene.add(deskGroup);
}

// Ergonomic 3D Office Mesh Chair with 5-Star Wheel Base
function create3DErgonomicChair(parentGroup, x, y, z, chairColor = 0x6366f1) {
  const chairGroup = new THREE.Group();

  // 5-Star Wheel Base
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
  const centerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), baseMat);
  centerPole.position.set(0, 0.35, 0);
  chairGroup.add(centerPole);

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.6), baseMat);
    leg.position.set(Math.cos(angle) * 0.3, 0.1, Math.sin(angle) * 0.3);
    leg.rotation.y = -angle;
    chairGroup.add(leg);
  }

  // Seat Cushion
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 1.1), seatMat);
  seat.position.set(0, 0.75, 0);
  chairGroup.add(seat);

  // Curved Mesh Backrest
  const backMat = new THREE.MeshStandardMaterial({ color: chairColor, roughness: 0.5 });
  const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.3, 0.12), backMat);
  backrest.position.set(0, 1.45, 0.5);
  backrest.rotation.x = -0.1;
  chairGroup.add(backrest);

  // Headrest
  const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.1), backMat);
  headrest.position.set(0, 2.2, 0.6);
  chairGroup.add(headrest);

  // Armrests
  const armMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.6), armMat);
  leftArm.position.set(-0.6, 1.05, 0.05);
  chairGroup.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.6), armMat);
  rightArm.position.set(0.6, 1.05, 0.05);
  chairGroup.add(rightArm);

  chairGroup.position.set(x, y, z);
  parentGroup.add(chairGroup);
}

// Developer Bay Workstations (Linear Pod Tables)
function buildDeveloperBayWorkstations() {
  const bay = THREE_CABINS.dev_bay;
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });

  // 4 Pod Workstation Tables
  for (let i = -6; i <= 6; i += 4) {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 1.8), tableMat);
    desk.position.set(bay.x + i, 1.25, bay.z);
    desk.castShadow = true;
    scene.add(desk);

    // Monitor
    const mon = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.06), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    mon.position.set(bay.x + i, 1.95, bay.z - 0.6);
    scene.add(mon);

    // Chair
    const chairGroup = new THREE.Group();
    create3DErgonomicChair(chairGroup, bay.x + i, 0, bay.z + 1.2, 0x38bdf8);
    scene.add(chairGroup);
  }
}

function create3DSignboardSprite(text, colorStr = "#6366f1", subText = "") {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = subText ? 84 : 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgba(7, 11, 20, 0.94)";
  ctx.strokeStyle = colorStr;
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(4, 4, 248, canvas.height - 8, 10);
  else ctx.rect(4, 4, 248, canvas.height - 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colorStr;
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, subText ? 24 : 32);

  if (subText) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(subText, 128, 56);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(6, subText ? 2.1 : 1.5, 1);
  return sprite;
}

function buildCoffeeBarDetails() {
  const z = THREE_CABINS.coffee_bar;

  // Marble Bar Counter
  const barMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.2 });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(8, 1.8, 2.4), barMat);
  bar.position.set(z.x, 0.9, z.z);
  scene.add(bar);

  // Espresso Coffee Machine
  const macMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
  const machine = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 1.5), macMat);
  machine.position.set(z.x - 2.2, 2.65, z.z);
  scene.add(machine);

  // Water Cooler Bottle 💧
  const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.6, 12);
  const bottleMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.8, transparent: true });
  const bottle = new THREE.Mesh(bottleGeo, bottleMat);
  bottle.position.set(z.x + 2.5, 2.6, z.z);
  scene.add(bottle);

  // Coffee Mugs
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  for (let i = 0; i < 4; i++) {
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8), mugMat);
    mug.position.set(z.x - 0.5 + i * 0.7, 1.9, z.z);
    scene.add(mug);
  }

  // 4 Bar Stools
  const stoolMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
  for (let i = -3; i <= 3; i += 2) {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12), stoolMat);
    stool.position.set(z.x + i, 0.7, z.z + 2.6);
    scene.add(stool);
  }
}

function buildConferenceRoomDetails() {
  const z = THREE_CABINS.conference_room;

  // Mahogany Oval Table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.35 });
  const table = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.3, 28), tableMat);
  table.position.set(z.x, 1.2, z.z);
  scene.add(table);

  // 8 Executive Chairs
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    const cg = new THREE.Group();
    create3DErgonomicChair(cg, z.x + Math.cos(a) * 4.6, 0, z.z + Math.sin(a) * 4.6, 0x818cf8);
    scene.add(cg);
  }

  // Large Wall Projector Screen
  const screen = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 0.1), new THREE.MeshBasicMaterial({ color: 0x818cf8 }));
  screen.position.set(z.x, 3.8, z.z - z.d / 2 + 0.2);
  scene.add(screen);
}

function buildServerRoomDetails() {
  const z = THREE_CABINS.server_room;
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95 });
  
  for (let i = -2.5; i <= 2.5; i += 5) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.8, 2.6), rackMat);
    rack.position.set(z.x + i, 2.4, z.z);
    scene.add(rack);

    const led = new THREE.PointLight(i > 0 ? 0x10b981 : 0x06b6d4, 1.6, 6);
    led.position.set(z.x + i, 3.8, z.z + 1.4);
    scene.add(led);
  }
}

function buildPrinterHubDetails() {
  const z = THREE_CABINS.print_room;
  const printer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.4), new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.3 }));
  printer.position.set(z.x, 1.1, z.z);
  scene.add(printer);
}

function addOfficePlantsAndDecor() {
  const plantLocations = [
    { x: -35, z: -25 },
    { x: 35, z: -25 },
    { x: -35, z: 25 },
    { x: 35, z: 25 },
    { x: 0, z: -25 },
    { x: -18, z: 8 }
  ];

  const potMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });

  plantLocations.forEach(p => {
    // Ceramic Pot
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1.6, 12), potMat);
    pot.position.set(p.x, 0.8, p.z);
    scene.add(pot);

    // Green Foliage Bush
    const bush = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), leafMat);
    bush.position.set(p.x, 2.2, p.z);
    scene.add(bush);
  });
}

// Spawn Realistic 3D Human Employees
function spawnDeluxeEmployees() {
  threeEmployees = [];
  let idx = 0;

  for (const key in AGENT_HIERARCHY) {
    const emp = AGENT_HIERARCHY[key];
    if (key === 'owner') continue;

    let homeX = 0, homeZ = 0;

    if (emp.role === 'head_manager') {
      homeX = THREE_CABINS.hm_cabin.x;
      homeZ = THREE_CABINS.hm_cabin.z + 1;
    } else if (emp.key === 'pm_manager' || key === 'pm_manager') {
      homeX = THREE_CABINS.pm_cabin.x;
      homeZ = THREE_CABINS.pm_cabin.z + 1;
    } else if (emp.key === 'sales_manager' || key === 'sales_manager') {
      homeX = THREE_CABINS.sales_cabin.x;
      homeZ = THREE_CABINS.sales_cabin.z + 1;
    } else if (emp.dept === 'Project Bay') {
      homeX = THREE_CABINS.dev_bay.x - 6 + (idx % 4) * 4;
      homeZ = THREE_CABINS.dev_bay.z + 0.8;
    } else if (emp.dept === 'Marketing Studio') {
      homeX = THREE_CABINS.mkt_bay.x - 6 + (idx % 4) * 4;
      homeZ = THREE_CABINS.mkt_bay.z + 0.8;
    } else {
      homeX = THREE_CABINS.dev_bay.x - 4 + (idx % 3) * 4;
      homeZ = THREE_CABINS.dev_bay.z + 3;
    }

    const avatarGroup = new THREE.Group();

    // 1. Realistic Human Torso & Suit Jacket / Shirt
    const suitMat = new THREE.MeshStandardMaterial({ color: emp.color || 0x6366f1, roughness: 0.5 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.4, 0.5), suitMat);
    torso.position.y = 1.7;
    avatarGroup.add(torso);

    // Collar / Tie
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    collar.position.set(0, 2.2, 0.26);
    avatarGroup.add(collar);

    // 2. Realistic Head & Skin Tone
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf6d5b8, roughness: 0.6 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), headMat);
    head.position.y = 2.75;
    avatarGroup.add(head);

    // Hair Mesh
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.8 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), hairMat);
    hair.position.set(0, 2.85, -0.05);
    avatarGroup.add(hair);

    // 3. Arms & Hands
    const armMat = suitMat;
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8), armMat);
    leftArm.position.set(-0.55, 1.6, 0);
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8), armMat);
    rightArm.position.set(0.55, 1.6, 0);
    avatarGroup.add(rightArm);

    // 4. Legs & Shoes
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.0, 8), legMat);
    leftLeg.position.set(-0.25, 0.5, 0);
    avatarGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.0, 8), legMat);
    rightLeg.position.set(0.25, 0.5, 0);
    avatarGroup.add(rightLeg);

    // 5. Feet Status Ring
    const ringGeo = new THREE.RingGeometry(0.7, 1.0, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: emp.color || 0x6366f1, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    avatarGroup.add(ring);

    // 6. Floating 3D Role Badge
    const roleBadge = create3DSignboardSprite(
      `${emp.avatar} ${emp.name.split(' ')[0]}`,
      emp.color || "#38bdf8",
      emp.title.split(' ')[0] + " " + (emp.title.split(' ')[1] || "")
    );
    roleBadge.position.set(0, 4.2, 0);
    avatarGroup.add(roleBadge);

    avatarGroup.position.set(homeX, 0, homeZ);
    scene.add(avatarGroup);

    threeEmployees.push({
      key: key,
      name: emp.name,
      title: emp.title,
      avatar: emp.avatar,
      mesh: avatarGroup,
      leftArm: leftArm,
      rightArm: rightArm,
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      homeX: homeX,
      homeZ: homeZ,
      x: homeX,
      z: homeZ,
      pathWaypoints: [],
      currentPathIdx: 0,
      state: "WORKING",
      speed: 0.16 + Math.random() * 0.04
    });

    idx++;
  }
}

// ─── 3D Smart Corridor Pathfinding (No Walking Through Tables/Walls) ─────────

function build3DOfficePath(fromX, fromZ, destZoneKey) {
  const cabin = THREE_CABINS[destZoneKey];
  if (!cabin) return [{ x: fromX, z: fromZ }];

  const waypoints = [];
  const MAIN_CORRIDOR_Z = 7; // Central corridor hallway between north cabins and south facilities

  // 1. Step out from desk chair into the room aisle
  waypoints.push({ x: fromX, z: fromZ + 2.5 });

  // 2. Step into the Main Corridor Spine
  waypoints.push({ x: fromX, z: MAIN_CORRIDOR_Z });

  // 3. Walk along the Main Corridor to the target room's door X position
  waypoints.push({ x: cabin.x, z: MAIN_CORRIDOR_Z });

  // 4. Enter through the room's doorway
  if (destZoneKey.includes('cabin') || destZoneKey === 'owner_cabin' || destZoneKey === 'hm_cabin' || destZoneKey === 'pm_cabin' || destZoneKey === 'sales_cabin') {
    // North cabins door is at z + d/2
    const doorZ = cabin.z + cabin.d / 2;
    waypoints.push({ x: cabin.x, z: doorZ });
    // Visitor standing spot in front of executive desk
    waypoints.push({ x: cabin.x + 1.2, z: cabin.z + 1.8 });
  } else if (destZoneKey === 'coffee_bar') {
    // Stand in front of coffee bar counter
    waypoints.push({ x: cabin.x, z: cabin.z - 3.5 });
  } else if (destZoneKey === 'conference_room') {
    // Walk to conference room chair
    waypoints.push({ x: cabin.x, z: cabin.z - 3.5 });
    waypoints.push({ x: cabin.x + (Math.random() > 0.5 ? 3.5 : -3.5), z: cabin.z + 2.5 });
  } else if (destZoneKey === 'print_room') {
    waypoints.push({ x: cabin.x, z: cabin.z - 3.5 });
  } else {
    waypoints.push({ x: cabin.x, z: cabin.z });
  }

  return waypoints;
}

function build3DReturnPath(fromX, fromZ, homeX, homeZ) {
  const waypoints = [];
  const MAIN_CORRIDOR_Z = 7;

  // Step out to corridor
  waypoints.push({ x: fromX, z: MAIN_CORRIDOR_Z });
  // Walk along corridor to home column
  waypoints.push({ x: homeX, z: MAIN_CORRIDOR_Z });
  // Enter back into chair
  waypoints.push({ x: homeX, z: homeZ + 2.0 });
  waypoints.push({ x: homeX, z: homeZ });

  return waypoints;
}

function move3DEmployeeToZone(agentKey, cabinKey, stateName = "WALKING") {
  const emp = threeEmployees.find(e => e.key === agentKey);
  const cabin = THREE_CABINS[cabinKey];
  if (!emp || !cabin) return;

  const path = build3DOfficePath(emp.x, emp.z, cabinKey);
  emp.pathWaypoints = path;
  emp.currentPathIdx = 0;
  emp.state = stateName;
}

function move3DEmployeeToDesk(agentKey) {
  const emp = threeEmployees.find(e => e.key === agentKey);
  if (!emp) return;

  const path = build3DReturnPath(emp.x, emp.z, emp.homeX, emp.homeZ);
  emp.pathWaypoints = path;
  emp.currentPathIdx = 0;
  emp.state = "WALKING";
}

function startThreeWalkingLoop() {
  setInterval(() => {
    if (isAiPaused || !threeEmployees.length) return;

    const freeEmp = threeEmployees.filter(e => e.x === e.homeX && e.z === e.homeZ && e.pathWaypoints.length === 0);
    if (!freeEmp.length) return;

    const count = Math.min(2, freeEmp.length);
    for (let i = 0; i < count; i++) {
      const emp = freeEmp[Math.floor(Math.random() * freeEmp.length)];
      if (!emp) continue;

      const destinations = ['coffee_bar', 'conference_room', 'print_room', 'hm_cabin', 'pm_cabin'];
      const dest = destinations[Math.floor(Math.random() * destinations.length)];
      
      move3DEmployeeToZone(emp.key, dest, "WALKING");

      setTimeout(() => {
        move3DEmployeeToDesk(emp.key);
      }, 5500 + Math.random() * 3000);
    }
  }, 4500);
}

function animateThreeLoop() {
  requestAnimationFrame(animateThreeLoop);

  if (controls) controls.update();

  if (!isAiPaused) {
    const time = Date.now() * 0.009;

    threeEmployees.forEach(emp => {
      // If employee is following safe corridor waypoints
      if (emp.pathWaypoints && emp.pathWaypoints.length > 0) {
        const currentTarget = emp.pathWaypoints[emp.currentPathIdx];
        if (!currentTarget) {
          emp.pathWaypoints = [];
          emp.currentPathIdx = 0;
          return;
        }

        const dx = currentTarget.x - emp.x;
        const dz = currentTarget.z - emp.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.3) {
          emp.x += (dx / dist) * emp.speed;
          emp.z += (dz / dist) * emp.speed;
          emp.mesh.position.set(emp.x, 0, emp.z);

          // Walking animation & realistic human stride
          emp.mesh.position.y = Math.abs(Math.sin(time * 4)) * 0.22;
          emp.mesh.rotation.y = Math.atan2(dx, dz);

          if (emp.leftArm && emp.rightArm) {
            emp.leftArm.rotation.x = Math.sin(time * 5) * 0.5;
            emp.rightArm.rotation.x = -Math.sin(time * 5) * 0.5;
          }
        } else {
          emp.x = currentTarget.x;
          emp.z = currentTarget.z;
          emp.currentPathIdx++;

          if (emp.currentPathIdx >= emp.pathWaypoints.length) {
            emp.pathWaypoints = [];
            emp.currentPathIdx = 0;
            emp.mesh.position.set(emp.x, 0, emp.z);
            emp.mesh.position.y = 0;

            if (emp.x === emp.homeX && emp.z === emp.homeZ) {
              emp.state = "WORKING";
              emp.mesh.rotation.y = 0;
            }
          }
        }
      } else {
        // Idle typing hands at workstation
        if (emp.x === emp.homeX && emp.z === emp.homeZ && emp.leftArm && emp.rightArm) {
          emp.leftArm.rotation.x = -0.7 + Math.sin(time * 2) * 0.05;
          emp.rightArm.rotation.x = -0.7 - Math.sin(time * 2) * 0.05;
        }
      }
    });
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onThreeWindowResize() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || !renderer || !camera) return;

  camera.aspect = container.clientWidth / 550;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, 550);
}
