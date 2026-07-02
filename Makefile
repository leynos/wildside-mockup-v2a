.PHONY: check-fmt fmt lint test typecheck

check-fmt:
	bunx biome ci --linter-enabled=false --assist-enabled=false src tests tools docs package.json biome.jsonc bunfig.toml

fmt:
	bun fmt

lint:
	bun lint

typecheck:
	bun check:types

test:
	bun test
