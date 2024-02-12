# Python Config Change Log

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

## Version 7.2.0: Dec 23, 2023

- **Info**: Bumped some version

## Version 7.1.1: Dec 14, 2023

- **Info**: Bug fix for ruff

## Version 7.1.0: Dec 14, 2023

- **Info**: Bumped some version

## Version 7.0.0: Dec 09, 2023

- **Info**: Removed cython-lint from pre-commit
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
- **Info**: Removed mypy pre-commit hook for jupyter notebook
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
- **Info**: Dropped Python 3.7 support, support is 3.8-3.12

## Version 4.9.0: Nov 02, 2023

- **Info**: Added Python 3.12 as a Version
- **Info**: Python 3.10 is now the default Version
- **Info**: Updated pre-commit file
- **Info**: Updated settings.json file
- **Info**: Bumped versions in requirements file

## Version 4.8.0: Oct 29, 2023

- **Info**: Updated isort config

## Version 4.7.0: Oct 27, 2023

- **Info**: Added first draft for ruff format

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

For older versions see [text](CHANGELOG_OLD.md)
