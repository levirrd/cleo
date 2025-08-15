/// <reference path="./.config/sa.d.ts" />
import { GangType, ImGuiCol, ImGuiStyleVar } from "./.config/enums";

const TOGGLE_KEY = 115; // F4
var gShowWindow = 0;
let p = new Player(0);
let playerchar = p.getChar();
let x, y, z;
let GangWar;
let GangMode;
// Territory variables
var zone_name = "Unknown";
var gGSFDensity = 0;
var gBallasDensity = 0;
var gVagosDensity = 0;
var gZoneLoaded = false;
var selectedGang = 0;

const gangNames = ["Ballas", "Grove", "Vagos", "Rifa", "Da Nang Boys", "Mafia", "Triad", "Aztecas"];
let selectedWeapon1 = 0;
let selectedWeapon2 = 0;
let selectedWeapon3 = 0;
const weaponNames = [
  "Unarmed",          // 0
  "Brass Knuckles",   // 1
  "Golf Club",        // 2
  "Night Stick",      // 3
  "Knife",            // 4
  "Baseball Bat",     // 5
  "Shovel",           // 6
  "Pool Cue",         // 7
  "Katana",           // 8
  "Chainsaw",         // 9
  "Pistol",           // 22
  "Silenced Pistol",  // 23
  "Desert Eagle",     // 24
  "Shotgun",          // 25
  "Sawn-off Shotgun", // 26
  "Combat Shotgun",   // 27
  "Micro Uzi",        // 28
  "MP5",              // 29
  "AK-47",            // 30
  "M4",               // 31
  "Tec-9",            // 32
  "Rifle",            // 33
  "Sniper Rifle"      // 34
];

const weaponIds = [
  0,  // Unarmed
  1,  // BrassKnuckles
  2,  // GolfClub
  3,  // NightStick
  4,  // Knife
  5,  // BaseballBat
  6,  // Shovel
  7,  // PoolCue
  8,  // Katana
  9,  // Chainsaw
  22, // Pistol
  23, // PistolSilenced
  24, // DesertEagle
  25, // Shotgun
  26, // Sawnoff
  27, // Spas12
  28, // MicroUzi
  29, // Mp5
  30, // Ak47
  31, // M4
  32, // Tec9
  33, // Rifle
  34  // Sniper
];

function getCurrentZoneData() {
  let coords = playerchar.getCoordinates();
  x = coords.x;
  y = coords.y;
  z = coords.z;
  zone_name = Zone.GetName(x, y, z);

  gGSFDensity = Zone.GetGangStrength(zone_name, GangType.Grove);
  gBallasDensity = Zone.GetGangStrength(zone_name, GangType.Ballas);
  gVagosDensity = Zone.GetGangStrength(zone_name, GangType.Vagos);
  gZoneLoaded = true;
}

function textBox(text) {
  if (["gta3", "vc", "sa", "gta3_unreal", "vc_unreal", "sa_unreal"].includes(HOST)) {
    showTextBox(text);
  } else {
    ImGui.SetMessage(text);
  }
}

while (true) {
  wait(0);

  ImGui.BeginFrame("IMGUI_TERRITORY_WEAPONS_SETTINGS");
  ImGui.SetCursorVisible(gShowWindow);

  if (gShowWindow) {
    ImGui.SetNextWindowSize(350.0, 400.0, 2);
    gShowWindow = ImGui.Begin("Gang Selector", gShowWindow, 0, 0, 0, 0);

    ImGui.BeginChild("MainChild");

    let tab = ImGui.Tabs("TabBar", "Territory,Weapons,Settings");

    // ===== Territory Tab =====
    if (tab == 0) {
      ImGui.Spacing();
      ImGui.Text("Territory Management");
      ImGui.Separator();

      if (ImGui.Button("Get Current Zone")) {
        getCurrentZoneData();
        textBox("Loaded zone: " + zone_name);
      }

      if (gZoneLoaded) {
        ImGui.Spacing();
        ImGui.Text("Zone: " + zone_name);

        gGSFDensity = ImGui.SliderInt("GSF Density", gGSFDensity, 0, 100);
        gBallasDensity = ImGui.SliderInt("Ballas Density", gBallasDensity, 0, 100);
        gVagosDensity = ImGui.SliderInt("Vagos Density", gVagosDensity, 0, 100);

        if (ImGui.Button("Apply Changes")) {
          Zone.SetGangStrength(zone_name, GangType.Grove, gGSFDensity);
          Zone.SetGangStrength(zone_name, GangType.Ballas, gBallasDensity);
          Zone.SetGangStrength(zone_name, GangType.Vagos, gVagosDensity);
          Game.SetOnMission(true);
          wait(10);
          Game.SetOnMission(false);
          textBox("Densities updated for " + zone_name);
        }
      }
    }

    // ===== Weapons Tab =====
if (tab == 1) {
  ImGui.Spacing();
  ImGui.Text("Gang Selection");
  ImGui.Separator();

  selectedGang = ImGui.ComboBox(
    "Select Gang",
    gangNames.join(","),
    selectedGang
  );

  ImGui.Spacing();
  ImGui.Text("Selected Gang: " + gangNames[selectedGang]);

  ImGui.Separator();
  ImGui.Text("Gang Weapon Spawn Setup");

  selectedWeapon1 = ImGui.ComboBox(
    "Weapon Slot 1",
    weaponNames.join(","),
    selectedWeapon1
  );
  selectedWeapon2 = ImGui.ComboBox(
    "Weapon Slot 2",
    weaponNames.join(","),
    selectedWeapon2
  );
  selectedWeapon3 = ImGui.ComboBox(
    "Weapon Slot 3",
    weaponNames.join(","),
    selectedWeapon3
  );

  ImGui.Spacing();
  ImGui.Separator();
  ImGui.Text("Apply selected changes");

  if (ImGui.Button("Apply Selection")) {
    Gang.SetWeapons(
      selectedGang,                           // gang ID
      weaponIds[selectedWeapon1],             // slot 1 weapon type
      weaponIds[selectedWeapon2],             // slot 2 weapon type
      weaponIds[selectedWeapon3]              // slot 3 weapon type
    );

    textBox(
      "Gang: " + gangNames[selectedGang] +
      " weapons set to: " +
      weaponNames[selectedWeapon1] + ", " +
      weaponNames[selectedWeapon2] + ", " +
      weaponNames[selectedWeapon3]
    );
  }
}
    // ===== Settings Tab =====
    if (tab == 2) {
      ImGui.Spacing();
      ImGui.Text("Settings");
      ImGui.Separator();
      GangWar = ImGui.Checkbox("Gang Wars", GangWar);
      if (GangWar) {
        Game.SetGangWarsActive(true);
      } else {
        Game.SetGangWarsActive(false);
      }
      GangMode = ImGui.Checkbox("Gang Mode", GangMode);
      if (GangMode) {
        Game.SetOnlyCreateGangMembers(true);
      } else {
        Game.SetOnlyCreateGangMembers(false);
      }
    }

    ImGui.EndChild();
    ImGui.End();
  }

  ImGui.EndFrame();

  if (Pad.IsKeyDown(TOGGLE_KEY)) {
    gShowWindow = !gShowWindow;
  }
}
