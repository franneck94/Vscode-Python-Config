clean:
	rm -rf test/testAssets/Python/.vscode
	rm -f test/testAssets/Python/.editorconfig
	rm -f test/testAssets/Python/.gitattributes
	rm -f test/testAssets/Python/.gitignore
	rm -f test/testAssets/Python/.pre-commit-config.yaml
	rm -f test/testAssets/Python/requirements-dev.txt
	rm -f test/testAssets/Python/setup.cfg

.phony: clean
