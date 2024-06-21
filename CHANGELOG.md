# Python Config Change Log

## Version 11.17.0: Jun 21, 2024

- **Info**: Bumped versions

## Version 11.16.0: May 27, 2024

- **Info**: Bumped versions
- **Info**: Added bump script for easier updates of this extension

## Version 11.15.0: May 18, 2024

- **Info**: Bumped versions

## Version 11.14.0: April 29, 2024

- **Info**: Bumped versions

## Version 11.13.0: April 05, 2024

- **Info**: Bumped versions

## Version 11.12.0: April 05, 2024

- **Info**: Bumped versions

## Version 11.11.0: Mar 10, 2024

- **Info**: Bumped versions

## Version 11.10.0: Mar 02, 2024

- **Info**: Bumped versions

## Version 11.9.0: Feb 19, 2024

- **Info**: Bumped versions

## Version 11.8.0: Feb 16, 2024

- **Info**: Bugfix for docs/doc dir

## Version 11.7.0: Feb 16, 2024

- **Info**: Bugfix for project name logic

## Version 11.6.0: Feb 16, 2024

- **Info**: Don't create mkdocs.yaml if there is a sphinx project
- **Info**: Don't create README.md if there is a README.rst

## Version 11.5.0: Feb 15, 2024

- **Info**: Get project name from pyproject.toml
- **Info**: Don't overwrite project specific files

## Version 11.4.0: Feb 14, 2024

- **Info**: Added Project related files (github workflows, LICENSE etc.) for workspaces with python project definition in pyproject.toml file

## Version 11.3.0: Feb 13, 2024

- **Info**: Updated versions
- **Info**: Updated ruff exclude (aggressive mode)

## Version 11.2.0: Feb 13, 2024

- **Info**: Merge requirements.txt
- **Bug**: Fixes Formatting in pyproject.toml

## Version 11.1.2: Feb 12, 2024

- **Info**: TOML Lib Bug Fix

## Version 11.1.1: Feb 12, 2024

- **Info**: TOML Lib Bug Fix

## Version 11.1.0: Feb 11, 2024

- **Info**: Fixed layout for ruff settings in pyproject.toml
- **Info**: Bumped versions

## Version 11.0.1: Feb 11, 2024

- **Info**: Updated README regarding file overwriting

## Version 11.0.0: Feb 11, 2024

- **Info**: Merge Existing pyproject.toml with template data, to not lose \[project\] keys

## Version 10.0.1: Feb 10, 2024

- **Info**: Add requirements.txt to the list of created files in the README

## Version 10.0.0: Feb 08, 2024

- **Info**: General root dir files are not overridden anymore

## Version 9.2.0: Feb 4, 2024

- **Info**: For launch.json and tasks.json, additional tasks or configs are no more deleted. For now, the settings.json file is still completely overridden

## Version 9.1.0: Feb 4, 2024

- **Info**: Set ruff's fixable to "ALL" instead of a long list
- **Info**: Added some *tool.ruff.lint.pylint* settings

## Version 9.0.0: Feb 3, 2024

- **Info**: Updated launch.json target from "python" to "debugpy"
- **Info**: Added creation of *requirements.txt* with recursive *requirements-dev.txt*, but only if *requirements.txt* is not already present
- **Info**: Updated to ruff 0.2.0, also updated ruff toml setting names

## Version 8.4.0: Jan 30, 2024

- **Info**: Bumped some version
- **Info**: Updated .gitignore
- **Info**: Removed some ruff ignores in strict mode
- **Info**: Removed ipympl

## Version 8.3.0: Jan 14, 2024

- **Info**: Added defaultFormatter for .toml files in settings.json

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

For older versions see [text](CHANGELOG_OLD.md)
