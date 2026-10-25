import { Activity, Axe, Ban, Bomb, Bot, CarFront, Diamond, FileTerminal, Flame, Fuel, Link, Lock, LogIn, PersonStanding, Pyramid, Swords, Target, TestTube, Zap } from "lucide-react";

export const categories = [
    "Main",
    "Weapons",
    "Entities",
    "Explosions",
    "Premium",
    "Beta",
    "Settings"
]

export const explosionsList = [
    {
        value: 0,
        label: "Grenade",
    },
    {
        value: 1,
        label: "Grenade Launcher",
    },
    {
        value: 2,
        label: "Sticky Bomb",
    },
    {
        value: 3,
        label: "Molotov",
    },
    {
        value: 4,
        label: "Rocket",
    },
    {
        value: 5,
        label: "TankShell",
    },
    {
        value: 6,
        label: "Hi_Octane",
    },
    {
        value: 7,
        label: "Car",
    },
    {
        value: 8,
        label: "Plane",
    },
    {
        value: 9,
        label: "PetrolPump",
    },
    {
        value: 10,
        label: "Bike",
    },
    {
        value: 11,
        label: "Dir_Steam",
    },
    {
        value: 12,
        label: "Dir_Flame",
    },
    {
        value: 13,
        label: "Dir_Water_Hydrant",
    },
    {
        value: 14,
        label: "Dir_Gas_Canister",
    },
    {
        value: 15,
        label: "Boat",
    },
    {
        value: 16,
        label: "Ship_Destroy",
    },
    {
        value: 17,
        label: "Truck",
    },
    {
        value: 18,
        label: "Bullet",
    },
    {
        value: 19,
        label: "SmokeGrenadeLauncher",
    },
    {
        value: 20,
        label: "SmokeGrenade",
    },
    {
        value: 21,
        label: "BZGAS",
    },
    {
        value: 22,
        label: "Flare",
    },
    {
        value: 23,
        label: "Gas_Canister",
    },
    {
        value: 24,
        label: "Extinguisher",
    },
    {
        value: 25,
        label: "Programmablear",
    },
    {
        value: 26,
        label: "Train",
    },
    {
        value: 27,
        label: "Barrel",
    },
    {
        value: 28,
        label: "PROPANE",
    },
    {
        value: 29,
        label: "Blimp",
    },
    {
        value: 30,
        label: "Dir_Flame_Explode",
    },
    {
        value: 31,
        label: "Tanker",
    },
    {
        value: 32,
        label: "PlaneRocket",
    },
    {
        value: 33,
        label: "VehicleBullet",
    },
    {
        value: 34,
        label: "Gas_Tank",
    },
    {
        value: 35,
        label: "EXP_TAG_BIRD_CRAP",
    },
    {
        value: 36,
        label: "EXP_TAG_RAILGUN",
    },
    {
        value: 37,
        label: "EXP_TAG_BLIMP2",
    },
    {
        value: 38,
        label: "EXP_TAG_FIREWORK",
    },
    {
        value: 39,
        label: "EXP_TAG_SNOWBALL",
    },
    {
        value: 40,
        label: "EXP_TAG_PROXMINE",
    },
    {
        value: 41,
        label: "EXP_TAG_VALKYRIE_CANNON",
    },
    {
        value: 42,
        label: "EXP_TAG_AIR_DEFENCE",
    },
    {
        value: 43,
        label: "EXP_TAG_PIPEBOMB",
    },
    {
        value: 44,
        label: "EXP_TAG_VEHICLEMINE",
    },
    {
        value: 45,
        label: "EXP_TAG_EXPLOSIVEAMMO",
    },
    {
        value: 46,
        label: "EXP_TAG_APCSHELL",
    },
    {
        value: 47,
        label: "EXP_TAG_BOMB_CLUSTER",
    },
    {
        value: 48,
        label: "EXP_TAG_BOMB_GAS",
    },
    {
        value: 49,
        label: "EXP_TAG_BOMB_INCENDIARY",
    },
    {
        value: 50,
        label: "EXP_TAG_BOMB_STANDARD",
    },
    {
        value: 51,
        label: "EXP_TAG_TORPEDO",
    },
    {
        value: 52,
        label: "EXP_TAG_TORPEDO_UNDERWATER",
    },
    {
        value: 53,
        label: "EXP_TAG_BOMBUSHKA_CANNON",
    },
    {
        value: 54,
        label: "EXP_TAG_BOMB_CLUSTER_SECONDARY",
    },
    {
        value: 55,
        label: "EXP_TAG_HUNTER_BARRAGE",
    },
    {
        value: 56,
        label: "EXP_TAG_HUNTER_CANNON",
    },
    {
        value: 57,
        label: "EXP_TAG_ROGUE_CANNON",
    },
    {
        value: 58,
        label: "EXP_TAG_MINE_UNDERWATER",
    },
    {
        value: 59,
        label: "EXP_TAG_ORBITAL_CANNON",
    },
    {
        value: 60,
        label: "EXP_TAG_BOMB_STANDARD_WIDE",
    },
    {
        value: 61,
        label: "EXP_TAG_EXPLOSIVEAMMO_SHOTGUN",
    },
    {
        value: 62,
        label: "EXP_TAG_OPPRESSOR2_CANNON",
    },
    {
        value: 63,
        label: "EXP_TAG_MORTAR_KINETIC",
    },
    {
        value: 64,
        label: "EXP_TAG_VEHICLEMINE_KINETIC",
    },
    {
        value: 65,
        label: "EXP_TAG_VEHICLEMINE_EMP",
    },
    {
        value: 66,
        label: "EXP_TAG_VEHICLEMINE_SPIKE",
    },
    {
        value: 67,
        label: "EXP_TAG_VEHICLEMINE_SLICK",
    },
    {
        value: 68,
        label: "EXP_TAG_VEHICLEMINE_TAR",
    },
    {
        value: 69,
        label: "EXP_TAG_SCRIPT_DRONE",
    },
    {
        value: 70,
        label: "EXP_TAG_RAYGUN",
    },
    {
        value: 71,
        label: "EXP_TAG_BURIEDMINE",
    },
    {
        value: 72,
        label: "EXP_TAG_SCRIPT_MISSILE",
    },
    {
        value: 73,
        label: "EXP_TAG_RCTANK_ROCKET",
    },
    {
        value: 74,
        label: "EXP_TAG_BOMB_WATER",
    },
    {
        value: 75,
        label: "EXP_TAG_BOMB_WATER_SECONDARY",
    },
    {
        value: 76,
        label: "_0xF728C4A9",
    },
    {
        value: 77,
        label: "_0xBAEC056F",
    },
    {
        value: 78,
        label: "EXP_TAG_FLASHGRENADE",
    },
    {
        value: 79,
        label: "EXP_TAG_STUNGRENADE",
    },
    {
        value: 80,
        label: "_0x763D3B3B",
    },
    {
        value: 81,
        label: "EXP_TAG_SCRIPT_MISSILE_LARGE",
    },
    {
        value: 82,
        label: "EXP_TAG_SUBMARINE_BIG",
    },
    {
        value: 83,
        label: "EMPLAUNCHER_EMP",
    },
]

export const configuration = [
    {
        "Executors Detections": {
            Icon: FileTerminal,
            Data: [
                { name: 'Executor Detection #2', value: 'E2', type: "boolean", tooltip: 'Advanced detection for executors and LUA menus using behavioral analysis.' },
                { name: 'Executor Detection #3', value: 'E3', type: "boolean", tooltip: 'Advanced detection for executors.' },
                { name: 'Executor Detection #4', value: 'E4', type: "boolean", tooltip: 'Advanced detection for executors.' },
                { name: 'Executor Detection #6 (Not Recommanded)', value: 'E6', type: "boolean", tooltip: 'Detects lot of executors. Use with caution as it may produce occasional false positives.' },
            ]
        },
        "Client Detections": {
            Icon: Pyramid,
            Data: [
                { name: 'Anti LUA Menu', value: 'AntiLuaMenu', type: "boolean", tooltip: 'Identifies and blocks most LUA-based mod menus by analyzing execution patterns.' },
                { name: 'Anti LUA Input', value: 'AntiInputBox', type: "boolean", tooltip: 'Secondary detection method for LUA mod menus by monitoring input methods.' },
                { name: 'Anti Teleport', value: 'AntiTeleport', type: "boolean", tooltip: 'Detects unnatural player movement, such as instantaneous long-distance travel.' },
                { name: 'Anti NoClip', value: 'AntiNoClip', type: "boolean", tooltip: 'Identifies players bypassing collision detection to move through objects.' },
                { name: 'Anti FreeCam', value: 'AntiFreeCam', type: "boolean", tooltip: 'Detects players using unauthorized camera modes to gain unfair advantages.' },
                { name: 'Anti Speed Hack', value: 'AntiSpeedHack', type: "boolean", tooltip: 'Identifies players moving at speeds exceeding normal game limitations.' },
                { name: 'Anti No-Ragdoll', value: 'AntiNoRagdoll', type: "boolean", tooltip: 'Detects players who have disabled the ragdoll physics effect to gain advantages.' },
                { name: 'Anti Spectate', value: 'AntiSpectate', type: "boolean", tooltip: 'Prevents unauthorized spectating of other players through cheat methods.' },
                { name: 'Anti Invisibility', value: 'AntiInvisible', type: "boolean", tooltip: 'Identifies players who have made themselves invisible through exploits.' },
                { name: 'Anti Super Jump', value: 'AntiSuperJump', type: "boolean", tooltip: 'Detects players using enhanced jump abilities beyond normal game mechanics.' },
                { name: 'Anti Infinite Stamina', value: 'AntiInfiniteStamina', type: "boolean", tooltip: 'Identifies players with unlimited stamina through gameplay modifications.' },
                { name: 'Anti Model Change', value: 'AntiPedModelChange', type: "boolean", tooltip: 'Detects unauthorized changes to player character models.' },
                { name: 'Anti Night Vision', value: 'AntiNightVisions', type: "boolean", tooltip: 'Identifies players using unauthorized night vision capabilities.' },
                { name: 'Anti AFK Bypass', value: 'AntiAFKBypass', type: "boolean", tooltip: 'Detects players using scripts to appear active while actually AFK.' },
                { name: 'Anti Player Tracking', value: 'AntiBlips', type: "boolean", tooltip: 'Prevents cheaters from using map blips to track other players.' },
            ]
        },
        "Health Detections": {
            Icon: Activity,
            Data: [
                { name: 'Anti Health Regeneration', value: 'AntiInfiniteRefill', type: "boolean", tooltip: 'Detects abnormal health regeneration rates associated with "Semi God Mode" cheats.' },
                { name: 'Anti Health Stat Modification', value: 'AntiOverrideHealthStats', type: "boolean", tooltip: 'Identifies modifications to maximum health values beyond server limitations.' },
                { name: 'Anti Invincibility', value: 'AntiInvincible', type: "boolean", tooltip: 'Detects players who have enabled invincibility through cheats.' },
                { name: 'Anti Damage Immunity', value: 'AntiNoCombatDamages', type: "boolean", tooltip: 'Identifies players immune to normal weapon damage through exploits.' },
                { name: 'Revive Event Name (Client)', value: 'ClientReviveEvent', type: "string", tooltip: 'Specify your server\'s revive event name to restore players killed by cheaters. Example: esx_ambulancejob:revive', placeholder: 'esx_ambulancejob:revive' },
            ],
        },
        "Events Detections": {
            Icon: Zap,
            Data: [
                { name: 'AI Client Event Protection', value: 'AntiTriggerClientEventAI', type: "boolean", tooltip: 'Protection for all client events. Automatically secures your server against event/exports exploitation.' },
                { name: 'AI Server Event Protection', value: 'AntiTriggerServerEventAI', type: "boolean", tooltip: 'Protection for all server events. Automatically secures your server against event exploitation.' },
                { name: 'Anti Trigger Client Event (Deprecated)', value: 'AntiTriggerClientEvent', type: "boolean", tooltip: 'Legacy protection for client events. Requires manual configuration in documentation.' },
                { name: 'Anti Trigger Server Event (Deprecated)', value: 'AntiTriggerServerEvent', type: "boolean", tooltip: 'Legacy protection for server events. Requires manual configuration in documentation.' },
                { name: 'Event Protection Exceptions', value: 'IgnoredEvents', type: "list", placeholder: "esx:triggerServerCallback, ...", tooltip: 'List of Client/server events to exclude from protection. Add events that are incompatible with protection or don\'t require it.' },
            ],
        },
        "Misc Detections": {
            Icon: Zap,
            Data: [
                { name: 'Anti Resource Stop', value: 'AntiResourceStop', type: "boolean", tooltip: 'Detects attempts to stop WaveShield or any other server resource through script exploitation or command injection.' },
                { name: 'Anti Resource Injection', value: 'AntiResourceInjection', type: "boolean", tooltip: 'Identifies unauthorized resource injection attempts used to execute malicious code on your server.' },
                { name: 'Anti Clear Tasks', value: 'AntiClearTasks', type: "boolean", tooltip: 'Prevents cheaters from using clearTasks on other players, which can disrupt animations, movement, and game actions.' },
                { name: 'Anti NUI Dev Tools', value: 'AntiDevTools', type: "boolean", tooltip: 'Detects players opening browser developer tools which can be used to analyze and exploit NUI interfaces.' },
            ],
        },
    },
    {
        "Weapons Detections": {
            Icon: Axe,
            Data: [
                { name: 'Anti Weapon Spawn', value: 'AntiWeaponSpawner', type: "boolean", tooltip: 'Detects unauthorized weapons spawned by cheaters or through RPF modifications not listed in your weapon whitelist.' },
                { name: 'Add-On Weapons', value: 'AddonWeapons', type: "list", placeholder: "weapon_plasmap, weapon_glock17, ...", tooltip: 'List of custom add-on weapons that should be protected on your server.' },
                { name: 'Anti Give Weapons', value: 'AntiGiveWeapons', type: "boolean", tooltip: 'Detects cheaters attempting to give weapons to other players through unauthorized methods.' },
                { name: 'Anti Remove Weapons', value: 'AntiRemoveWeapons', type: "boolean", tooltip: 'Detects cheaters attempting to remove weapons from other players through script exploitation.' },
                { name: 'Anti Spoofed Bullets', value: 'AntiSpoofedBullets', type: "boolean", tooltip: 'Detects players firing bullets or using weapons they don\'t actually possess in their inventory.' },
                { name: 'Anti Kill Exploits', value: 'AntiKill', type: "boolean", tooltip: 'Detects and blocks cheaters attempting to instantly kill other players through various exploitation methods.' },
                { name: 'Enable Weapons Blacklist', value: 'EnableWeaponsBlackList', type: "boolean", tooltip: 'Activates the weapon blacklist system. Note that Anti Weapon Spawn already detects all unauthorized weapons.' },
                { name: 'Blacklisted Weapons', value: 'BlackListedWeapons', type: "list", placeholder: "weapon_rpg, weapon_grenade, ...", tooltip: 'List of weapons that are never allowed on your server, even when obtained through legitimate means.' },
            ],
        },
        "Weapon Cheats": {
            Icon: Swords,
            Data: [
                { name: 'Anti Aimbot', value: 'AntiAimBot', type: "boolean", tooltip: 'Advanced detection for aimbots that identifies unnaturally perfect tracking and target acquisition.' },
                { name: 'Anti Weapon Component Modifier', value: 'AntiWeaponComponentModifier', type: "boolean", tooltip: 'Detects unauthorized modifications to weapon components, attachments, or properties through RPF edits.' },
                { name: 'Anti Weapon Damage Modifier', value: 'AntiWeaponDamagesModifier', type: "boolean", tooltip: 'Identifies modifications to weapon damage values through RPF edits or runtime memory manipulation.' },
                { name: 'Anti Ammo Cheats', value: 'AntiAmmoCheating', type: "boolean", tooltip: 'Detects players with abnormal ammunition amounts or ammo-related modifications.' },
                { name: 'Anti Infinite Ammo', value: 'AntiInfiniteAmmo', type: "boolean", tooltip: 'Identifies players using infinite ammunition through memory manipulation or script exploits.' },
                { name: 'Anti No Reload', value: 'AntiNoReload', type: "boolean", tooltip: 'Detects players bypassing weapon reload mechanics to fire continuously without reloading.' },
                { name: 'Anti Explosive Bullets', value: 'AntiExplosiveBullets', type: "boolean", tooltip: 'Identifies players using modified ammunition types to create explosions on impact.' },
                { name: 'Anti Super Punch', value: 'AntiSuperPunch', type: "boolean", tooltip: 'Detects players using enhanced melee damage to instantly kill others or destroy vehicles with punches.' },
                { name: 'Anti Hitbox Modifier', value: 'AntiHitboxModifier', type: "boolean", tooltip: 'Identifies RPF modifications that alter player hitboxes to make hitting targets easier.' },
                { name: 'Anti No Recoil', value: 'AntiNoRecoil', type: "boolean", tooltip: 'Identifies players who have eliminated weapon recoil through RPF modifications.' },
            ],
        },
        "Projectiles": {
            Icon: Target,
            Data: [
                { name: 'Enable Projectiles Whitelist', value: 'EnableProjectilesWhiteList', type: "boolean", tooltip: 'Activates the projectile whitelist system. Any projectile not in the whitelist will trigger a ban.' },
                { name: 'Whitelisted Projectiles', value: 'WhiteListedProjectiles', type: "list", placeholder: "weapon_bzgas, weapon_snowball, weapon_smokegrenade, ...", tooltip: 'List of projectile weapons that are allowed on your server. All others will be blocked if whitelist is enabled.' },
                { name: 'Enable Projectiles Limiter', value: 'EnableProjectilesLimiter', type: "boolean", tooltip: 'Activates rate limiting for projectile spawning to prevent spam attacks.' },
                { name: 'Projectiles Spawn Limit', value: 'ProjectilesLimitIn5Seconds', type: "number", tooltip: 'Maximum number of projectiles a player can spawn within a 5-second window before triggering detection.' },
                { name: 'Log Projectile Spawns (Console)', value: 'LogProjectileSpawnsToConsole', type: "boolean", tooltip: 'Records all projectile spawns to the server console for monitoring and debugging purposes.' },
            ],
        },
    },
    {
        "Vehicles Detections": {
            Icon: CarFront,
            Data: [
                { name: 'AI Anti Vehicle Spawn', value: 'EnableVehiclesAI', type: "boolean", tooltip: 'Advanced detection system for unauthorized vehicle spawns without requiring manual blacklist configuration.' },
                { name: 'Anti AI Vehicle Spawn', value: 'EnableVehiclesAIv2', type: "boolean", tooltip: 'Detects spawning of NPC/AI vehicles by cheaters.' },
                { name: 'Anti Isolated Vehicle Spawn', value: 'AntiSpawnIsolatedVehicles', type: "boolean", tooltip: 'Detects vehicles spawned in isolated environments often used by cheat menus to hide spawning activity.' },
                { name: 'Enable Vehicle Blacklist', value: 'EnableVehiclesBlackList', type: "boolean", tooltip: 'Activates the vehicle blacklist system. Any vehicle in the blacklist will trigger detection if spawned.' },
                { name: 'Blacklisted Vehicles', value: 'BlackListedVehicles', type: "list", placeholder: "submersible, 837858166, ...", tooltip: 'List of vehicles that are never allowed on your server. Can use model names or hash values.' },
                { name: 'Enable Vehicle Spawn Limiter', value: 'EnableVehiclesLimiter', type: "boolean", tooltip: 'Activates rate limiting for vehicle spawning to prevent mass spawn attacks.' },
                { name: 'Vehicle Spawn Limit', value: 'VehiclesLimitIn5Seconds', type: "number", tooltip: 'Maximum number of vehicles a player can spawn within a 5-second window before triggering detection.' },
                { name: 'Anti Vehicle Throwing', value: 'AntiThrowVehicles', type: "boolean", tooltip: 'Detects cheaters applying excessive force to vehicles to throw them at players or buildings.' },
                { name: 'Anti Vehicle Deletion', value: 'AntiDeleteVehicles', type: "boolean", tooltip: 'Prevents cheaters from deleting vehicles owned or occupied by other players.' },
                { name: 'Log Vehicle Spawns (Console)', value: 'LogVehicleSpawnsToConsole', type: "boolean", tooltip: 'Records all vehicle spawns to the server console for monitoring and debugging purposes.' },
                { name: 'Disable Vehicle Damage to Players', value: 'NoCarKill', type: "boolean", tooltip: 'Prevents players from taking damage when hit by vehicles, countering vehicle ramming attacks.' },
                { name: 'Auto-Delete Destroyed Vehicles', value: 'DeleteVehicleOnDestroy', type: "boolean", tooltip: 'Automatically removes vehicles that are destroyed, exploded, or burning to reduce server load.' },
                { name: 'Anti Vehicle Plate Changer', value: 'AntiVehiclePlateChanger', type: "boolean", tooltip: 'Detects unauthorized license plate modifications used to bypass identification systems.' },
                { name: 'Anti Teleport Into Vehicles', value: 'AntiTeleportInVehicle', type: "boolean", tooltip: 'Prevents cheaters from teleporting directly into other players\' vehicles without authorization.' },
                { name: 'Anti Vehicle Speed Modifier', value: 'AntiSpeedModifier', type: "boolean", tooltip: 'Detects modifications to vehicle speed properties beyond normal tuning capabilities.' },
                { name: 'Anti Vehicle Handling Modifier', value: 'AntiHandlingModifier', type: "boolean", tooltip: 'Identifies unauthorized changes to vehicle handling data like grip, acceleration, or braking.' },
                { name: 'Anti Vehicle Damage Modifier', value: 'AntiVehicleDamagesModifier', type: "boolean", tooltip: 'Detects modifications to vehicle damage resistance or collision properties.' },
            ],
        },
        "Peds Detections": {
            Icon: PersonStanding,
            Data: [
                { name: 'Disable NPC Population', value: 'DisableNPCPopulation', type: "boolean", tooltip: 'Completely disables NPC spawning on your server. Highly recommended if your server doesn\'t use NPCs as it improves detection accuracy.' },
                { name: 'AI Anti Ped Spawn', value: 'EnablePedsAI', type: "boolean", tooltip: 'Advanced detection system for unauthorized ped spawns without requiring manual whitelist configuration.' },
                { name: 'Anti AI Ped Spawn', value: 'EnablePedsAIv2', type: "boolean", tooltip: 'Detects spawning of NPC/AI peds by cheaters.' },
                { name: 'Enable Ped Whitelist', value: 'EnablePedsWhiteList', type: "boolean", tooltip: 'Activates the ped whitelist system. Any ped not in the whitelist will trigger detection if spawned.' },
                { name: 'Whitelisted Peds', value: 'WhiteListedPeds', type: "list", placeholder: "a_f_m_beach_01, a_f_m_bevhills_01, 1413662315, ...", tooltip: 'List of peds that are allowed on your server. Can use model names or hash values.' },
                { name: 'Enable Ped Blacklist', value: 'EnablePedsBlackList', type: "boolean", tooltip: 'Activates the ped blacklist system. Any ped in the blacklist will trigger detection if spawned.' },
                { name: 'Blacklisted Peds', value: 'BlackListedPeds', type: "list", placeholder: "a_c_chimp, -1469565163, ...", tooltip: 'List of peds that are never allowed on your server. Can use model names or hash values.' },
                { name: 'Enable Ped Spawn Limiter', value: 'EnablePedsLimiter', type: "boolean", tooltip: 'Activates rate limiting for ped spawning to prevent mass spawn attacks.' },
                { name: 'Ped Spawn Limit', value: 'PedsLimitIn5Seconds', type: "number", tooltip: 'Maximum number of peds a player can spawn within a 5-second window before triggering detection.' },
                { name: 'Log Ped Spawns (Console)', value: 'LogPedSpawnsToConsole', type: "boolean", tooltip: 'Records all ped spawns to the server console for monitoring and debugging purposes.' },
            ],
        },
        "Objects Detections": {
            Icon: Fuel,
            Data: [
                { name: 'AI Anti Object Spawn', value: 'EnableObjectsAI', type: "boolean", tooltip: 'Advanced detection system for unauthorized object spawns without requiring manual whitelist or blacklist configuration.' },
                { name: 'Enable Object Whitelist', value: 'EnableObjectsWhiteList', type: "boolean", tooltip: 'Activates the object whitelist system. Any object not in the whitelist will trigger detection if spawned.' },
                { name: 'Whitelisted Objects', value: 'WhiteListedObjects', type: "list", placeholder: "apa_mp_h_yacht_sofa_02, 1224329141, ...", tooltip: 'List of objects that are allowed on your server. Can use model names or hash values.' },
                { name: 'Enable Object Blacklist', value: 'EnableObjectsBlackList', type: "boolean", tooltip: 'Activates the object blacklist system. Any object in the blacklist will trigger detection if spawned.' },
                { name: 'Blacklisted Objects', value: 'BlackListedObjects', type: "list", placeholder: "stt_prop_stunt_track_dwslope30, -145066854, ...", tooltip: 'List of objects that are never allowed on your server. Can use model names or hash values.' },
                { name: 'Anti Pickup Spawn', value: 'AntiPickupSpawn', type: "boolean", tooltip: 'Prevents spawning of pickups (health, armor, weapons, ammo) that can disrupt server economy or gameplay.' },
                { name: 'Enable Object Spawn Limiter', value: 'EnableObjectsLimiter', type: "boolean", tooltip: 'Activates rate limiting for object spawning to prevent mass spawn attacks.' },
                { name: 'Object Spawn Limit', value: 'ObjectsLimitIn5Seconds', type: "number", tooltip: 'Maximum number of objects a player can spawn within a 5-second window before triggering detection.' },
                { name: 'Log Object Spawns (Console)', value: 'LogObjectSpawnsToConsole', type: "boolean", tooltip: 'Records all object spawns to the server console for monitoring and debugging purposes.' },
            ],
        },
    },
    {
        "Explosions Detections": {
            Icon: Bomb,
            Data: [
                { name: 'AI Anti Explosion', value: 'EnableExplosionsAI', type: "boolean", tooltip: 'Advanced detection system for unauthorized explosions without requiring manual blacklist configuration.' },
                { name: 'Enable Explosion Blacklist', value: 'EnableExplosionsBlackList', type: "boolean", tooltip: 'Activates the explosion blacklist system. Any explosion type in the blacklist will trigger detection.' },
                { name: 'Blacklisted Explosions', value: 'BlackListedExplosions', type: "transferlist", tooltip: 'Select explosion types that should be blocked on your server.', values: explosionsList },
                { name: 'Anti Invisible Explosions', value: 'DetectInvisibleExplosions', type: "boolean", tooltip: 'Detects explosions with no visible effects used by cheaters to damage players or vehicles silently.' },
                { name: 'Anti Inaudible Explosions', value: 'DetectInaudibleExplosions', type: "boolean", tooltip: 'Identifies explosions with no sound effects used by cheaters for stealth attacks.' },
                { name: 'Enable Explosion Limiter', value: 'EnableExplosionsLimiter', type: "boolean", tooltip: 'Activates rate limiting for explosions to prevent mass explosion attacks.' },
                { name: 'Explosion Limit', value: 'ExplosionsLimitIn5Seconds', type: "number", tooltip: 'Maximum number of explosions a player can create within a 5-second window before triggering detection.' },
                { name: 'Cancel All Explosions', value: 'CancelAllExplosions', type: "boolean", tooltip: 'Completely prevents all explosions on the server. Players will not see or be affected by any explosions.' },
                { name: 'Cancel All Fires', value: 'CancelAllFires', type: "boolean", tooltip: 'Completely prevents all fire effects on the server. Players will not see or be affected by any fires.' },
                { name: 'Log Explosion Spawns (Console)', value: 'LogExplosionSpawnsToConsole', type: "boolean", tooltip: 'Records all explosion events to the server console for monitoring and debugging purposes.' },
            ],
        },
        "FX Particles Detections": {
            Icon: Flame,
            Data: [
                { name: 'AI Anti Particle', value: 'EnableParticlesAI', type: "boolean", tooltip: 'Advanced detection system for unauthorized particles without requiring manual whitelist configuration.' },
                { name: 'Enable Particle Whitelist', value: 'EnableParticlesWhiteList', type: "boolean", tooltip: 'Activates the particle whitelist system. Any particle not in the whitelist will trigger detection if spawned.' },
                { name: 'Whitelisted Particles', value: 'WhiteListedParticles', type: "list", placeholder: "veh_backfire, ...", tooltip: 'List of particle effects that are allowed on your server.' },
                { name: 'Anti Attached Particles', value: 'DetectParticlesAttachedToEntity', type: "boolean", tooltip: 'Detects particle effects attached to entities, often used for visual trolling or harassment.' },
                { name: 'Particle Scale Limit', value: 'MaxParticleScale', type: "number", tooltip: 'Maximum allowed scale for particle effects. Larger particles are often used to obscure vision or cause lag.' },
                { name: 'Log Particle Spawns (Console)', value: 'LogParticleSpawnsToConsole', type: "boolean", tooltip: 'Records all particle spawns to the server console for monitoring and debugging purposes.' },
            ],
        },
    },
    {
        "Premium": {
            Icon: Diamond,
            Data: [
                { name: 'Anti LUA Menu Rendering', value: 'BlockAllLuaModMenus', type: "boolean", tooltip: 'Prevents LUA mod menu interfaces from rendering, making them unusable even if successfully injected.' },
                { name: 'Anti Vehicle Control Request', value: 'AntiRequestControl', type: "boolean", tooltip: 'Prevents unauthorized network requests for control of vehicles owned by other players, blocking various vehicle exploits.' },
                { name: 'Anti Sound Exploits', value: 'AntiSoundExploits', type: "boolean", tooltip: 'Blocks malicious sound manipulations including ear rape attacks and unauthorized global sound broadcasts.' },
                { name: 'Anti Forced Ragdoll', value: 'AntiRagdollExploit', type: "boolean", tooltip: 'Prevents cheaters from forcing other players into ragdoll state, a common trolling tactic.' },
                { name: 'Anti Vehicle Bombing', value: 'AntiBombVehicles', type: "boolean", tooltip: 'Blocks new exploit methods that allow cheaters to remotely detonate or destroy all vehicles on the server.' },
            ],
        },
    },
    {
        "Beta": {
            Icon: TestTube,
            Data: [
                { name: 'Disable Aimbot Function', value: 'DisableAimBot', type: "boolean", tooltip: 'Renders most cheat-based aimbots ineffective by blocking the underlying game functions they rely on.' },
                { name: 'Anti Unisolated Injection', value: 'AntiUnisolatedInjection', type: "boolean", tooltip: 'Detects specific code injection patterns based on the executor type and method used.' },
                { name: 'Anti Silent Aim', value: 'AntiSilentAim', type: "boolean", tooltip: 'Identifies silent aim cheats that manipulate bullet trajectory or hit registration to hit targets regardless of actual aim.' },
                { name: 'Anti Magneto', value: 'AntiMagneto', type: "boolean", tooltip: 'Detects cheaters using "magneto" cheats to apply force to vehicles without physical contact.' },
                { name: 'Anti Vehicle Attachment', value: 'AntiAttachVehicles', type: "boolean", tooltip: 'Prevents cheaters from attaching vehicles to players, a common method of harassment and trolling.' },
            ],
        },
    },
    {
        "Discord Logs": {
            Icon: Bot,
            Data: [
                { name: 'Enable Discord Logging', value: 'EnableDiscordLogs', type: "boolean", tooltip: 'Activates the Discord webhook logging system for all WaveShield detections and events.' },
                { name: 'Show IP Addresses in Logs', value: 'ShowIpAddress', type: "boolean", tooltip: 'Includes player IP addresses in Discord logs. Disable if you have privacy concerns or legal restrictions.' },
                { name: 'Main Webhook URL', value: 'MainWebhook', type: "string", tooltip: 'Discord webhook URL where ban logs will be sent. This is the primary notification channel.' },
                { name: 'Entities Webhook URL', value: 'EntitiesWebhook', type: "string", tooltip: 'Discord webhook URL where entity spawn logs (vehicles, peds, objects) will be sent.' },
                { name: 'Explosions Webhook URL', value: 'ExplosionsWebhook', type: "string", tooltip: 'Discord webhook URL where explosion detection logs will be sent.' },
                { name: 'Weapons Webhook URL', value: 'WeaponsWebhook', type: "string", tooltip: 'Discord webhook URL where weapon-related detection logs will be sent.' },
                { name: 'Unbans Webhook URL', value: 'UnbansWebhook', type: "string", tooltip: 'Discord webhook URL where player unban notifications will be sent.' },
                { name: 'Connections Webhook URL', value: 'ConnectionsWebhook', type: "string", tooltip: 'Discord webhook URL where player connection and disconnection logs will be sent.' },
                { name: 'Screenshots Webhook URL', value: 'ScreenshotsWebhook', type: "string", tooltip: 'Discord webhook URL where screenshots will be uploaded. Required for displaying screenshots in other webhooks.' },
                { name: 'Community Logs Webhook URL', value: 'CommunityLogsWebhook', type: "string", tooltip: 'Discord webhook URL for simplified ban logs suitable for public channels, showing only reason and screenshot.' },
            ],
        },
        "Bans": {
            Icon: Ban,
            Data: [
                { name: 'Enable Ban System', value: 'EnableBans', type: "boolean", tooltip: 'Activates the ban system. When disabled, detected cheaters will only be kicked instead of banned.' },
                { name: 'Enable Gameplay Recording', value: 'EnableGameplayRecord', type: "boolean", tooltip: 'Captures a 10-second gameplay recording when a player is banned, providing additional evidence.' },
                { name: 'Enable Screenshot System', value: 'EnableScreenShots', type: "boolean", tooltip: 'Takes a screenshot when a player is banned. Requires screenshot-basic resource installed on your server.' },
                { name: 'Ban Duration (seconds)', value: 'BanDuration', type: "number", tooltip: 'Duration of bans in seconds. Set to 31536000 for 1 year, -1 for permanent bans.' },
                { name: 'Ban IP Address', value: 'BanIpAddress', type: "boolean", tooltip: 'Also bans the player\'s IP address in addition to their identifiers, making ban evasion more difficult.' },
                { name: 'Ban Message', value: 'BanMessage', type: "string", tooltip: 'Message shown to players when they are banned and disconnected from the server.' },
                { name: 'Log Bans to Discord', value: 'LogBansToConsole', type: "boolean", tooltip: 'Sends a notification to Discord when a player is banned from the server.' },
                { name: 'Log Unbans to Discord', value: 'LogUnbansToDiscord', type: "boolean", tooltip: 'Sends a notification to Discord when a player is unbanned from the server.' },
            ],
        },
        "Connections": {
            Icon: LogIn,
            Data: [
                { name: 'Log Connections to Discord', value: 'LogConnectionsToDiscord', type: "boolean", tooltip: 'Sends player connection and disconnection events to your Discord webhook.' },
                { name: 'Log Connections to Console', value: 'LogConnectionsToConsole', type: "boolean", tooltip: 'Records player connection and disconnection events to the server console.' },
                { name: 'Enable Connect Logs', value: 'LogOnConnect', type: "boolean", tooltip: 'Activates logging when players connect to the server.' },
                { name: 'Enable Disconnect Logs', value: 'LogOnDisconnect', type: "boolean", tooltip: 'Activates logging when players disconnect from the server.' },
                { name: 'Anti Connection Duplication', value: 'AntiConnectionDupe', type: "boolean", tooltip: 'Prevents players from connecting to your server with multiple FiveM clients simultaneously.' },
                { name: 'Anti XSS Injection', value: 'AntiXSSInjections', type: "boolean", tooltip: 'Blocks cross-site scripting attempts that load external scripts through NUI exploits.' },
                { name: 'Anti VPN', value: 'AntiVPN', type: "boolean", tooltip: 'Detects and blocks players connecting through VPNs or proxy services.' },
                { name: 'Require Discord Linked', value: 'RequireDiscord', type: "boolean", tooltip: 'Requires players to have their Discord account linked to FiveM to join your server.' },
                { name: 'Require Alphanumeric Name', value: 'RequireAlphanumericName', type: "boolean", tooltip: 'Restricts player names to alphanumeric characters only, blocking special characters that could cause issues.' },
            ],
        },
        "Server Security": {
            Icon: Lock,
            Data: [
                { name: 'Anti Backdoor', value: 'EnableAntiBackdoors', type: "boolean", tooltip: 'Scans your server resources for potential backdoors or malicious code and reports them.' },
                { name: 'Stop Server on Backdoor', value: 'StopServerWhenDetected', type: "boolean", tooltip: 'Automatically stops the server if a backdoor is detected to prevent exploitation.' },
            ],
        },
        "Other": {
            Icon: Link,
            Data: [
                { name: 'Command Prefix', value: 'CommandPrefix', type: "string", tooltip: 'Sets the prefix for all WaveShield commands.' },
                { name: 'Ignored Scripts', value: 'IgnoredScripts', type: "list", placeholder: "advanced_vehicles, ...", tooltip: 'List of scripts where WaveShield should not be installed. Only add scripts that are incompatible with WaveShield.' },
            ],
        },
    },
];
