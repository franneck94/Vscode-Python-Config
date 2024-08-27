# VSCode Python Config

Creates config files with pre-defined settings for modern Python projects in your VSCode *workspace*.  

Files in the workspace's .vscode folder:

- settings.json: Best settings for Python-related extensions
- launch.json: Configurations for debugging your python projects
- tasks.json: Tasks to execute your python projects

Python-specific files in the root directory for any workspace:

- .pre-commit-config.yaml: Tools to run on every git commit
- pyproject.toml: General settings for the linters and formatters
- requirements-dev.txt: Python packages to install for developers (linter, testing etc.)
- requirements.txt: Python packages to install for users (starts as an empty file)

General IDE Files in the root directory (*):

- .editorconfig: Standard file settings (line-feed, insert new-line, etc.)
- .gitattributes: Gives attributes to pathnames
- .gitignore: Specifies intentionally untracked files to ignore

Files for python projects (has a project defined in pyproject.toml or setup.py/cfg) (*):

- .github/workflows/codeql-analysis.yaml
- .github/workflows/documentation.yaml
- .github/workflows/pre-commit.yaml
- .github/workflows/publish.yaml
- .github/workflows/test.yaml
- docs/index.md
- docs/api.md
- LICENSE
- mkdocs.yaml
- README.md

(*): These files are not overridden, if already existing.

## How to use

Just run the command 'Generate Python Config Files' in VSCode's command palette.

## Settings

- ⚙️ Line Length: Max. line length for the tools (defaults to 120, Global Setting)
- ⚙️ Is Aggressive: If set to true, mypy, ruff and others will have activated most of its features (defaults to false, Global Setting)
- ⚙️ Python Target Version: Various tools has some features based on the "minimal" python version for that project (defaults to 3.10, Global Setting)
- ⚙️ Formatting tool: The python formatter that should be used, its either
  - ruff format (Default)
  - black

## Release Notes

Refer to the [CHANGELOG](CHANGELOG.md).

## License

Copyright (C) 2021-2024 Jan Schaffranek.  
Licensed under the [MIT License](LICENSE).

## Supporting the Work

Feel free to donate, such that I have more time to work on my VSCode extension*s*.

![PayPal QR Code](./media/QR-Code.png)

Or use the Link: <https://www.paypal.com/donate/?hosted_button_id=3WDK6ET99ZQCU>
