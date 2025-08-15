/// <reference path="./.config/sa.d.ts" />
import { GangType, ImGuiCol, ImGuiStyleVar } from "./.config/enums";

// ===== Constants =====
const TOGGLE_KEY = 115; // F4
const gangNames = ["Ballas", "Grove", "Vagos", "Rifa", "Da Nang Boys", "Mafia", "Triad", "Aztecas"];
const weaponNames = [
  "Unarmed",
  "Brass Knuckles",
  "Golf Club",
  "Night Stick",
  "Knife",
  "Baseball Bat",
  "Shovel",
  "Pool Cue",
  "Katana",
  "Chainsaw",
  "Pistol",
  "Silenced Pistol",
  "Desert Eagle",
  "Shotgun",
  "Sawn-off Shotgun",
  "Combat Shotgun",
  "Micro Uzi",
  "MP5",
  "AK-47",
  "M4",
  "Tec-9",
  "Rifle",
  "Sniper Rifle",
];
const weaponIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];

// ===== Variables =====
var gShowWindow = false;
var player = new Player(0);
var playerChar = player.getChar();
var x, y, z;
var GangWar = false;
var GangMode = false;

// Territory
var zoneName = "Unknown";
var gGSFDensity = 0;
var gBallasDensity = 0;
var gVagosDensity = 0;
var gZoneLoaded = false;

// Weapon selection
var selectedGang = 0;
var selectedWeapons = [0, 0, 0]; // slots 1,2,3

// ===== Utility Functions =====
function getCurrentZoneData() {
  var coords = playerChar.getCoordinates();
  x = coords.x;
  y = coords.y;
  z = coords.z;

  zoneName = Zone.GetName(x, y, z);
  gGSFDensity = Zone.GetGangStrength(zoneName, GangType.Grove);
  gBallasDensity = Zone.GetGangStrength(zoneName, GangType.Ballas);
  gVagosDensity = Zone.GetGangStrength(zoneName, GangType.Vagos);

  gZoneLoaded = true;
}

function showMessage(text) {
  if (["gta3", "vc", "sa", "gta3_unreal", "vc_unreal", "sa_unreal"].includes(HOST)) {
    showTextBox(text);
  } else {
    ImGui.SetMessage(text);
  }
}

// ===== ImGui Helpers =====
function drawTerritoryTab() {
  ImGui.Spacing();
  ImGui.Text("Territory Management");
  ImGui.Separator();

  if (ImGui.Button("Get Current Zone")) {
    getCurrentZoneData();
    showMessage("Loaded zone: " + zoneName);
  }

  if (!gZoneLoaded) return;

  ImGui.Spacing();
  ImGui.Text("Zone: " + zoneName);
  gGSFDensity = ImGui.SliderInt("GSF Density", gGSFDensity, 0, 100);
  gBallasDensity = ImGui.SliderInt("Ballas Density", gBallasDensity, 0, 100);
  gVagosDensity = ImGui.SliderInt("Vagos Density", gVagosDensity, 0, 100);

  if (ImGui.Button("Apply Changes")) {
    Zone.SetGangStrength(zoneName, GangType.Grove, gGSFDensity);
    Zone.SetGangStrength(zoneName, GangType.Ballas, gBallasDensity);
    Zone.SetGangStrength(zoneName, GangType.Vagos, gVagosDensity);

    Game.SetOnMission(true);
    wait(10);
    Game.SetOnMission(false);

    showMessage("Densities updated for " + zoneName);
  }
}

function drawWeaponsTab() {
  ImGui.Spacing();
  ImGui.Text("Gang Selection");
  ImGui.Separator();

  selectedGang = ImGui.ComboBox("Select Gang", gangNames.join(","), selectedGang);
  ImGui.Text("Selected Gang: " + gangNames[selectedGang]);
  ImGui.Separator();

  ImGui.Text("Gang Weapon Spawn Setup");
  selectedWeapons[0] = ImGui.ComboBox("Weapon Slot 1", weaponNames.join(","), selectedWeapons[0]);
  selectedWeapons[1] = ImGui.ComboBox("Weapon Slot 2", weaponNames.join(","), selectedWeapons[1]);
  selectedWeapons[2] = ImGui.ComboBox("Weapon Slot 3", weaponNames.join(","), selectedWeapons[2]);

  ImGui.Spacing();
  ImGui.Separator();
  ImGui.Text("Apply selected changes");

  if (ImGui.Button("Apply Selection")) {
    Gang.SetWeapons(
      selectedGang,
      weaponIds[selectedWeapons[0]],
      weaponIds[selectedWeapons[1]],
      weaponIds[selectedWeapons[2]]
    );
    showMessage(
      "Gang: " +
        gangNames[selectedGang] +
        " weapons set to: " +
        weaponNames[selectedWeapons[0]] +
        ", " +
        weaponNames[selectedWeapons[1]] +
        ", " +
        weaponNames[selectedWeapons[2]]
    );
  }
}

function drawSettingsTab() {
  ImGui.Spacing();
  ImGui.Text("Settings");
  ImGui.Separator();

  GangWar = ImGui.Checkbox("Gang Wars", GangWar);
  Game.SetGangWarsActive(GangWar);

  GangMode = ImGui.Checkbox("Gang Mode", GangMode);
  Game.SetOnlyCreateGangMembers(GangMode);
}

// ===== Main Loop =====
while (true) {
  wait(0);
  ImGui.BeginFrame("IMGUI_TERRITORY_WEAPONS_SETTINGS");
  ImGui.SetCursorVisible(gShowWindow);

  if (gShowWindow) {
    ImGui.SetNextWindowSize(350, 400, 2);
    gShowWindow = ImGui.Begin("Gang Selector", gShowWindow, 0, 0, 0, 0);

    ImGui.BeginChild("MainChild");
    var tab = ImGui.Tabs("TabBar", "Territory,Weapons,Settings");

    if (tab === 0) drawTerritoryTab();
    else if (tab === 1) drawWeaponsTab();
    else if (tab === 2) drawSettingsTab();

    ImGui.EndChild();
    ImGui.End();
  }

  ImGui.EndFrame();

  if (Pad.IsKeyDown(TOGGLE_KEY)) gShowWindow = !gShowWindow;
}
