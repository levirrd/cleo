/// <reference path="./.config/sa.d.ts" />
import { GangType, ImGuiCol, ImGuiStyleVar } from "./.config/enums";

const TOGGLE_KEY = 116; // F5
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
      ImGui.Text("Weapon Loadout");
      ImGui.Separator();
      if (ImGui.Button("Give AK-47")) textBox("AK-47 given");
      if (ImGui.Button("Give M4")) textBox("M4 given");
      if (ImGui.Button("Give Sniper Rifle")) textBox("Sniper given");
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
       Game.SetOnlyCreateGangMembers(true)
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
