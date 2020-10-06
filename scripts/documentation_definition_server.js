DOCUMENTATION_DEFINITION = (()=>{
    "use strict";

    const TO = DOCUMENTATION.TO
    const TF = DOCUMENTATION.TF
    const TV = DOCUMENTATION.TV
    const TA = DOCUMENTATION.TA
    const TE = DOCUMENTATION.TE

    const OBJECT_TYPE = {
        0: 'none',
        1: 'character',
        2: 'crate_small',
        3: 'collectable',
        4: 'basketball',
        5: 'television',
        6: 'barrel',
        7: 'schematic',
        8: 'debris',
        9: 'chair',
        10: 'trolley_food',
        11: 'trolley_med',
        12: 'clothing',
        13: 'office_chair',
        14: 'book',
        15: 'bottle',
        16: 'fryingpan',
        17: 'mug',
        18: 'saucepan',
        19: 'stool',
        20: 'telescope',
        21: 'log',
        22: 'bin',
        23: 'book_2',
        24: 'loot',
        25: 'blue_barrel',
        26: 'buoyancy_ring',
        27: 'container',
        28: 'gas_canister',
        29: 'pallet',
        30: 'storage_bin',
        31: 'fire_extinguisher',
        32: 'trolley_tool',
        33: 'cafetiere',
        34: 'drawers_tools',
        35: 'glass',
        36: 'microwave',
        37: 'plate',
        38: 'box_closed',
        39: 'box_open',
        40: 'desk_lamp',
        41: 'eraser_board',
        42: 'folder',
        43: 'funnel',
        44: 'lamp',
        45: 'microscope',
        46: 'notebook',
        47: 'pen_marker',
        48: 'pencil',
        49: 'scales',
        50: 'science_beaker',
        51: 'science_cylinder',
        52: 'science_flask',
        53: 'tub_1',
        54: 'tub_2',
        55: 'filestack',
        56: 'barrel_toxic',
        57: 'flare',
        58: 'fire',
        59: 'animal',
        60: 'map_label',
        61: 'iceberg',
        62: 'small_flare',
        63: 'big_flare'
    }

    const OUTFIT_TYPE = {
        0: 'none',
        1: 'worker',
        2: 'fishing',
        3: 'waiter',
        4: 'swimsuit',
        5: 'military',
        6: 'office',
        7: 'police',
        8: 'science',
        9: 'medical',
        10: 'wetsuit',
        11: 'civilian'
    }

    const POSITION_TYPE = {
        0: 'fixed',
        1: 'vehicle',
        2: 'object'
    }

    const NOTIFICATION_TYPE = {
        0: 'new_mission',
        1: 'new_mission_critical',
        2: 'failed_mission',
        3: 'failed_mission_critical',
        4: 'complete_mission',
        5: 'network_connect',
        6: 'network_disconnect',
        7: 'network_info',
        8: 'chat_message',
        9: 'network_info_critical'
    }

    const MARKER_TYPE = {
        0: 'delivery_target',
        1: 'survivor',
        2: 'object',
        3: 'waypoint',
        4: 'tutorial',
        5: 'fire',
        6: 'shark',
        7: 'ice',
        8: 'search_radius'
    }

    const LABEL_TYPE = {
        0: 'none',
        1: 'cross',
        2: 'wreckage',
        3: 'terminal',
        4: 'military',
        5: 'heritage',
        6: 'rig',
        7: 'industrial',
        8: 'hospital',
        9: 'science',
        10: 'airport',
        11: 'coastguard',
        12: 'lighthouse',
        13: 'fuel',
        14: 'fuel_sell'
    }

    const ZONE_TYPE = {
        0: 'box',
        1: 'sphere',
        2: 'radius'
    }

    const EQUIPMENT_ID = {
        0: 'none',
        1: 'diving',
        2: 'firefighter',
        3: 'scuba',
        4: 'parachute',
        5: 'arctic',        
        6: 'binoculars',
        7: 'cable',
        8: 'compass',
        9: 'defibrillator',
        10: 'fire_extinguisher',
        11: 'first_aid',
        12: 'flare',
        13: 'flaregun',
        14: 'flaregun_ammo',
        15: 'flashlight',
        16: 'hose',
        17: 'night_vision_binoculars',
        18: 'oxygen_mask',
        19: 'radio',
        20: 'radio_signal_locator',
        21: 'remote_control',
        22: 'rope',
        23: 'strobe_light',
        24: 'strobe_light_infrared',
        25: 'transponder',
        26: 'underwater_welding_torch',
        27: 'welding_torch'
    }


    const TYPE_STRING = {
        'zone': '',
        'object': '',
        'character': '',
        'vehicle': '',
        'flare': '',
        'fire': '',
        'loot': '',
        'button': '',
        'animal': '',
        'ice': '',
        'cargo_zone': ''
    }

    const GAME_SETTINGS = {
        'third_person': '',
        'third_person_vehicle': '',
        'vehicle_damage': '',
        'player_damage': '',
        'npc_damage': '',
        'sharks': '',
        'fast_travel': '',
        'teleport_vehicle': '',
        'rogue_mode': '',
        'auto_refuel': '',
        'megalodon': '',
        'map_show_players': '',
        'map_show_vehicles': '',
        'show_3d_waypoints': '',
        'show_name_plates': '',
        'day_night_length': 'number between 0-1, currently cannot be written to',
        'sunrise': 'currently cannot be written to',
        'sunset': 'currently cannot be written to',
        'infinite_money': '',
        'settings_menu': '',
        'unlock_all_islands': '',
        'infinite_batteries': '',
        'infinite_fuel': '',
        'engine_overheating': '',
        'no_clip': '',
        'map_teleport': '',
        'cleanup_veicle': '',
        'clear_fow': 'clear fog of war',
        'vehicle_spawning': '',
        'photo_mode': '',
        'respawning': '',
        'settings_menu_lock': '',
        'despawn_on_leave': 'despawn player characters on leave',
        'unlock_all_components': '',
    }

 



    const DEF = {
        children: {            
            onTick: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'game_ticks', help: 'ticks passed since last call of onTick. If the player is sleeping, this will be 400'}],
                description: 'Called everytime the game calculates a physics tick (~ 60 times per second)'
            },
            onCreate: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'is_world_create'}],
                description: 'Is called when the script is initialized.\nIf the script was initialized together with a new game, then is_world_create is true.\nIf the world was already running, or you loaded a savegame, it will be false.'
            },
            onDestroy: {
                type: TE,
                lib: 'stormworks',
                args: [],
                description: 'Is called whenever the world is exited (game closed).'
            },
            onCustomCommand: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'full_message'}, {name: 'user_peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}, {name: 'command', help: 'includes the ? at the beginning'}, {name: 'args ...', help: 'either you use the three dot operator "..." and then access them as a table "local args = table.pack(...)" or you manually add arguments (e.g. arg1, arg2, arg3)'}],
                description: 'Called when someone types "?" followed by some text in the chat.\nwhitespace splits appart the command and args: "?command arg1 arg2 arg3"'
            },
            onChatMessage: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'sender_name'}, {name: 'message'}],
                description: 'Called when someone sends a chat message. This is similar to "onCustomCommand".'
            },



            onPlayerJoin: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Caller when a player joins.'
            },
            onPlayerSit: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}, {name: 'vehicle_id'}, {name: 'seat_name'}],
                description: 'Called when a player enters a seat.'
            },
            onPlayerRespawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}],
                description: 'Called when a player respawns.'
            },
            onPlayerLeave: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Called when a player leaves the server.'
            },
            onToggleMap: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}, {name: 'is_open'}],
                description: 'Called when a player opens or closes the map.'
            },
            onPlayerDie: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Called when a player dies.'
            },
            onVehicleSpawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'Called when a vehicle is spawned in.'
            },
            onVehicleLoad: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}],
                description: ''
            },
            onVehicleTeleport: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'Called when a vehicle is teleported.'
            },
            onVehicleDespawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}],
                description: 'Called when a vehicle is despawned.'
            },
            onSpawnMissionObject: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'object_id'}, {name: 'name'}, {name: 'OBJECT_TYPE', possibleValues: invertKeysAndValues(OBJECT_TYPE)}, {name: 'playlist_name'}],
                description: ''
            },
            onVehicleDamaged: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'damage_amount', help: 'damage_amount will be negative if the component is repaired.'}, {name: 'voxel_x'}, {name: 'voxel_y'}, {name: 'voxel_z'}],
                description: ''
            },
            onFireExtinguished: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'xxxxxx'
            },
            httpReply: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'port'}, {name: 'url'}, {name: 'response_body'}],
                description: 'Called when async.httpGet() receives a server response. Port and url will be the values that you put into async.httpGet() as arguments.'
            },
            g_savedata: {
                type: TO,
                lib: 'stormworks',
                args: [],
                description: 'Globaly accessible table, that can be written to and read from. When the game closes, values from lua will be stored in the savegame XML.'
            },
            server: {
                type: TO,
                lib: 'stormworks',
                description: 'All the functionality for server scripts\n\npeer_id can be passed as -1 to send for all connected peers',
                children: {
                    getVideoTutorials: {
                        type: TF,
                        args: [],
                        description: 'Returns true when player has clicked on "Video Tutorials" in the menu already, false otherwise.'
                    },
                    getTutorial: {
                        type: TF,
                        args: [],
                        description: 'Returns true if tutorial is completed'
                    },
                    createPopup: {
                        type: TF,
                        bugs: 'Why is this here? Remove this thing please!',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: 'Creates a popup with the text "Test", spawned at 0,0. Can only be removed by calling removePopup() without passing a ui_id.'
                    },
                    setPopup: {
                        type: TF,
                        bugs: 'This functions creates a second (unwanted) popup at 0,0,0 that shows the value of the "name" argument.',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'name'}, {name: 'is_show'}, {name: 'text'}, {name: 'x'}, {name: 'y'}, {name: 'z'}, {name: 'is_worldspace'}, {name: 'render_distance'}],
                        description: ''
                    },
                    removePopup: {
                        type: TF,
                        bugs: 'when you ui_id is undefined, the second (unwanted) popup from setPopup is being removed.',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    getMapID: {
                        type: TF,
                        args: [],
                        description: 'Creates a new unique id that is required to create Map Objects.'
                    },
                    announce: {
                        type: TF,
                        args: [{name: 'name'}, {name: 'message'}],
                        description: ''
                    },
                    whisper: {
                        type: TF,
                        bugs: 'peer_id -1 is not working (even though it should send it to all)',
                        args: [{name: 'peer_id'}, {name: 'message'}],
                        description: 'Sends a chat message to only a specific player.'
                    },



                    addAdmin: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Assigns a player the admin role'
                    },
                    removeAdmin: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Revokes a players admin role'
                    },
                    addAuth: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Assigns a player the authenticated role'
                    },
                    removeAuth: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Revokes a players authenticated role'
                    },
                    notify: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'title'}, {name: 'message'}, {name: 'NOTIFICATION_TYPE', possibleValues: NOTIFICATION_TYPE}],
                        description: ''
                    },
                    removeMapID: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapObject: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'POSITION_TYPE', possibleValues: POSITION_TYPE}, {name: 'MARKER_TYPE', possibleValues: MARKER_TYPE}, {name: 'x'}, {name: 'y'}, {name: 'z'}, {name: 'parent_local_x'}, {name: 'parent_local_y'}, {name: 'parent_local_z'}, {name: 'vehicle_id'}, {name: 'object_id'}, {name: 'label'}, {name: 'vehicle_parent_id'}, {name: 'radius'}, {name: 'hover_label'}],
                        description: ''
                    },
                    removeMapObject: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapLabel: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'LABEL_TYPE', possibleValues: LABEL_TYPE}, {name: 'name'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                        description: ''
                    },
                    removeMapLabel: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapLine: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'start_matrix'}, {name: 'end_matrix'}, {name: 'width'}],
                        description: ''
                    },
                    removeMapLine: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    getPlayerName: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns name of the player'
                    },
                    getPlayers: {
                        type: TF,
                        args: [],
                        description: 'Returns list of all players' + '{ [peer_index] = {["id"] = peer_id, ["name"] = name, ["admin"] = is_admin, ["auth"] = is_auth}}'
                    },
                    getPlayerPos: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns a matrix'
                    },
                    teleportPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'matrix'}],
                        description: ''
                    },
                    killPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    setSeated: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'vehicle_id'}, {name: 'seat_name'}],
                        description: ''
                    },
                    getPlayerLookDirection: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns x,y,z of the players look direction'
                    },
                    spawnVehicle: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'component_id'}],
                        description: ''
                    },
                    spawnVehicleSavefile: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'save_name'}],
                        description: ''
                    },
                    despawnVehicle: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    getVehiclePos: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'voxel_x'}, {name: 'voxel_y'}, {name: 'voxel_z'}],
                        description: 'Returns position as a matrix'
                    },
                    getVehicleName: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: 'Returns name of the vehicle'
                    },
                    teleportVehicle: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'vehicle_id'}],
                        description: ''
                    },
                    cleanVehicles: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    pressVehicleButton: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'button_name'}],
                        description: ''
                    },
                    getVehicleFireCount: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: ''
                    },
                    setVehicleTooltip: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'text'}],
                        description: ''
                    },
                    getVehicleSimulating: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: ''
                    },
                    setVehicleTransponder: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_active'}],
                        description: ''
                    },
                    pressVehicleButton: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_editable'}],
                        description: ''
                    },
                    getPlaylistIndexByName: {
                        type: TF,
                        args: [{name: 'name'}],
                        description: ''
                    },
                    getPlaylistIndexCurrent: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    getLocationIndexByName: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'name'}],
                        description: ''
                    },
                    spawnThisPlaylistMissionLocation: {
                        type: TF,
                        args: [{name: 'name'}],
                        description: ''
                    },
                    spawnMissionLocation: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'location_index'}],
                        description: 'if matrix = 0,0,0 it will spawn at a random location'
                    },
                    getPlaylistPath: {
                        type: TF,
                        args: [{name: 'playlist_name'}, {name: 'is_rom'}],
                        description: ''
                    },
                    spawnObject: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'OBJECT_TYPE', possibleValues: OBJECT_TYPE}],
                        description: ''
                    },
                    getObjectPos: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns is_found, matrix'
                    },
                    spawnFire: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'size'}, {name: 'magnitude'}, {name: 'is_lit'}, {name: 'is_initialzied'}, {name: 'is_explosive'}, {name: 'parent_vehicle_id'}, {name: 'explosion_point'}, {name: 'explosion_magnitude'}],
                        description: 'Returns object_id'
                    },
                    despawnObject: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    spawnCharacter: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'outfit_id', optional: true}],
                        description: 'Returns object_id'
                    },
                    spawnAnimal: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'animal_type'}, {name: 'scale'}],
                        description: 'Returns object_id'
                    },
                    despawnCharacter: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    getCharacterData: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns hp, matrix'
                    },
                    setCharacterData: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'hp'}, {name: 'is_interactable'}],
                        description: ''
                    },
                    setCharacterItem: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'slot'}, {name: 'EQUIPMENT_ID', possibleValues: EQUIPMENT_ID}, {name: 'is_active'}],
                        description: ''
                    },
                    setTutorial: {
                        type: TF,
                        args: [{name: '?'}],
                        description: 'Can be used to set tutorial completed (not tested yet).'
                    },
                    getZones: {
                        type: TF,
                        args: [{name: 'tag(s)'}],
                        description: 'Returns ZONE_LIST: ' + '{ [zone_index] = { ["name"] = name,["transform"] = matrix,["size"] = {x, y, z},["radius"] = radius,["type"] = ZONE_TYPE ,["tags"] = { [i] = tag } }}'
                    },
                    isInZone: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'zone_name'}],
                        description: 'Returns is_in_zone'
                    },
                    spawnMissionObject: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'location_index'}, {name: 'object_index'}],
                        description: ''
                    },
                    despawnMissionObject: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    getPlaylistCount: {
                        type: TF,
                        args: [],
                        description: 'Returns count'
                    },
                    getPlaylistData: {
                        type: TF,
                        args: [{name: 'playlist_index'}],
                        description: 'Returns PLAYLIST_DATA: ' + '{ ["name"] = name, ["path_id"] = folder_path, ["file_store"] = is_app_data, ["location_count"] = location_count }'
                    },
                    getLocationData: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'location_index'}],
                        description: 'Returns LOCATION_DATA: ' + '{ ["name"] = name, ["tile"] = tile_filename, ["env_spawn_count"] = spawn_count, ["env_mod"] = is_env_mod, ["object_count"] = object_count }'
                    },
                    getLocationObjectData: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'location_index'}, {name: 'object_index'}],
                        description: 'Returns OBJECT_DATA: ' + '{ ["name"] = name, ["display_name"] = display_name, ["type"] = TYPE_STRING, ["id"] = component_id, ["dynamic_object_type"] = OBJECT_TYPE, ["tags"] = { [i] = tag }, ["transform"] = matrix, ["character_outfit_type"] = OUTFIT_TYPE }'
                    },
                    setFireData: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_lit'}, {name: 'is_explosive'}],
                        description: ''
                    },
                    getFireData: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns is_lit'
                    },
                    getOceanTransform: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'min_search_range'}, {name: 'max_search_range'}],
                        description: 'Returns matrix'
                    },
                    isInTransformArea: {
                        type: TF,
                        args: [{name: 'matrix_object'}, {name: 'matrix_zone'}, {name: 'zone_x'},{name: 'zone_y'}, {name: 'zone_z'}],
                        description: 'Returns is_in_area'
                    },
                    setGameSetting: {
                        type: TF,
                        args: [{name: 'GAME_SETTING', possibleValues: GAME_SETTINGS}, {name: 'value'}],
                        description: 'Some settings cannot be set: "day_night_length", "sunrise", "sunset"'
                    },
                    getGameSettings: {
                        type: TF,
                        args: [],
                        description: 'Returns a table with all the game settings (key = setting name, value = setting value)'
                    },
                    setCurrency: {
                        type: TF,
                        args: [{name: 'money'}, {name: 'research'}],
                        description: 'Sets the amount of money and research'
                    },
                    getCurrency: {
                        type: TF,
                        args: [],
                        description: 'Returns the amount of money'
                    },
                    getResearchPoints: {
                        type: TF,
                        args: [],
                        description: 'Returns the amount of research points'
                    },
                    getDateValue: {
                        type: TF,
                        args: [],
                        description: 'Returns time since game has started in ingame days'
                    },
                    getTimeMillisec: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    getTilePurchased: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        description: 'Returns is_purchased'
                    },
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'request'}],
                        description: 'Returns is_purchased'
                    },
                    banPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    kickPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    setVehicleEditable: {
                        type: TF,
                        args: [],
                        description: ''
                    }
                }
            },
            matrix: {
                type: TO,
                lib: 'stormworks',
                description: 'Helpful library to work with matrices',
                children: {
                    multiply: {
                        type: TF,
                        args: [{name: 'matrix1'}, {name: 'matrix2'}],
                        description: 'Multiplies two matrix'
                    },
                    invert: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        description: 'Inverts the matrix'
                    },
                    transpose: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        description: 'Transposes the matrix'
                    },
                    identity: {
                        type: TF,
                        args: [],
                        description: 'Returns the special identity matrix'
                    },
                    rotationX: {
                        type: TF,
                        args: [{name: 'radians'}],
                        description: 'Rotate a matrix around the x axis'
                    },
                    rotationY: {
                        type: TF,
                        args: [{name: 'radians'}],
                        description: 'Rotate a matrix around the y axis'
                    },
                    rotationZ: {
                        type: TF,
                        args: [{name: 'radians'}],
                        description: 'Rotate a matrix around the z axis'
                    },
                    translation: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'z'}],
                        description: 'Translate (~move) a matrix'
                    },
                    position: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        description: 'Returns x,y,z (x,y = map coordinates, z = altitude) values of the matrix'
                    },
                    distance: {
                        type: TF,
                        args: [{name: 'matrix1'}, {name: 'matrix2'}],
                        description: 'Translate (~move) a matrix'
                    }
                }
            },
            async: {
                type: TO,
                lib: 'stormworks',
                description: 'Execute HTTP requests.',
                children: {
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'url'}],
                        description: 'Creates a HTTP request to "http://localhost:[PORT][url]". If you call it more then once per tick, the request will be put into a queue, every tick one reqeust will be taken from that queue and executed.\n\nIMPORTANT:\nYou must follow these steps to enable http support in this Lua IDE:\nYour browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>'
                    }
                }
            },
            pairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'If table has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.\nOtherwise, returns three values: the next function, the table t, and nil, so that the construction\n     for k,v in pairs(t) do body end\nwill iterate over all key–value pairs of table t.\nSee function next for the caveats of modifying the table during its traversal.'
            },
            ipairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'Returns three values (an iterator function, the table t, and 0) so that the construction\nfor i,v in ipairs(t) do body end\nwill iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.'
            },
            next: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}, {name: 'index', optional: true}],
                description: 'Allows a program to traverse all fields of a table. Its first argument is a table and its second argument is an index in this table. next returns the next index of the table and its associated value. When called with nil as its second argument, next returns an initial index and its associated value. When called with the last index, or with nil in an empty table, next returns nil. If the second argument is absent, then it is interpreted as nil. In particular, you can use next(t) to check whether a table is empty.\nThe order in which the indices are enumerated is not specified, even for numeric indices. (To traverse a table in numerical order, use a numerical for.)\nThe behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table. You may however modify existing fields. In particular, you may clear existing fields.'
            },
            tostring: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'v'}],
                description: 'Receives a value of any type and converts it to a string in a human-readable format. (For complete control of how numbers are converted, use string.format.)\nIf the metatable of v has a __tostring field, then tostring calls the corresponding value with v as argument, and uses the result of the call as its result.'
            },
            tonumber: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'e'}, {name: 'base', optional: true}],
                description: 'When called with no base, tonumber tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, then tonumber returns this number; otherwise, it returns nil.\nThe conversion of strings can result in integers or floats, according to the lexical conventions of Lua (see §3.1). (The string may have leading and trailing spaces and a sign.)\nWhen called with base, then e must be a string to be interpreted as an integer numeral in that base. The base may be any integer between 2 and 36, inclusive. In bases above 10, the letter "A" (in either upper or lower case) represents 10, "B" represents 11, and so forth, with "Z" representing 35. If the string e is not a valid numeral in the given base, the function returns nil.'
            },
            math: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.7',
                description: 'This library provides basic mathematical functions. It provides all its functions and constants inside the table math. Functions with the annotation "integer/float" give integer results for integer arguments and float results for float (or mixed) arguments. Rounding functions (math.ceil, math.floor, and math.modf) return an integer when the result fits in the range of an integer, or a float otherwise.',
                children: {                    
                    abs: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the absolute value of x. (integer/float) '
                    },
                    acos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc cosine of x (in radians). '
                    },
                    asin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc sine of x (in radians). '
                    },
                    atan: {
                        type: TF,
                        args: [{name: 'y'}, {name: 'x', optional: true}],
                        description: ' Returns the arc tangent of y/x (in radians), but uses the signs of both arguments to find the quadrant of the result. (It also handles correctly the case of x being zero.)\nThe default value for x is 1, so that the call math.atan(y) returns the arc tangent of y.'
                    },
                    ceil: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the smallest integral value larger than or equal to x.'
                    },
                    cos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the cosine of x (assumed to be in radians).'
                    },
                    deg: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from radians to degrees.'
                    },
                    exp: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the value e raised to the power x (where e is the base of natural logarithms).'
                    },
                    floor: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the largest integral value smaller than or equal to x.'
                    },
                    fmod: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}],
                        description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero. (integer/float)'
                    },
                    huge: {
                        type: TF,
                        args: [],
                        description: 'The float value HUGE_VAL, a value larger than any other numeric value.'
                    },
                    log: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Inverse function of math.exp(x).'
                    },
                    max: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the maximum value, according to the Lua operator <. (integer/float)'
                    },
                    maxinteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the maximum value for an integer. '
                    },
                    min: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the minimum value, according to the Lua operator <. (integer/float)'
                    },
                    mininteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the minimum value for an integer. '
                    },
                    modf: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the integral part of x and the fractional part of x. Its second result is always a float.'
                    },
                    pi: {
                        type: TV,
                        description: 'The value of π.'
                    },
                    rad: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from degrees to radians.'
                    },
                    random: {
                        type: TF,
                        args: [{name: 'm', optional: true}, {name: 'n', optional: true}],
                        description: ' When called without arguments, returns a pseudo-random float with uniform distribution in the range [0,1). When called with two integers m and n, math.random returns a pseudo-random integer with uniform distribution in the range [m, n]. (The value n-m cannot be negative and must fit in a Lua integer.) The call math.random(n) is equivalent to math.random(1,n).\nThis function is an interface to the underling pseudo-random generator function provided by C.'
                    },
                    randomseed: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.'
                    },
                    sin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the sine of x (assumed to be in radians).'
                    },
                    sqrt: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)'
                    },
                    tan: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the tangent of x (assumed to be in radians).'
                    },
                    tointeger: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'If the value x is convertible to an integer, returns that integer. Otherwise, returns nil.'
                    },
                    type: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns "integer" if x is an integer, "float" if it is a float, or nil if x is not a number.'
                    },
                    ult: {
                        type: TF,
                        args: [{name: 'm'}, {name: 'n'}],
                        description: 'Returns a boolean, true if and only if integer m is below integer n when they are compared as unsigned integers.'
                    }
                }
            },
            table: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.6',
                description: ' This library provides generic functions for table manipulation. It provides all its functions inside the table table.\nRemember that, whenever an operation needs the length of a table, all caveats about the length operator apply (see §3.4.7). All functions ignore non-numeric keys in the tables given as arguments.',
                children: {
                    concat: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'sep', optional: true}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ··· sep..list[j]. The default value for sep is the empty string, the default for i is 1, and the default for j is #list. If i is greater than j, returns the empty string.'
                    },
                    insert: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}, {name: 'value'}],
                        description: 'Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ···, list[#list]. The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.'
                    },
                    move: {
                        type: TF,
                        args: [{name: 'a1'}, {name: 'f'}, {name: 'e'}, {name: 't'}, {name: 'a2', optional: true}],
                        description: ' Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment: a2[t],··· = a1[f],···,a1[e]. The default for a2 is a1. The destination range can overlap with the source range. The number of elements to be moved must fit in a Lua integer.\nReturns the destination table a2.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments. Note that the resulting table may not be a sequence.'
                    },
                    remove: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}],
                        description: ' Removes from list the element at position pos, returning the value of the removed element. When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ···, list[#list] and erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1; in those cases, the function erases the element list[pos].\nThe default value for pos is #list, so that a call table.remove(l) removes the last element of list l.'
                    },
                    sort: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'comp', optional: true}],
                        description: ' Sorts list elements in a given order, in-place, from list[1] to list[#list]. If comp is given, then it must be a function that receives two list elements and returns true when the first element must come before the second in the final order (so that, after the sort, i < j implies not comp(list[j],list[i])). If comp is not given, then the standard Lua operator < is used instead.\nNote that the comp function must define a strict partial order over the elements in the list; that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.\nThe sort algorithm is not stable: elements considered equal by the given order may have their relative positions changed by the sort.'
                    },
                    unpack: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: ' Returns the elements from the given list. This function is equivalent to\n    return list[i], list[i+1], ···, list[j]\nBy default, i is 1 and j is #list.'
                    }
                }
            },
            type: {
                type: TF,
                lib: 'lua',
                description: 'Returns a string, which is the type of the supplied argument:\n"nil"\n"number"\n"string"\n"boolean"\n"table"\n"function"\n"thread"\n"userdata"',
                args: [{name: 'v'}]
            },
            string: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.4',
                description: ' This library provides generic functions for string manipulation, such as finding and extracting substrings, and pattern matching. When indexing a string in Lua, the first character is at position 1 (not at 0, as in C). Indices are allowed to be negative and are interpreted as indexing backwards, from the end of the string. Thus, the last character is at position -1, and so on.\nThe string library assumes one-byte character encodings.',
                children: {
                    byte: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default value for i is 1; the default value for j is i. These indices are corrected following the same rules of function string.sub.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    char: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Receives zero or more integers. Returns a string with length equal to the number of arguments, in which each character has the internal numeric code equal to its corresponding argument.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    dump: {
                        type: TF,
                        args: [{name: 'function'}, {name: 'strip', optional: true}],
                        description: ' Returns a string containing a binary representation (a binary chunk) of the given function, so that a later load on this string returns a copy of the function (but with new upvalues). If strip is a true value, the binary representation may not include all debug information about the function, to save space.\nFunctions with upvalues have only their number of upvalues saved. When (re)loaded, those upvalues receive fresh instances containing nil. (You can use the debug library to serialize and reload the upvalues of a function in a way adequate to your needs.)'
                    },
                    find: {
                        type: TF,
                        args: [{name: 's'}, {name: 'patter'}, {name: 'init', optional: true}, {name: 'plain', optional: true}],
                        description: ' Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns the indices of s where this occurrence starts and ends; otherwise, it returns nil. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative. A value of true as a fourth, optional argument plain turns off the pattern matching facilities, so the function does a plain "find substring" operation, with no characters in pattern being considered magic. Note that if plain is given, then init must be given as well.\nIf the pattern has captures, then in a successful match the captured values are also returned, after the two indices.'
                    },
                    format: {
                        type: TF,
                        args: [{name: 'formatstring'}, {name: '···'}],
                        description: ' Returns a formatted version of its variable number of arguments following the description given in its first argument (which must be a string). The format string follows the same rules as the ISO C function sprintf. The only differences are that the options/modifiers *, h, L, l, n, and p are not supported and that there is an extra option, q.\nThe q option formats a string between double quotes, using escape sequences when necessary to ensure that it can safely be read back by the Lua interpreter. For instance, the call\n     string.format("%q", "a string with "quotes" and \n new line")\nmay produce the string:\n     "a string with \"quotes\" and \\n      new line"\nOptions A, a, E, e, f, G, and g all expect a number as argument. Options c, d, i, o, u, X, and x expect an integer. When Lua is compiled with a C89 compiler, options A and a (hexadecimal floats) do not support any modifier (flags, width, length).\nOption s expects a string; if its argument is not a string, it is converted to one following the same rules of tostring. If the option has any modifier (flags, width, length), the string argument should not contain embedded zeros.'
                    },
                    gmatch: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}],
                        description: 'Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1) over the string s. If pattern specifies no captures, then the whole match is produced in each call.\nAs an example, the following loop will iterate over all the words from string s, printing one per line:\n     s = "hello world from Lua"\n     for w in string.gmatch(s, "%a+") do\n       print(w)\n     end\nThe next example collects all pairs key=value from the given string into a table:\n     t = {}\n     s = "from=world, to=Lua"\n     for k, v in string.gmatch(s, "(%w+)=(%w+)") do\n       t[k] = v\n     end\nFor this function, a caret "^" at the start of a pattern does not work as an anchor, as this would prevent the iteration.'
                    },
                    gsub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'repl'}, {name: 'n', optional: true}],
                        description: '\nReturns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1) have been replaced by a replacement string specified by repl, which can be a string, a table, or a function. gsub also returns, as its second value, the total number of matches that occurred. The name gsub comes from Global SUBstitution.\nIf repl is a string, then its value is used for replacement. The character % works as an escape character: any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring. The sequence %0 stands for the whole match. The sequence %% stands for a single %.\nIf repl is a table, then the table is queried for every match, using the first capture as the key.\nIf repl is a function, then this function is called every time a match occurs, with all captured substrings passed as arguments, in order.\nIn any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.\nIf the value returned by the table query or by the function call is a string or a number, then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement (that is, the original match is kept in the string).'
                    },
                    len: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns its length. The empty string "" has length 0. Embedded zeros are counted, so "a\\000bc\\000" has length 5.'
                    },
                    lower: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all uppercase letters changed to lowercase. All other characters are left unchanged. The definition of what an uppercase letter is depends on the current locale.'
                    },
                    match: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'init', optional: true}],
                        description: 'Looks for the first match of pattern (see §6.4.1) in the string s. If it finds one, then match returns the captures from the pattern; otherwise it returns nil. If pattern specifies no captures, then the whole match is returned. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 'v1'}, {name: 'v2'}, {name: '···'}],
                        description: 'Returns a binary string containing the values v1, v2, etc. packed (that is, serialized in binary form) according to the format string fmt (see §6.4.2).'
                    },
                    packsize: {
                        type: TF,
                        args: [{name: 'fmt'}],
                        description: 'Returns the size of a string resulting from string.pack with the given format. The format string cannot have the variable-length options "s" or "z" (see §6.4.2).'
                    },
                    rep: {
                        type: TF,
                        args: [{name: 's'}, {name: 'n'}, {name: 'sep', optional: true}],
                        description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep. The default value for sep is the empty string (that is, no separator). Returns the empty string if n is not positive.\n(Note that it is very easy to exhaust the memory of your machine with a single call to this function.)'
                    }, 
                    reverse: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Returns a string that is the string s reversed.'
                    }, 
                    sub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i'}, {name: 'j', optional: true}],
                        description: 'Returns the substring of s that starts at i and continues until j; i and j can be negative. If j is absent, then it is assumed to be equal to -1 (which is the same as the string length). In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i) (for a positive i) returns a suffix of s with length i.\nIf, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than the string length, it is corrected to that length. If, after these corrections, i is greater than j, the function returns the empty string. '
                    }, 
                    unpack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 's'}, {name: 'pos', optional: true}],
                        description: 'Returns the values packed in string s (see string.pack) according to the format string fmt (see §6.4.2). An optional pos marks where to start reading in s (default is 1). After the read values, this function also returns the index of the first unread byte in s.'
                    }, 
                    upper: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all lowercase letters changed to uppercase. All other characters are left unchanged. The definition of what a lowercase letter is depends on the current locale.'
                    }  
                }
            }
        }
    }

    /*
        returns a new object {value1: key1, value2: key2}
        if values are not unique, the keys might be overriden!!
    */
    function invertKeysAndValues(obj){
        let ret = {}
        for(let k of Object.keys(obj)){
            ret[obj[k]] = k
        }

        return ret
    }

    return DEF
    
})()