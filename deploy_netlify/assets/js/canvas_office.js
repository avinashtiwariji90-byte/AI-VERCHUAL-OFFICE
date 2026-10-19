/**
 * NexusAI - Hyper-Realistic 2D Spatial Office Canvas & Corridor Pathfinding Navigation Engine
 * Features:
 * - Smart NavMesh Waypoint Pathfinding: Employees NEVER walk through tables, walls, or furniture!
 * - Realistic Office Corridors: Clear Hallways, Designated Doorways & Room Entry Portals
 * - Distinct Room Visitor Spots: Sits at conference chairs, stands at espresso counter, stands at print hub
 * - Hyper-Realistic Desks: Walnut/Oak tops, Dual Glowing Monitors, Keyboards, Mice, Lamps, Coffee Mugs & Mesh Chairs
 * - Realistic Human Characters: Modeled Hair, Attire, Live Typing Hands & Natural Walking Gait
 */

let canvas, ctx;
let isAiPaused = false;
let autoWalkingInterval = null;

// ─── Luxury Office Architecture Zones & Boundaries ────────────────────────────

const OFFICE_ZONES = {
  executive: { 
    id: "executive",
    name: "👑 Executive & CEO Suite", 
    x: 35, y: 35, w: 270, h: 160, 
    floorType: "walnut", 
    borderColor: "#fbbf24", 
    glowColor: "rgba(251, 191, 36, 0.18)",
    door: { x: 290, y: 150 }, // Doorway on right glass wall
    visitorSpots: [{ x: 240, y: 135 }, { x: 240, y: 105 }],
    icon: "👑" 
  },
  project_bay: { 
    id: "project_bay",
    name: "💻 Engineering & QA Pods", 
    x: 325, y: 35, w: 320, h: 220, 
    floorType: "slate", 
    borderColor: "#06b6d4", 
    glowColor: "rgba(6, 182, 212, 0.15)",
    door: { x: 485, y: 245 }, // Main South Aisle Doorway
    visitorSpots: [{ x: 485, y: 160 }, { x: 485, y: 100 }],
    icon: "💻" 
  },
  sales_hub: { 
    id: "sales_hub",
    name: "💼 Enterprise Sales Hub", 
    x: 665, y: 35, w: 260, h: 180, 
    floorType: "oak", 
    borderColor: "#10b981", 
    glowColor: "rgba(16, 185, 129, 0.15)",
    door: { x: 675, y: 160 }, // Doorway on left glass wall
    visitorSpots: [{ x: 730, y: 160 }, { x: 840, y: 160 }],
    icon: "💼" 
  },
  marketing_studio: { 
    id: "marketing_studio",
    name: "📢 Growth & Creative Studio", 
    x: 665, y: 235, w: 260, h: 180, 
    floorType: "oak", 
    borderColor: "#a855f7", 
    glowColor: "rgba(168, 85, 247, 0.15)",
    door: { x: 675, y: 310 }, // Doorway on left glass wall
    visitorSpots: [{ x: 730, y: 310 }, { x: 840, y: 310 }],
    icon: "📢" 
  },
  lead_gen_hub: { 
    id: "lead_gen_hub",
    name: "⚡ AI Lead Gen Server Hub", 
    x: 35, y: 215, w: 270, h: 170, 
    floorType: "server", 
    borderColor: "#f59e0b", 
    glowColor: "rgba(245, 158, 11, 0.15)",
    door: { x: 290, y: 290 }, // Doorway on right glass wall
    visitorSpots: [{ x: 230, y: 340 }, { x: 130, y: 340 }],
    icon: "⚡" 
  },
  
  // Facilities
  coffee_lounge: { 
    id: "coffee_lounge",
    name: "☕ Smart Espresso Bar & Lounge", 
    x: 35, y: 405, w: 270, h: 145, 
    floorType: "marble", 
    borderColor: "#fbbf24", 
    glowColor: "rgba(245, 158, 11, 0.2)",
    door: { x: 290, y: 460 }, // Doorway on right
    visitorSpots: [{ x: 160, y: 495 }, { x: 210, y: 495 }, { x: 110, y: 495 }], // Stools/standing in front of bar counter
    icon: "☕" 
  },
  conference_room: { 
    id: "conference_room",
    name: "🤝 Executive Boardroom A", 
    x: 325, y: 275, w: 320, h: 175, 
    floorType: "carpet", 
    borderColor: "#818cf8", 
    glowColor: "rgba(129, 140, 248, 0.2)",
    door: { x: 485, y: 285 }, // North Doorway
    // Specific Boardroom Chair Spots around table (never ON the table!)
    visitorSpots: [
      { x: 430, y: 310 }, { x: 485, y: 310 }, { x: 540, y: 310 },
      { x: 430, y: 415 }, { x: 485, y: 415 }, { x: 540, y: 415 },
      { x: 375, y: 362 }, { x: 595, y: 362 }
    ],
    icon: "🤝" 
  },
  print_room: { 
    id: "print_room",
    name: "🖨️ Tech Resource & Print Center", 
    x: 325, y: 470, w: 320, h: 80, 
    floorType: "slate", 
    borderColor: "#38bdf8", 
    glowColor: "rgba(56, 189, 248, 0.15)",
    door: { x: 485, y: 480 }, // North Doorway
    visitorSpots: [{ x: 440, y: 515 }, { x: 530, y: 515 }],
    icon: "🖨️" 
  },
  reception: { 
    id: "reception",
    name: "🛎️ Modern Reception Lounge", 
    x: 665, y: 435, w: 260, h: 115, 
    floorType: "marble", 
    borderColor: "#94a3b8", 
    glowColor: "rgba(148, 163, 184, 0.12)",
    door: { x: 675, y: 480 }, // Left Doorway
    visitorSpots: [{ x: 740, y: 495 }, { x: 820, y: 495 }],
    icon: "🛎️" 
  }
};

// ─── Main Office Corridors & Walkway Highway Graph ────────────────────────────
// Corridors define open walkways between all rooms where employees freely walk.

const CORRIDORS = {
  // Main Central North-South Spine Hallway (Between West Cabins and Center Pods)
  WEST_SPINE: 310,
  // Main Central North-South Spine Hallway (Between Center Pods and East Hubs)
  EAST_SPINE: 652,
  // North Horizontal Hallway
  NORTH_HALL: 260,
  // South Horizontal Hallway
  SOUTH_HALL: 460
};

let canvasEmployees = [];

document.addEventListener('DOMContentLoaded', () => {
  initOfficeCanvas();
});

function initOfficeCanvas() {
  canvas = document.getElementById('officeCanvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  setupCanvasEmployees();
  startContinuousWalkingEngine();
  requestAnimationFrame(renderCanvasLoop);
}

function resizeCanvas() {
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = Math.max(parent.clientWidth, 960);
    canvas.height = 570;
  }
}

// ─── Setup Employees with Workstation Desks & Profiles ────────────────────────

function setupCanvasEmployees() {
  canvasEmployees = [];
  
  let projectIdx = 0, salesIdx = 0, mktIdx = 0, leadIdx = 0;

  for (const key in AGENT_HIERARCHY) {
    const emp = AGENT_HIERARCHY[key];
    if (key === 'owner') continue;

    let targetX = 120, targetY = 100;
    let deskType = "standard";

    if (emp.role === 'head_manager') {
      targetX = OFFICE_ZONES.executive.x + 130;
      targetY = OFFICE_ZONES.executive.y + 80;
      deskType = "executive_l";
    } else if (emp.dept === 'Project Bay') {
      // 2 Columns of pods with central aisle at x = 485
      const col = projectIdx % 2;
      const row = Math.floor(projectIdx / 2);
      targetX = col === 0 ? OFFICE_ZONES.project_bay.x + 65 : OFFICE_ZONES.project_bay.x + 250;
      targetY = OFFICE_ZONES.project_bay.y + 65 + row * 60;
      deskType = (emp.id === 'agent-dev1' || emp.id === 'agent-pm') ? "dual_screen" : "dev_station";
      projectIdx++;
    } else if (emp.dept === 'Sales Hub') {
      targetX = OFFICE_ZONES.sales_hub.x + 65 + (salesIdx % 2) * 130;
      targetY = OFFICE_ZONES.sales_hub.y + 70 + Math.floor(salesIdx / 2) * 75;
      deskType = "sales_station";
      salesIdx++;
    } else if (emp.dept === 'Marketing Studio') {
      targetX = OFFICE_ZONES.marketing_studio.x + 65 + (mktIdx % 2) * 130;
      targetY = OFFICE_ZONES.marketing_studio.y + 70 + Math.floor(mktIdx / 2) * 75;
      deskType = "creative_station";
      mktIdx++;
    } else if (emp.role === 'lead_gen') {
      targetX = OFFICE_ZONES.lead_gen_hub.x + 60 + (leadIdx % 2) * 115;
      targetY = OFFICE_ZONES.lead_gen_hub.y + 60 + Math.floor(leadIdx / 2) * 65;
      deskType = "server_terminal";
      leadIdx++;
    }

    const isFemale = (emp.gender === 'female') || (emp.name && (emp.name.includes('Aura') || emp.name.includes('Priya') || emp.name.includes('Neha') || emp.name.includes('Kavya') || emp.name.includes('Sneha') || emp.name.includes('Ananya')));
    const skinTones = ['#f7d5b8', '#e8b896', '#d69e76', '#c6865c'];
    const hairColors = ['#1a110b', '#2b1d14', '#4a2c11', '#1f2421'];
    
    const charProfile = {
      isFemale: isFemale,
      skinTone: skinTones[Math.abs(hashString(emp.name)) % skinTones.length],
      hairColor: hairColors[Math.abs(hashString(emp.id)) % hairColors.length],
      hairStyle: isFemale ? (Math.abs(hashString(emp.id)) % 2 === 0 ? 'bob' : 'long_tied') : 'short_fade',
      clothingColor: emp.color || '#6366f1',
      suitColor: emp.role === 'head_manager' ? '#1e1b4b' : (emp.role === 'manager' ? '#0f172a' : '#1e293b'),
      tieColor: '#38bdf8',
      glasses: (emp.id === 'agent-dev1' || emp.id === 'agent-qa' || emp.id === 'agent-pm')
    };

    canvasEmployees.push({
      id: emp.id,
      key: key,
      name: emp.name,
      title: emp.title || "AI Employee",
      avatar: emp.avatar,
      color: emp.color || '#6366f1',
      deskX: targetX,
      deskY: targetY,
      deskType: deskType,
      x: targetX,
      y: targetY,
      pathWaypoints: [], // Queue of coordinates to walk through
      currentPathIdx: 0,
      state: "WORKING",
      speed: 2.2 + Math.random() * 0.5,
      trail: [],
      walkingText: "",
      profile: charProfile,
      typingOffset: Math.random() * Math.PI * 2
    });
  }
}

function hashString(str) {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// ─── Smart Corridor Pathfinding Engine (Walkway Navigation) ───────────────────

/**
 * Calculates a safe walking path along office corridors, doorways, and aisles.
 * Guarantees that the employee NEVER walks over tables or through solid walls!
 */
function buildOfficePath(fromX, fromY, toX, toY, fromZoneId = null, toZoneId = null) {
  const waypoints = [];

  // 1. Step out from chair into nearest open aisle
  let currentX = fromX;
  let currentY = fromY;

  // If starting inside a room/desk, step down to open aisle space
  if (fromY < 200 && fromX < 310) {
    // Inside Executive Suite -> Exit to its doorway at (290, 150)
    waypoints.push({ x: 240, y: 150 });
    waypoints.push({ x: 290, y: 150 }); // Executive Door
    currentX = 310;
    currentY = 150;
    waypoints.push({ x: currentX, y: currentY }); // Step into West Corridor
  } else if (fromY >= 200 && fromY < 380 && fromX < 310) {
    // Inside Lead Gen Hub -> Exit to doorway at (290, 290)
    waypoints.push({ x: 240, y: 290 });
    waypoints.push({ x: 290, y: 290 }); // Door
    currentX = 310;
    currentY = 290;
    waypoints.push({ x: currentX, y: currentY });
  } else if (fromY >= 380 && fromX < 310) {
    // Inside Coffee Lounge -> Exit to doorway at (290, 460)
    waypoints.push({ x: 240, y: 460 });
    waypoints.push({ x: 290, y: 460 });
    currentX = 310;
    currentY = 460;
    waypoints.push({ x: currentX, y: currentY });
  } else if (fromX >= 325 && fromX <= 645 && fromY <= 245) {
    // Inside Project Bay -> Walk to center bay aisle at x = 485, then exit south doorway
    waypoints.push({ x: 485, y: fromY });
    waypoints.push({ x: 485, y: 260 }); // Step into North Corridor
    currentX = 485;
    currentY = 260;
  } else if (fromX >= 325 && fromX <= 645 && fromY > 245 && fromY <= 450) {
    // Inside Boardroom -> Exit North door
    waypoints.push({ x: 485, y: 285 });
    waypoints.push({ x: 485, y: 260 });
    currentX = 485;
    currentY = 260;
  } else if (fromX >= 325 && fromX <= 645 && fromY > 450) {
    // Inside Print Room -> Exit North door
    waypoints.push({ x: 485, y: 480 });
    waypoints.push({ x: 485, y: 460 });
    currentX = 485;
    currentY = 460;
  } else if (fromX > 645 && fromY < 235) {
    // Inside Sales Hub -> Exit West door at (675, 160)
    waypoints.push({ x: 675, y: 160 });
    currentX = 652;
    currentY = 160;
    waypoints.push({ x: currentX, y: currentY });
  } else if (fromX > 645 && fromY >= 235 && fromY < 420) {
    // Inside Marketing Studio -> Exit West door at (675, 310)
    waypoints.push({ x: 675, y: 310 });
    currentX = 652;
    currentY = 310;
    waypoints.push({ x: currentX, y: currentY });
  } else if (fromX > 645 && fromY >= 420) {
    // Inside Reception -> Exit West door at (675, 480)
    waypoints.push({ x: 675, y: 480 });
    currentX = 652;
    currentY = 480;
    waypoints.push({ x: currentX, y: currentY });
  }

  // 2. Navigate along Main Hallways (Spine / Cross Corridors) to the destination doorway
  let destDoorX = toX;
  let destDoorY = toY;
  let finalInsideX = toX;
  let finalInsideY = toY;

  // Determine target zone doorway
  for (const zk in OFFICE_ZONES) {
    const z = OFFICE_ZONES[zk];
    if (toX >= z.x && toX <= z.x + z.w && toY >= z.y && toY <= z.y + z.h) {
      if (z.door) {
        destDoorX = z.door.x;
        destDoorY = z.door.y;
      }
      break;
    }
  }

  // Choose the closest corridor intersection to reach the target doorway
  if (destDoorX < 310) {
    // Target is in West Cabins -> Need to reach West Spine at destDoorY
    waypoints.push({ x: 310, y: currentY });
    waypoints.push({ x: 310, y: destDoorY });
    waypoints.push({ x: destDoorX, y: destDoorY }); // Enter through door
    waypoints.push({ x: toX, y: toY }); // Walk to visitor chair/spot
  } else if (destDoorX > 650) {
    // Target is in East Hubs -> Need to reach East Spine at destDoorY
    waypoints.push({ x: 652, y: currentY });
    waypoints.push({ x: 652, y: destDoorY });
    waypoints.push({ x: destDoorX, y: destDoorY }); // Enter through door
    waypoints.push({ x: toX, y: toY }); // Walk to visitor chair/spot
  } else {
    // Target is in Center (Project Bay, Boardroom, or Print Hub)
    if (destDoorY <= 260) {
      // North Corridor
      waypoints.push({ x: 485, y: currentY });
      waypoints.push({ x: 485, y: destDoorY });
      waypoints.push({ x: toX, y: toY });
    } else if (destDoorY <= 460) {
      // Boardroom / Center
      waypoints.push({ x: currentX, y: 260 });
      waypoints.push({ x: 485, y: 260 });
      waypoints.push({ x: 485, y: destDoorY });
      waypoints.push({ x: toX, y: toY });
    } else {
      // Print Hub / South Corridor
      waypoints.push({ x: currentX, y: 460 });
      waypoints.push({ x: 485, y: 460 });
      waypoints.push({ x: 485, y: destDoorY });
      waypoints.push({ x: toX, y: toY });
    }
  }

  return waypoints;
}

// Move employee to a specific zone safely through doorways & corridors
function moveEmployeeToZone(agentKey, zoneName, newState = "WALKING", customMsg = "") {
  const emp = canvasEmployees.find(e => e.key === agentKey || e.id === agentKey);
  if (!emp || !OFFICE_ZONES[zoneName]) return;

  const zone = OFFICE_ZONES[zoneName];
  // Select a designated visitor spot (never on top of a table!)
  const spots = zone.visitorSpots || [{ x: zone.x + zone.w / 2, y: zone.y + zone.h / 2 }];
  const targetSpot = spots[Math.floor(Math.random() * spots.length)];

  // Generate safe corridor path
  const path = buildOfficePath(emp.x, emp.y, targetSpot.x, targetSpot.y, null, zone.id);
  emp.pathWaypoints = path;
  emp.currentPathIdx = 0;
  emp.targetX = targetSpot.x;
  emp.targetY = targetSpot.y;
  emp.state = newState;
  emp.walkingText = customMsg || `🚶 Heading to ${zone.name.split(' ')[1] || zone.name}`;

  if (typeof AGENT_HIERARCHY !== 'undefined' && AGENT_HIERARCHY[agentKey]) {
    AGENT_HIERARCHY[agentKey].state = newState;
  }
}

function moveEmployeeToDesk(agentKey) {
  const emp = canvasEmployees.find(e => e.key === agentKey || e.id === agentKey);
  if (!emp) return;

  // Build safe return path along corridors back to desk chair
  const path = buildOfficePath(emp.x, emp.y, emp.deskX, emp.deskY);
  emp.pathWaypoints = path;
  emp.currentPathIdx = 0;
  emp.targetX = emp.deskX;
  emp.targetY = emp.deskY;
  emp.state = "WALKING";
  emp.walkingText = "🚶 Returning to Workstation";
}

function startContinuousWalkingEngine() {
  if (autoWalkingInterval) clearInterval(autoWalkingInterval);

  autoWalkingInterval = setInterval(() => {
    if (isAiPaused) return;

    const walkingCandidates = canvasEmployees.filter(e => e.x === e.deskX && e.y === e.deskY && e.pathWaypoints.length === 0);
    if (walkingCandidates.length === 0) return;

    const countToMove = Math.min(2, walkingCandidates.length);

    for (let i = 0; i < countToMove; i++) {
      const emp = walkingCandidates[Math.floor(Math.random() * walkingCandidates.length)];
      if (!emp) continue;

      const destinations = [
        { zone: 'coffee_lounge', text: "☕ Coffee Break", state: "ON_BREAK" },
        { zone: 'conference_room', text: "🤝 Strategy Huddle", state: "IN_MEETING" },
        { zone: 'print_room', text: "🖨️ Architecture Printout", state: "WALKING" },
        { zone: 'executive', text: "💬 CEO Consultation", state: "WALKING" },
        { zone: 'reception', text: "🛎️ Water Break", state: "ON_BREAK" }
      ];

      const dest = destinations[Math.floor(Math.random() * destinations.length)];
      moveEmployeeToZone(emp.key, dest.zone, dest.state, dest.text);

      setTimeout(() => {
        moveEmployeeToDesk(emp.key);
      }, 5500 + Math.random() * 3500);
    }
  }, 4500);
}

function triggerAllEmployeesWalk() {
  const zones = ['coffee_lounge', 'conference_room', 'print_room', 'executive', 'reception'];
  
  canvasEmployees.forEach((emp, index) => {
    const targetZone = zones[index % zones.length];
    moveEmployeeToZone(emp.key, targetZone, "WALKING", `🚶 Heading to ${OFFICE_ZONES[targetZone].name.split(' ')[1] || 'Zone'}`);
    
    setTimeout(() => {
      moveEmployeeToDesk(emp.key);
    }, 6000 + (index * 450));
  });

  if (typeof addAgentLogMessage === 'function') {
    addAgentLogMessage("Avinash (Owner / CEO)", "🚶 Triggered Safe Corridor Walking Simulation across Office Floor!", "#06b6d4");
  }
  if (typeof showToast === 'function') {
    showToast("All AI Employees are moving along marked corridors & doorways!", "info");
  }
}

// ─── Main Render Loop ─────────────────────────────────────────────────────────

function renderCanvasLoop() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw High-End Office Base Flooring
  drawLuxuryBaseFloor();

  // 2. Draw Marked Office Corridor Walkways / Hallways
  drawOfficeCorridors();

  // 3. Draw Realistic Office Zones / Architectural Rooms with Doors & Walls
  for (const zoneKey in OFFICE_ZONES) {
    drawDeluxeZone(OFFICE_ZONES[zoneKey]);
  }

  // 4. Draw Special Architectural Details (Conference Table, Coffee Bar, Server Racks, Plants)
  drawArchitecturalFeatures();

  // 5. Update Employee Position along Waypoint NavMesh
  if (!isAiPaused) {
    updateEmployeePositions();
  }

  // 6. Draw Hyper-Realistic Desks & Chairs for each workstation
  canvasEmployees.forEach(emp => {
    drawRealisticDesk(emp.deskX, emp.deskY, emp.deskType, emp.color, emp.name);
  });

  // 7. Draw Realistic Human Employee Avatars (Sitting or Walking through Hallways)
  canvasEmployees.forEach(emp => {
    drawRealisticHumanAvatar(emp);
  });

  requestAnimationFrame(renderCanvasLoop);
}

// ─── Realistic Flooring & Corridor Walkways ──────────────────────────────────

function drawLuxuryBaseFloor() {
  ctx.fillStyle = "#080c16";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle Parquet / Tile Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
  ctx.lineWidth = 1;
  const tileSize = 35;
  for (let x = 0; x < canvas.width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Draw Marked Corridor Walkways between rooms
function drawOfficeCorridors() {
  ctx.save();

  // 1. West Spine Hallway (x: 300 to 325)
  ctx.fillStyle = "rgba(99, 102, 241, 0.04)";
  ctx.fillRect(302, 35, 26, 515);

  // 2. East Spine Hallway (x: 642 to 667)
  ctx.fillRect(642, 35, 26, 515);

  // 3. North Cross Corridor (y: 250 to 275)
  ctx.fillRect(35, 250, 890, 25);

  // 4. South Cross Corridor (y: 450 to 475)
  ctx.fillRect(35, 450, 890, 25);

  // Subtle Corridor Directional Guide Lines
  ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);

  // West spine guide
  ctx.beginPath();
  ctx.moveTo(315, 35);
  ctx.lineTo(315, 550);
  ctx.stroke();

  // East spine guide
  ctx.beginPath();
  ctx.moveTo(655, 35);
  ctx.lineTo(655, 550);
  ctx.stroke();

  // North cross guide
  ctx.beginPath();
  ctx.moveTo(35, 262);
  ctx.lineTo(925, 262);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
}

function drawDeluxeZone(zone) {
  // Soft Floor Drop Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  // Zone Flooring Texture
  if (zone.floorType === "walnut") {
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x + zone.w, zone.y + zone.h);
    grad.addColorStop(0, "rgba(39, 24, 16, 0.38)");
    grad.addColorStop(1, "rgba(20, 12, 8, 0.48)");
    ctx.fillStyle = grad;
  } else if (zone.floorType === "oak") {
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x + zone.w, zone.y + zone.h);
    grad.addColorStop(0, "rgba(45, 30, 20, 0.28)");
    grad.addColorStop(1, "rgba(25, 18, 12, 0.38)");
    ctx.fillStyle = grad;
  } else if (zone.floorType === "marble") {
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x + zone.w, zone.y + zone.h);
    grad.addColorStop(0, "rgba(30, 41, 59, 0.42)");
    grad.addColorStop(1, "rgba(15, 23, 42, 0.52)");
    ctx.fillStyle = grad;
  } else if (zone.floorType === "carpet") {
    const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x + zone.w, zone.y + zone.h);
    grad.addColorStop(0, "rgba(30, 27, 75, 0.38)");
    grad.addColorStop(1, "rgba(15, 13, 45, 0.48)");
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = "rgba(15, 23, 42, 0.38)";
  }

  // Rounded Zone Plate
  drawRoundedRect(ctx, zone.x, zone.y, zone.w, zone.h, 10, true, false);
  ctx.restore();

  // Glass Wall Boundaries with Visible Doorway Openings
  ctx.save();
  ctx.strokeStyle = zone.borderColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  drawZoneWallsWithDoor(zone);

  // Soft Inner Ambient Glow
  ctx.strokeStyle = zone.glowColor;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.25;
  drawRoundedRect(ctx, zone.x + 2, zone.y + 2, zone.w - 4, zone.h - 4, 8, false, true);
  ctx.restore();

  // Zone Architectural Label Header Badge
  ctx.save();
  ctx.fillStyle = "rgba(9, 13, 22, 0.9)";
  ctx.strokeStyle = zone.borderColor;
  ctx.lineWidth = 1;
  const labelWidth = ctx.measureText(`${zone.icon} ${zone.name}`).width + 24;
  drawRoundedRect(ctx, zone.x + 8, zone.y + 6, Math.min(labelWidth, zone.w - 16), 20, 6, true, true);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`${zone.icon} ${zone.name.toUpperCase()}`, zone.x + 14, zone.y + 20);
  ctx.restore();
}

// Draw boundary walls with open door gap where employees enter
function drawZoneWallsWithDoor(zone) {
  const x = zone.x, y = zone.y, w = zone.w, h = zone.h;
  const door = zone.door;

  if (!door) {
    drawRoundedRect(ctx, x, y, w, h, 10, false, true);
    return;
  }

  const doorGap = 24; // Door opening width

  ctx.beginPath();
  // Top wall
  if (door.y === y) {
    ctx.moveTo(x + 10, y);
    ctx.lineTo(door.x - doorGap / 2, y);
    ctx.moveTo(door.x + doorGap / 2, y);
    ctx.lineTo(x + w - 10, y);
  } else {
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + w - 10, y);
  }

  // Right wall
  if (door.x === x + w || (door.x >= x + w - 15 && door.x <= x + w + 15)) {
    ctx.lineTo(x + w, door.y - doorGap / 2);
    ctx.moveTo(x + w, door.y + doorGap / 2);
    ctx.lineTo(x + w, y + h - 10);
  } else {
    ctx.lineTo(x + w, y + h - 10);
  }

  // Bottom wall
  if (door.y === y + h || (door.y >= y + h - 15 && door.y <= y + h + 15)) {
    ctx.lineTo(door.x + doorGap / 2, y + h);
    ctx.moveTo(door.x - doorGap / 2, y + h);
    ctx.lineTo(x + 10, y + h);
  } else {
    ctx.lineTo(x + 10, y + h);
  }

  // Left wall
  if (door.x === x || (door.x >= x - 15 && door.x <= x + 15)) {
    ctx.lineTo(x, door.y + doorGap / 2);
    ctx.moveTo(x, door.y - doorGap / 2);
    ctx.lineTo(x, y + 10);
  } else {
    ctx.lineTo(x, y + 10);
  }

  ctx.stroke();

  // Draw Doorway Indicator Posts / Markers (🚪 Doorway Portal)
  ctx.save();
  ctx.fillStyle = zone.borderColor;
  ctx.shadowColor = zone.borderColor;
  ctx.shadowBlur = 6;
  if (door.x === x || door.x === x + w || (door.x >= x + w - 15 && door.x <= x + w + 15)) {
    // Vertical wall door
    ctx.fillRect(door.x - 3, door.y - doorGap / 2 - 2, 6, 4);
    ctx.fillRect(door.x - 3, door.y + doorGap / 2 - 2, 6, 4);
  } else {
    // Horizontal wall door
    ctx.fillRect(door.x - doorGap / 2 - 2, door.y - 3, 4, 6);
    ctx.fillRect(door.x + doorGap / 2 - 2, door.y - 3, 4, 6);
  }
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// ─── Special Architectural Details (Boardroom Table, Espresso Bar, Plants) ────

function drawArchitecturalFeatures() {
  // 1. Boardroom Mahogany Conference Table
  const conf = OFFICE_ZONES.conference_room;
  if (conf) {
    const tableX = conf.x + conf.w / 2;
    const tableY = conf.y + conf.h / 2 + 10;
    const tableW = 180;
    const tableH = 65;

    // Soft Table Shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    // Mahogany Wood Table Top
    const tableGrad = ctx.createLinearGradient(tableX - tableW/2, tableY - tableH/2, tableX + tableW/2, tableY + tableH/2);
    tableGrad.addColorStop(0, "#451a03");
    tableGrad.addColorStop(0.5, "#78350f");
    tableGrad.addColorStop(1, "#361302");
    ctx.fillStyle = tableGrad;
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, tableX - tableW/2, tableY - tableH/2, tableW, tableH, 20, true, true);
    ctx.restore();

    // Central Cable / Conference Mic Hub
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(tableX - 35, tableY - 6, 70, 12);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.strokeRect(tableX - 35, tableY - 6, 70, 12);
    
    // Conference Laptops on Table
    for (let lx = -55; lx <= 55; lx += 55) {
      // Top row laptop
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(tableX + lx - 8, tableY - 22, 16, 10);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(tableX + lx - 6, tableY - 20, 12, 6);
      
      // Bottom row laptop
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(tableX + lx - 8, tableY + 12, 16, 10);
      ctx.fillStyle = "#818cf8";
      ctx.fillRect(tableX + lx - 6, tableY + 14, 12, 6);
    }

    // 8 Executive Leather Boardroom Chairs around table
    const chairCoords = [
      { x: tableX - 55, y: tableY - tableH/2 - 12 },
      { x: tableX,      y: tableY - tableH/2 - 12 },
      { x: tableX + 55, y: tableY - tableH/2 - 12 },
      { x: tableX - 55, y: tableY + tableH/2 + 12 },
      { x: tableX,      y: tableY + tableH/2 + 12 },
      { x: tableX + 55, y: tableY + tableH/2 + 12 },
      { x: tableX - tableW/2 - 12, y: tableY },
      { x: tableX + tableW/2 + 12, y: tableY }
    ];

    chairCoords.forEach(c => {
      drawMiniOfficeChair(c.x, c.y, "#1e1b4b", "#6366f1");
    });
  }

  // 2. Espresso Coffee Bar with Steam
  const coffee = OFFICE_ZONES.coffee_lounge;
  if (coffee) {
    const barX = coffee.x + 30;
    const barY = coffee.y + 45;
    const barW = coffee.w - 60;
    const barH = 30;

    // Granite Counter Bar
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#334155";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, barX, barY, barW, barH, 6, true, true);

    // Coffee Machine
    ctx.fillStyle = "#d97706";
    ctx.fillRect(barX + 20, barY + 4, 32, 22);
    ctx.strokeStyle = "#fef3c7";
    ctx.strokeRect(barX + 20, barY + 4, 32, 22);

    // Animated Steam rising from Coffee Machine
    const steamTime = Date.now() * 0.003;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 3; s++) {
      const sx = barX + 28 + s * 6 + Math.sin(steamTime + s) * 3;
      const sy = barY + 2 - (s * 3);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(sx + 3, sy - 6, sx, sy - 12);
      ctx.stroke();
    }

    // Water Cooler Dispenser
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(barX + barW - 30, barY + 15, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#bae6fd";
    ctx.stroke();

    ctx.restore();
  }

  // 3. Potted Biophilic Plants in corners 🌱
  const plantSpots = [
    { x: 42, y: 42 },
    { x: 300, y: 42 },
    { x: 655, y: 42 },
    { x: 915, y: 42 },
    { x: 300, y: 535 },
    { x: 655, y: 535 },
    { x: 915, y: 535 }
  ];

  plantSpots.forEach(p => drawBiophilicPlant(p.x, p.y));
}

function drawBiophilicPlant(x, y) {
  ctx.save();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.stroke();

  const leaves = 5;
  ctx.fillStyle = "#10b981";
  for (let i = 0; i < leaves; i++) {
    const angle = (i / leaves) * Math.PI * 2;
    const lx = x + Math.cos(angle) * 8;
    const ly = y + Math.sin(angle) * 8;
    ctx.beginPath();
    ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMiniOfficeChair(x, y, seatColor = "#1e293b", frameColor = "#6366f1") {
  ctx.save();
  ctx.fillStyle = seatColor;
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, x - 8, y - 7, 16, 14, 4, true, true);

  ctx.fillStyle = frameColor;
  ctx.fillRect(x - 7, y - 9, 14, 3);
  ctx.restore();
}

// ─── HYPER-REALISTIC OFFICE DESK RENDERING ───────────────────────────────────

function drawRealisticDesk(x, y, deskType = "standard", accentColor = "#6366f1", empName = "") {
  ctx.save();

  const deskW = 74;
  const deskH = 34;
  const deskLeft = x - deskW / 2;
  const deskTop = y - deskH / 2;

  // 1. Ergonomic Mesh Office Chair (Drawn behind the desk)
  drawErgonomicMeshChair(x, y + 20, accentColor);

  // 2. Realistic Desk Soft Drop Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // 3. Wooden / Carbon Fiber Tabletop with Realistic Bevel
  if (deskType === "executive_l") {
    const woodGrad = ctx.createLinearGradient(deskLeft - 10, deskTop, deskLeft + deskW + 10, deskTop + deskH);
    woodGrad.addColorStop(0, "#451a03");
    woodGrad.addColorStop(0.5, "#78350f");
    woodGrad.addColorStop(1, "#2e1002");
    ctx.fillStyle = woodGrad;
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.8;
    
    drawRoundedRect(ctx, deskLeft - 6, deskTop, deskW + 12, deskH, 6, true, true);
    
    ctx.fillStyle = "#2e1002";
    drawRoundedRect(ctx, deskLeft - 22, deskTop, 18, deskH + 16, 4, true, true);
  } else {
    const woodGrad = ctx.createLinearGradient(deskLeft, deskTop, deskLeft + deskW, deskTop + deskH);
    woodGrad.addColorStop(0, "#1e293b");
    woodGrad.addColorStop(0.5, "#334155");
    woodGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = woodGrad;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, deskLeft, deskTop, deskW, deskH, 5, true, true);
  }
  ctx.restore();

  // 4. Sleek Desk Mat / Leather Mousepad
  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 0.8;
  drawRoundedRect(ctx, x - 26, y - 10, 52, 20, 3, true, true);

  // 5. Dual Monitors / Ultra-wide Screen on Desk Stand
  if (deskType === "executive_l" || deskType === "dual_screen" || deskType === "dev_station") {
    drawRealisticMonitor(x - 16, y - 13, 26, 12, "#38bdf8", "code");
    drawRealisticMonitor(x + 14, y - 13, 26, 12, "#818cf8", "analytics");
  } else if (deskType === "sales_station") {
    drawRealisticMonitor(x - 8, y - 13, 30, 13, "#10b981", "crm");
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 18, y - 8, 12, 16);
    ctx.fillStyle = "#34d399";
    ctx.fillRect(x + 19, y - 7, 10, 14);
  } else if (deskType === "creative_station") {
    drawRealisticMonitor(x - 10, y - 13, 32, 13, "#fbbf24", "design");
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(x + 16, y - 7, 14, 15);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(x + 17, y - 6, 12, 13);
  } else {
    drawRealisticMonitor(x, y - 13, 34, 13, accentColor, "code");
  }

  // 6. Mechanical Keyboard with Keycap Detail
  ctx.fillStyle = "#090d16";
  ctx.fillRect(x - 14, y - 1, 28, 8);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 0.6;
  ctx.strokeRect(x - 14, y - 1, 28, 8);
  ctx.fillStyle = accentColor;
  ctx.fillRect(x - 12, y + 1, 24, 1.5);
  ctx.fillRect(x - 8, y + 4, 16, 1.5);

  // 7. Ergonomic Mouse on Right
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.ellipse(x + 19, y + 3, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. Ceramic Coffee Mug ☕
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x - 28, y + 5, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#78350f";
  ctx.beginPath();
  ctx.arc(x - 28, y + 5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 9. Potted Mini Desk Succulent 🌿
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(x + 28, y - 9, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(x + 28, y - 9, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawRealisticMonitor(centerX, centerY, width, height, screenGlowColor = "#38bdf8", contentMode = "code") {
  ctx.save();
  const left = centerX - width / 2;
  const top = centerY - height / 2;

  // Monitor Stand
  ctx.fillStyle = "#64748b";
  ctx.fillRect(centerX - 4, centerY + height/2, 8, 3);
  ctx.fillRect(centerX - 6, centerY + height/2 + 2, 12, 2);

  // Monitor Bezel & Frame
  ctx.fillStyle = "#020617";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 0.8;
  drawRoundedRect(ctx, left, top, width, height, 2, true, true);

  // Screen Glowing Display
  ctx.fillStyle = "rgba(7, 11, 20, 0.95)";
  ctx.fillRect(left + 1.5, top + 1.5, width - 3, height - 3);

  if (contentMode === "code") {
    ctx.fillStyle = screenGlowColor;
    ctx.fillRect(left + 3, top + 3, width * 0.45, 1.2);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(left + 6, top + 5.5, width * 0.6, 1.2);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(left + 6, top + 8, width * 0.35, 1.2);
  } else if (contentMode === "analytics" || contentMode === "crm") {
    ctx.fillStyle = screenGlowColor;
    ctx.fillRect(left + 4, top + 7, 3, 3);
    ctx.fillRect(left + 8, top + 5, 3, 5);
    ctx.fillRect(left + 12, top + 3, 3, 7);
    ctx.fillRect(left + 16, top + 4, 3, 6);
  } else {
    ctx.fillStyle = screenGlowColor;
    ctx.fillRect(left + 4, top + 3, width - 8, height - 6);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowColor = screenGlowColor;
  ctx.shadowBlur = 6;
  ctx.strokeStyle = screenGlowColor;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(left + 1.5, top + 1.5, width - 3, height - 3);

  ctx.restore();
}

function drawErgonomicMeshChair(x, y, accentColor = "#6366f1") {
  ctx.save();
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * 11, y + Math.sin(angle) * 11);
    ctx.stroke();
  }

  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, x - 12, y - 8, 24, 16, 5, true, true);

  ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
  drawRoundedRect(ctx, x - 10, y + 4, 20, 5, 3, true, false);

  ctx.fillStyle = "#334155";
  ctx.fillRect(x - 14, y - 6, 3, 10);
  ctx.fillRect(x + 11, y - 6, 3, 10);

  ctx.restore();
}

// ─── REALISTIC HUMAN EMPLOYEE AVATAR RENDERING ───────────────────────────────

function drawRealisticHumanAvatar(emp) {
  const isWalking = (emp.x !== emp.deskX || emp.y !== emp.deskY || emp.state === 'WALKING' || emp.pathWaypoints.length > 0);
  const walkTime = Date.now() * 0.012;
  const walkBounce = isWalking ? Math.abs(Math.sin(walkTime * 2)) * 4 : 0;
  
  const drawX = emp.x;
  const drawY = (isWalking ? emp.y - walkBounce : emp.deskY + 14);

  // 1. Motion Trail while walking along corridors
  if (isWalking && emp.trail) {
    emp.trail.forEach((t, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = emp.color;
      ctx.globalAlpha = (i / emp.trail.length) * 0.4;
      ctx.fill();
      ctx.restore();
    });
  }

  // 2. Realistic Dynamic Human Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(drawX, drawY + 8, isWalking ? 12 : 16, isWalking ? 6 : 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fill();
  ctx.restore();

  ctx.save();

  const p = emp.profile || {
    isFemale: false,
    skinTone: '#f7d5b8',
    hairColor: '#1a110b',
    hairStyle: 'short_fade',
    suitColor: '#1e293b',
    tieColor: '#38bdf8',
    glasses: false
  };

  // 3. Realistic Human Shoulders & Torso
  const shoulderWidth = 26;
  const shoulderHeight = 15;
  const shoulderX = drawX - shoulderWidth / 2;
  const shoulderY = drawY - 4;

  ctx.fillStyle = p.suitColor;
  ctx.strokeStyle = emp.color;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, shoulderX, shoulderY, shoulderWidth, shoulderHeight, 6, true, true);

  // Shirt Collar & Tie
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(drawX - 4, shoulderY);
  ctx.lineTo(drawX + 4, shoulderY);
  ctx.lineTo(drawX, shoulderY + 5);
  ctx.closePath();
  ctx.fill();

  if (p.tieColor && !p.isFemale) {
    ctx.fillStyle = p.tieColor;
    ctx.beginPath();
    ctx.moveTo(drawX - 2, shoulderY + 3);
    ctx.lineTo(drawX + 2, shoulderY + 3);
    ctx.lineTo(drawX, shoulderY + 9);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Arms & Hands (Animated Typing when sitting, Swinging when walking)
  if (!isWalking) {
    const typingWave = Math.sin(Date.now() * 0.015 + emp.typingOffset);
    
    ctx.fillStyle = p.skinTone;
    ctx.beginPath();
    ctx.arc(drawX - 8, drawY - 12 + typingWave * 1.5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(drawX + 8, drawY - 12 - typingWave * 1.5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    const swing = Math.sin(walkTime * 2) * 5;
    ctx.fillStyle = p.skinTone;
    ctx.beginPath();
    ctx.arc(drawX - 14, drawY + swing, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(drawX + 14, drawY - swing, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Realistic Human Head & Face
  const headRadius = 9;
  const headY = drawY - 7;

  // Neck
  ctx.fillStyle = p.skinTone;
  ctx.fillRect(drawX - 3, headY + 3, 6, 5);

  // Face Skin
  ctx.beginPath();
  ctx.arc(drawX, headY, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = p.skinTone;
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // 6. Realistic Hair Styles
  ctx.fillStyle = p.hairColor;
  if (p.isFemale) {
    ctx.beginPath();
    ctx.arc(drawX, headY - 2, headRadius + 1.2, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.fillRect(drawX - headRadius - 1, headY - 4, 3.5, 10);
    ctx.fillRect(drawX + headRadius - 2.5, headY - 4, 3.5, 10);
  } else {
    ctx.beginPath();
    ctx.arc(drawX, headY - 2.5, headRadius + 0.8, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
  }

  // Glasses Detail
  if (p.glasses) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.strokeRect(drawX - 6, headY - 2, 4, 3);
    ctx.strokeRect(drawX + 2, headY - 2, 4, 3);
    ctx.beginPath();
    ctx.moveTo(drawX - 2, headY - 1);
    ctx.lineTo(drawX + 2, headY - 1);
    ctx.stroke();
  }

  // 7. Holographic Floating Role & Status Badge
  const badgeY = drawY - 32;
  const nameFirst = emp.name.split(' ')[0];
  const roleShort = emp.title.split(' ')[0] + " " + (emp.title.split(' ')[1] || "");

  ctx.save();
  ctx.font = "bold 9.5px 'Plus Jakarta Sans', sans-serif";
  const nameWidth = ctx.measureText(nameFirst).width;
  const badgeW = Math.max(nameWidth + 36, 78);
  const badgeH = 22;
  const badgeX = drawX - badgeW / 2;

  ctx.fillStyle = "rgba(7, 11, 20, 0.92)";
  ctx.strokeStyle = emp.color;
  ctx.lineWidth = 1.2;
  ctx.shadowColor = emp.color;
  ctx.shadowBlur = 6;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 6, true, true);

  ctx.beginPath();
  ctx.arc(badgeX + 8, badgeY + 11, 3.5, 0, Math.PI * 2);
  if (emp.state === "WORKING") ctx.fillStyle = "#10b981";
  else if (emp.state === "WALKING") ctx.fillStyle = "#06b6d4";
  else if (emp.state === "ON_BREAK") ctx.fillStyle = "#fbbf24";
  else if (emp.state === "IN_MEETING") ctx.fillStyle = "#818cf8";
  else ctx.fillStyle = emp.color;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(nameFirst, badgeX + 16, badgeY + 7);

  ctx.fillStyle = emp.color || "#38bdf8";
  ctx.font = "bold 7.5px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(roleShort, badgeX + 16, badgeY + 16);
  ctx.restore();

  // 8. Walking Speech Bubble if moving
  if (isWalking && emp.walkingText) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 1;
    ctx.font = "bold 9px 'Plus Jakarta Sans', sans-serif";
    const textWidth = ctx.measureText(emp.walkingText).width + 16;
    const bubbleX = drawX - textWidth / 2;
    const bubbleY = badgeY - 20;

    drawRoundedRect(ctx, bubbleX, bubbleY, textWidth, 17, 5, true, true);

    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emp.walkingText, drawX, bubbleY + 8.5);
    ctx.restore();
  }

  ctx.restore();
}

// ─── Waypoint Step Execution (Obstacle-Free Walking) ───────────────────────────

function updateEmployeePositions() {
  canvasEmployees.forEach(emp => {
    // If employee has a queue of corridor waypoints to follow
    if (emp.pathWaypoints && emp.pathWaypoints.length > 0) {
      const currentTarget = emp.pathWaypoints[emp.currentPathIdx];
      if (!currentTarget) {
        emp.pathWaypoints = [];
        emp.currentPathIdx = 0;
        return;
      }

      const dx = currentTarget.x - emp.x;
      const dy = currentTarget.y - emp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        emp.x += (dx / dist) * emp.speed;
        emp.y += (dy / dist) * emp.speed;
        emp.state = "WALKING";

        if (Math.random() > 0.35) {
          emp.trail.push({ x: emp.x, y: emp.y });
          if (emp.trail.length > 8) emp.trail.shift();
        }
      } else {
        emp.x = currentTarget.x;
        emp.y = currentTarget.y;
        emp.currentPathIdx++;

        // Reached final waypoint
        if (emp.currentPathIdx >= emp.pathWaypoints.length) {
          emp.pathWaypoints = [];
          emp.currentPathIdx = 0;
          emp.trail = [];

          if (emp.x === emp.deskX && emp.y === emp.deskY) {
            emp.state = "WORKING";
            emp.walkingText = "";
          }
        }
      }
    }
  });
}
