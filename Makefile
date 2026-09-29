.PHONY: check-fmt fmt lint nixie spelling test typecheck
.PHONY: test

NIXIE_VERSION ?= 1.1.0
MERMAN_CLI_VERSION ?= 0.7.0
TYPOS_CONFIG_BUILDER_VERSION ?= v0.1.3
TYPOS_CONFIG_BUILDER = $(UV_ENV) $(UV) tool run --python 3.14 --from \
	"git+https://github.com/leynos/typos-config-builder.git@$(TYPOS_CONFIG_BUILDER_VERSION)" \
	typos-config-builder
UV ?= uv
UV_ENV = UV_CACHE_DIR=.uv-cache UV_TOOL_DIR=.uv-tools
NIXIE = $(UV_ENV) $(UV) tool run --python 3.14 \
	--from nixie-cli@$(NIXIE_VERSION) nixie

check-fmt:
	bunx biome ci --linter-enabled=false --assist-enabled=false src tests tools docs package.json biome.jsonc bunfig.toml

fmt:
	bun fmt
	mdformat-all

lint:
	bun lint

typecheck:
	bun check:types

test:
	bun test

spelling: ## Enforce en-GB-oxendict spelling and shared phrase corrections
	$(TYPOS_CONFIG_BUILDER) gate --repository . --scope all

nixie: ## Validate Mermaid diagrams
	cargo install merman-cli --version "=$(MERMAN_CLI_VERSION)" --locked
	$(NIXIE) --no-sandbox
