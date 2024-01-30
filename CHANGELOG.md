# Python Config Change Log

## Version 8.4.0: Jan 30, 2024

- **Info**: Bumped some version
- **Info**: Updated .gitignore
- **Info**: Removed some ruff ignores in strict mode

## Version 8.3.0: Jan 14, 2024

- **Info**: Added defaultFormatter for toml files in settings.json

## Version 8.2.0: Jan 14, 2024

- **Info**: Added ipympl

## Version 8.1.0: Jan 12, 2024

- **Info**: Bumped some version

## Version 8.0.0: Jan 12, 2024

- **Info**: Ruff Format is now the Default

## Version 7.4.0: Jan 12, 2024

- **Info**: Bumped some version

## Version 7.3.0: Jan 03, 2024

- **Info**: Bumped some version

## Version 7.2.0: Dec 23, 2023

- **Info**: Bumped some version

## Version 7.1.1: Dec 14, 2023

- **Info**: Bug fix for ruff

## Version 7.1.0: Dec 14, 2023

- **Info**: Bumped some version

## Version 7.0.0: Dec 09, 2023

- **Info**: Remmoved cython-lint from pre-commit
- **Info**: Changed "notebook.formatOnSave.enabled" to false per default and to true in aggressive mode
- **Info**: Bumped some version

## Version 6.6.0: Dec 06, 2023

- **Info**: Bumped some version

## Version 6.5.0: Dec 05, 2023

- **Info**: Add "TRIO" for ruff in aggressive mode
- **Info**: Fix mypy's exclude for the pre-commit hook

## Version 6.4.0: Nov 27, 2023

- **Info**: Bumped some version

## Version 6.3.0: Nov 20, 2023

- **Info**: Added tox, ipython and ipykernel
- **Info**: Bumped mypy, ruff, pyright, mkdocs
- **Info**: Removed mypy pre-commti hook for jupyter notebook
- **Info**: Added exclude field for pyright in pyproject.toml
- **Info**: Removed mypy strict flag for decorators
- **Info**: Added the option for ruff-format on jupyter files

## Version 6.2.0: Nov 15, 2023

- **Info**: Bumped some version

## Version 6.1.0: Nov 10, 2023

- **Info**: Removed excludes from pre-commit file, the tools should use the exclude from the pyproject.toml
- **Info**: Activated some checks in aggressive mode
- **Info**: Removed some checks in non-aggressive mode

## Version 6.0.0: Nov 09, 2023

- **Info**: Bumped versions
- **Info**: Added more checks for aggressive ruff
- **Info**: Dropped autopep8 formatter
- **Info**: Added ruff formatter as an option

## Version 5.0.0: Nov 06, 2023

- **Info**: Bumped versions
- **Info**: Dropped Python 3.7 support, support ist 3.8-3.12

## Version 4.9.0: Nov 02, 2023

- **Info**: Added Python 3.12 as a Version
- **Info**: Python 3.10 is now the default Version
- **Info**: Updated pre-commit file
- **Info**: Updated settings.json file
- **Info**: Bumped versions in requirements file

## Version 4.8.0: Oct 29, 2023

- **Info**: Updated isort config

## Version 4.7.0: Oct 27, 2023

- **Info**: Added frist draft for ruff format

## Version 4.6.0: Oct 27, 2023

- **Info**: Added 3rd party libs for isort

## Version 4.5.0: Oct 26, 2023

- **Info**: Updated versions

## Version 4.4.0: Sep 05, 2023

- **Info**: Updated docs
- **Info**: Updated versions

## Version 4.3.0: Aug 08, 2023

- **Info**: Bumped ruff, pylance, mkdocs
- **Info**: Added settings for new MS python extensions

## Version 4.2.3: Jul 25, 2023

- **Info**: Bumped black
- **Info**: Bumped ruff

## Version 4.2.2: Jul 11, 2023

- **Info**: Added donation link
- **Info**: Bumped black

## Version 4.2.1: Jul 7, 2023

- **Info**: Updated ruff settings

## Version 4.2.0: Jul 7, 2023

- **Info**: Added ruff-pylint settings

## Version 4.1.0: Jul 7, 2023

- **Info**: Added more ruff checks in aggressive and non-aggressive mode

## Version 4.0.1: Jul 6, 2023

- **Info**: Updated README

## Version 4.0.0: Jul 6, 2023

- **Info**: Updated some versions
- **Info**: Added "formatter" setting to choose either "black" or "autopep8"

## Version 3.10.0: Jun 15, 2023

- **Info**: Updated some settings and versions

## Version 3.9.0: May 25, 2023

- **Info**: Updated python settings, added some pypi packages

## Version 3.8.0: May 25, 2023

- **Info**: Updated python settings, added pyright config
- **Info**: Added pythonVersion setting

## Version 3.7.0: May 22, 2023

- **Info**: Updated autoDocstring settings

## Version 3.6.0: May 10, 2023

- **Info**: Updated ruff
- **Info**: Added error message when the user wants to generate the config files without having any folder opened (500iq move)

## Version 3.5.0: May 4, 2023

- **Info**: Added new VSCode 1.78 Feature

## Version 3.4.0: May 3, 2023

- **Info**: Updated some settings

## Version 3.3.0: April 27, 2023

- **Info**: Updated some settings

## Version 3.2.0: April 25, 2023

- **Info**: Updated some settings

## Version 3.1.0: April 24, 2023

- **Info**: Ruff's pre-commit fix is only active on agressive mode

## Version 3.0.0: April 24, 2023

- **Info**: Removed flake8, we only use ruff from now on

## Version 2.0.2: April 23, 2023

- **Info**: Updated some settings

## Version 2.0.1: April 22, 2023

- **Info**: Updated some settings, now im finished :)

## Version 2.0.0: April 22, 2023

- **Info**: Removed autopep8, just use black and ruff
- **Info**: Added new setting "aggressiveSettings", if set to true, mypy and ruff will have activated most of its features without ignoring
- **Info**: Updated some settings

## Version 1.18.3: April 21, 2023

- **Info**: Removed pylint, rather use ruff

## Version 1.18.2: April 21, 2023

- **Info**: Updated some settings

## Version 1.18.1: April 21, 2023

- **Info**: Updated some settings

## Version 1.18.0: April 21, 2023

- **Info**: Added the Line Length setting
  - Max. line length for the tools (defaults to 120, Global Setting)
  - Also for the Vertical Editor Ruler

## Version 1.17.0: April 15, 2023

- **Info**: Updated pre-commit

## Version 1.16.0: April 15, 2023

- **Info**: Updated isort settings

## Version 1.15.0: April 15, 2023

- **Info**: Updated launch/tasks file

## Version 1.14.0: April 14, 2023

- **Info**: Updated settings

## Version 1.13.0: March 17, 2023

- **Info**: Updated settings

## Version 1.12.0: February 28, 2023

- **Info**: Updated settings

## Version 1.11.1: December 15, 2022

- **Info**: Added matplotlib setting for jupyter

## Version 1.11.0: December 13, 2022

- **Info**: Updated pre-commit config

## Version 1.10.0: December 5, 2022

- **Info**: Updated pre-commit config

## Version 1.9.1: November 19, 2022

- **Info**: Updated some settings

## Version 1.9.0: November 1, 2022

- **Info**: Updated settings

## Version 1.8.1: May 21, 2022

- **Info**: Fixed cython issue

## Version 1.8.0: May 17, 2022

- **Info**: Updated pre_commit entries
- **Info**: Only create **requirements-dev.txt** if no **requirements.txt** is present

## Version 1.7.0: April 26, 2022

- **Info**: Updated tasks.json file

## Version 1.6.0: March 27, 2022

- **Info**: Updated black settings

## Version 1.5.0: March 22, 2022

- **Info**: Updated settings and templates

## Version 1.4.1: January 11, 2022

- **Bugfix**: Added try/catch for issues with creating .vscode folder.

## Version 1.4.0: December 16, 2021

- **Info**: Updated settings

## Version 1.3.0: December 01, 2021

- **Info**: Updated Markdown Render Mode

## Version 1.2.0: November 29, 2021

- **Info**: Updated mypy settings

## Version 1.1.1: November 24, 2021

- **Info**: Removed unused dependency

## Version 1.1.0: November 22, 2021

- **Info**: Added pyproject.toml for black configuration
- **Info**: Updated git ignore

## Version 1.0.1: November 12, 2021

- **Info**: Fixed issue with extension commands

## Version 1.0.0: November 6, 2021

- **Info**: Re-triggering the command will now overwrite the config files

## Version 0.2.0: September 26, 2021

- **Improvement**: Added **.gitattributes** and **.gitingore**

## Version 0.1.0: September 25, 2021

- **Info**: First release
