clean:
	rm -rf tests/Project/.vscode/tasks.json
	rm -rf tests/Project/.vscode/launch.json
	rm -rf tests/Project/.vscode/settings.json
	rm -f tests/Project/.editorconfig
	rm -f tests/Project/.gitattributes
	rm -f tests/Project/.gitignore
	rm -f tests/Project/.pre-commit-config.yaml
	rm -f tests/Project/requirements.txt
	rm -f tests/Project/requirements-dev.txt
	rm -f tests/Project/setup.cfg
	rm -f tests/Project/pyproject.toml
	rm -f tests/Project/.mypy-cache/

.phony: clean
