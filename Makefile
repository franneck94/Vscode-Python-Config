clean:
	rm -rf tests/SimpleRepo/.vscode/tasks.json
	rm -rf tests/SimpleRepo/.vscode/launch.json
	rm -rf tests/SimpleRepo/.vscode/settings.json
	rm -f tests/SimpleRepo/.editorconfig
	rm -f tests/SimpleRepo/.gitattributes
	rm -f tests/SimpleRepo/.gitignore
	rm -f tests/SimpleRepo/.pre-commit-config.yaml
	rm -f tests/SimpleRepo/requirements.txt
	rm -f tests/SimpleRepo/requirements-dev.txt
	rm -f tests/SimpleRepo/setup.cfg
	rm -f tests/SimpleRepo/pyproject.toml
	rm -f tests/SimpleRepo/.mypy-cache/

.phony: clean

VERS_REGEX = 's/(\w+(-*\w*)?)-([0-9]+\.[0-9]+\.[0-9]+)/\n\1>=\3/g'
GREP_TEXT = '^Successfully installed'

bump:
	cd templates && pip install -U -r requirements.txt | grep $(GREP_TEXT) | sed -E $(VERS_REGEX) > bump.txt
