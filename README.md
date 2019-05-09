# Bushy Packs

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/23c9f9619fca4d1193ed51767f614aa9)](https://app.codacy.com/app/busheezy/bushy-packs?utm_source=github.com&utm_medium=referral&utm_content=busheezy/bushy-packs&utm_campaign=Badge_Grade_Dashboard)

Bushy Packs is something I created because I wanted to git version control my game servers but I didn't want a single massive repo. Using a config that is specified on git, Bushy Packs will download a list of repos and execute each pack in order. Bushy Packs utilizes handlebars.js to allow templating your config files.

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
  -m, --mod <mod>        The mod you are using. (cstring|csgo) (default: "csgo")
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

The merge folder is the main way you will merge files/folders into your game server directory. The merge folder will overwrite files/folders without question.

### sh/init.sh

This shell file is executed and has access to all of our variables.

### scripting

Any .sp file in this folder is compiled with sourcemod. You need to have sourcemod already installed to be able to compile.

### delete.txt

Example:

```txt
/csgo/addons/sourcemod/plugins/funvotes.smx
```

This is a list of files/folders that you can specify which you want deleted.

### post-merge/

This is the same as merge but it runs after all other tasks.
