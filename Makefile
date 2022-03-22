clean:
	rm -rf test/testAssets/Python/.vscode/tasks.json
	rm -rf test/testAssets/Python/.vscode/launch.json
	rm -rf test/testAssets/Python/.vscode/settings.json
	rm -f test/testAssets/Python/.editorconfig
	rm -f test/testAssets/Python/.gitattributes
	rm -f test/testAssets/Python/.gitignore
	rm -f test/testAssets/Python/.pre-commit-config.yaml
	rm -f test/testAssets/Python/requirements-dev.txt
	rm -f test/testAssets/Python/setup.cfg
	rm -f test/testAssets/Python/pyproject.toml
	rm -f test/testAssets/Python/.mypy-cache/

.phony: clean
