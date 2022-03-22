# VSCode Python Config

Creates all needed config files for Python projects.  

Following files will be created in the local .vscode folder:

- settings.json: Best default settings for Python related extensions
- launch.json: Debug config to debug the current python file
- tasks.json: Task to run the current python file

Following files will be created in the root directory:

- .editorconfig: Standard file settings (line-feed, insert new-line, etc.)
- .gitattributes: Gives attributes to pathnames
- .gitingore: Specifies intentionally untracked files to ignore
- .pre-commit-config.yaml: Tools to run on every git commit
- pyproject.toml: Settings for the black formatter
- requirements-dev.txt: List of tools to install
- setup.cfg: Settings for isort, flake8, mypy and pylint

**Note**: If one of these files already exists, they won't be overridden.

## How to use

Just run the command 'Generate Python Config Files' in VSCode's command palette.

## Release Notes

Refer to the [CHANGELOG](CHANGELOG.md).

## License

Copyright (C) 2022 Jan Schaffranek.  
Licensed under the [MIT License](LICENSE).
