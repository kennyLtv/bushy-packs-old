# Bushy Packs

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/23c9f9619fca4d1193ed51767f614aa9)](https://app.codacy.com/app/busheezy/bushy-packs?utm_source=github.com&utm_medium=referral&utm_content=busheezy/bushy-packs&utm_campaign=Badge_Grade_Dashboard)

Bushy Packs is something I created because I wanted to git version control my game servers but I didn't want a single massive repo. Using a config that is specified on git, Bushy Packs will download a list of repos and execute each pack in order. Bushy Packs utilizes handlebars.js to allow templating your config files.

- [Bushy Packs](#bushy-packs)
  - [Requirements](#requirements)
  - [Install](#install)
  - [CLI Usage](#cli-usage)
  - [Pack Structure](#pack-structure)
    - [merge/](#merge)
    - [sh/init.sh](#shinitsh)
    - [scripting/](#scripting)
    - [delete.txt](#deletetxt)
    - [post-merge/](#post-merge)
  - [Server Config](#server-config)
  - [Variables](#variables)
    - [Convenience Variables](#convenience-variables)
    - [dir (bp_dir)](#dir-bp_dir)
    - [modDir (bp_modDir)](#moddir-bp_moddir)
    - [Example](#example)

## Requirements

You will need node.js with build-essentials. I have been using node v10.15.0 because one of our dependencies, nodegit, has prebuilt binaries.

## Install

```bash
npm i -g @bushy-packs/bushy-packs
```

## CLI Usage

```txt
bp [options] --dir <dir> --config <config> --preset <preset>

Options:
  -V, --version          output the version number
  -m, --mod <mod>        The mod you are using. (cstrike|csgo) (default: "csgo")
  -c, --config <config>  The repo that holds your config.
  -d, --dir <dir>        The directory that holds your mod directory.
  -k, --key <key>        The name of the key in your .ssh folder. (default: "id_rsa")
  -p, --preset <preset>  The preset within your config
  -r, --repo <repo>      A specific repo if you only want to install one.
  -b, --bitbucket        Use this if you are on bitbucket
  -h, --help             output usage information
```

## Pack Structure

A pack is a repo with specific folder and file structure. By placing files and folders in your repo with specific naming, Bushy Packs will run tasks which compile a server in the end. The folder/file tasks run in the same order as below.

### merge/

The merge folder is the main way you will merge files/folders into your game server directory. The merge folder will overwrite files/folders without question. Files that have .bp before their extension will be processed through handlebars. All variables are available as bp_variable. By adding .bpm before an extension, Bushy Packs will merge the files as if they are valve key value configs. This is useful for merging databases.cfg together.

### sh/init.sh

This shell file is executed and has access to all of our variables.

### scripting/

Any .sp file in this folder is compiled with sourcemod. You need to have sourcemod already installed to be able to compile. I use the merge folder to move any of my dependencies'.

### delete.txt

Example:

```txt
/csgo/addons/sourcemod/plugins/funvotes.smx
```

This is a list of files/folders that you can specify which you want deleted.

### post-merge/

This is the same as merge but it runs after all other tasks.

## Server Config

A server config should be a repo with config.json in the root directory.

## Variables

Global variables are available to all servers within the preset.
Global variables that start with "_" will be merged with the child variables.
The child variable will be inserted into the %s inside the global. Look at the example below.

Variables are always prepended with "bp_" to prevent issues. You can use variables within your handlebars and within your init.sh bash file.

### Convenience Variables

Bushy Packs provided you a couple of variables for convenience.

### dir (bp_dir)

This is the directory that you specified with --dir.

### modDir (bp_modDir)

This is the mod directory. (dir/\<your mod\>)

### Example

```json
{
  "presets": [
    {
      "name": "kz",
      "repos": [
        "tarikgg/bp-metamod",
        "tarikgg/bp-metamod-csgo-vdf",
        "tarikgg/bp-sourcemod"
      ],
      "globals": {
        "_tags": "tarikgg,tarik,128 tick,128,tick,128tick,kz,%s",
        "sm_afk_kick_time": 900.0,
        "sm_afk_kick_warn_time": 840.0,
        "ad_timer_time": "120",
        "kz": true
      },
      "servers": {
        "chi.kz": {
          "hostName": "Tarik.GG KZ [Chicago]",
          "rconPassword": "example",
          "region": 0,
          "sbid": 7,
          "tags": "chicago",
          "kzApiKey": "",
          "location": "Chicago"
        },
        "nyc.kz": {
          "hostName": "Tarik.GG KZ 2 [NYC]",
          "rconPassword": "example",
          "region": 0,
          "sbid": 14,
          "tags": "nyc",
          "kzApiKey": "",
          "location": "New York City"
        }
      }
    }
  ]
}
```

The usable variables for chi.kz would be:

| Name                     | Value                                              |
|--------------------------|----------------------------------------------------|
| bp_tags                  | tarikgg,tarik,128 tick,128,tick,128tick,kz,chicago |
| bp_sm_afk_kick_time      | 900.0                                              |
| bp_sm_afk_kick_warn_time | 840.0                                              |
| bp_ad_timer_time         | 120                                                |
| bp_kz                    | true                                               |
| bp_hostName              | Tarik.GG                                           |
| bp_rconPassword          | example                                            |
| bp_region                | 0                                                  |
| ...                      | ...                                                |
