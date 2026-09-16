.PHONY: check-fmt fmt lint markdownlint nixie spelling spelling-config \
	spelling-config-write spelling-helper-test spelling-phrase-check test \
	typecheck
.PHONY: test

NIXIE_VERSION ?= 1.1.0
MERMAN_CLI_VERSION ?= 0.7.0
HYPOTHESIS_VERSION ?= 6.156.6
PATHSPEC_VERSION ?= 1.1.1
RUFF_VERSION ?= 0.15.12
TYPOS_VERSION ?= 1.48.0
UV ?= uv
UV_ENV = UV_CACHE_DIR=.uv-cache UV_TOOL_DIR=.uv-tools
NIXIE = $(UV_ENV) $(UV) tool run --python 3.14 \
	--from nixie-cli@$(NIXIE_VERSION) nixie
TYPOS_CONFIG_BUILDER_COMMIT := b604f198797fdd36a567dd0f8f07b13f9539b241
TYPOS_CONFIG_BUILDER_SOURCE := git+https://github.com/leynos/typos-config-builder.git@$(TYPOS_CONFIG_BUILDER_COMMIT)
TYPOS_CONFIG_BUILDER := $(UV_ENV) $(UV) tool run --python 3.14 \
	--from "$(TYPOS_CONFIG_BUILDER_SOURCE)" typos-config-builder
SPELLING_PY_SRCS := \
	scripts/typos_rollout_check.py scripts/tests/test_typos_rollout_check.py
SPELLING_PY_ENV := PYTHONDONTWRITEBYTECODE=1
SPELLING_COVERAGE_FILE ?= /tmp/wildside-mockup-v2a-spelling-helper.coverage
SPELLING_HELPER_PYTEST = PYTHONPATH=scripts $(SPELLING_PY_ENV) \
	COVERAGE_FILE=$(SPELLING_COVERAGE_FILE) $(UV_ENV) $(UV) run --no-project \
	--python 3.14 --with pathspec==$(PATHSPEC_VERSION) --with pytest==9.0.2 \
	--with hypothesis==$(HYPOTHESIS_VERSION) --with pytest-cov==7.0.0 python -m pytest

MDLINT ?= $(shell command -v markdownlint-cli2 2>/dev/null || printf '%s' "$$HOME/.bun/bin/markdownlint-cli2")
# `make fmt` and `make check-fmt` call mdtablefix directly. `--git` selects the
# Markdown files Git tracks and `--include-untracked` adds the untracked files
# Git does not ignore, so a new document is formatted before it is staged.
# Both modes need mdtablefix 0.6.0 or later; CI pins the version at the
# install-mdtablefix step.
MDTABLEFIX ?= mdtablefix
MDTABLEFIX_SELECT = --git --include-untracked
MDTABLEFIX_RULES = --wrap --renumber --breaks --ellipsis --fences

check-fmt:
	bunx biome ci --linter-enabled=false --assist-enabled=false src tests tools docs package.json biome.jsonc bunfig.toml
	$(MDTABLEFIX) --check $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)

fmt:
	bun fmt
	$(MDTABLEFIX) --in-place $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)
	$(MDLINT) --fix "**/*.md"

lint:
	bun lint

markdownlint: ## Lint Markdown with the shared markdownlint-cli2 configuration
	$(MDLINT) "**/*.md"

typecheck:
	bun check:types

test:
	bun test

spelling: spelling-phrase-check ## Enforce en-GB-oxendict spelling
	@git ls-files -z | xargs -0 -r env $(UV_ENV) \
		$(UV) tool run typos@$(TYPOS_VERSION) --config typos.toml --force-exclude --hidden

spelling-phrase-check: spelling-config ## Reject prohibited phrase forms
	@PYTHONPATH=scripts $(SPELLING_PY_ENV) $(UV_ENV) $(UV) run --no-project --python 3.14 \
		scripts/typos_rollout_check.py --repository .

spelling-config: spelling-helper-test ## Check generated spelling configuration
	@git ls-files --error-unmatch typos.toml >/dev/null
	@$(TYPOS_CONFIG_BUILDER) --repository . --check

spelling-config-write: spelling-helper-test ## Regenerate spelling configuration
	@$(TYPOS_CONFIG_BUILDER) --repository .

spelling-helper-test: ## Validate the spelling phrase helper
	@$(UV_ENV) $(UV) tool run ruff@$(RUFF_VERSION) format --isolated --target-version py313 --check $(SPELLING_PY_SRCS)
	@$(UV_ENV) $(UV) tool run ruff@$(RUFF_VERSION) check --isolated --target-version py313 $(SPELLING_PY_SRCS)
	@$(SPELLING_HELPER_PYTEST) scripts/tests/test_typos_rollout_check.py -c /dev/null --rootdir=. -p no:cacheprovider --cov=typos_rollout_check --cov-fail-under=90

nixie: ## Validate Mermaid diagrams
	cargo install merman-cli --version "=$(MERMAN_CLI_VERSION)" --locked
	$(NIXIE) --no-sandbox
