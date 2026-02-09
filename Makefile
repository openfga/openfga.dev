.PHONY: help install dev build lint lint-fix format format-check typecheck audit check-circular check-all clean serve

# Default target - show help
help:
	@echo "OpenFGA Documentation - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Development:"
	@echo "  make install          - Install dependencies (npm ci)"
	@echo "  make dev              - Start development server on port 3000"
	@echo ""
	@echo "Code Quality (CI checks):"
	@echo "  make format-check     - Check code formatting with Prettier"
	@echo "  make format           - Fix code formatting with Prettier"
	@echo "  make lint             - Run ESLint checks"
	@echo "  make lint-fix         - Run ESLint and auto-fix issues"
	@echo "  make typecheck        - Run TypeScript type checking"
	@echo "  make check-circular   - Check for circular dependencies"
	@echo "  make audit            - Audit dependencies for security issues"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build            - Build the production site"
	@echo "  make serve            - Serve built site locally"
	@echo "  make clean            - Clean build artifacts and cache"
	@echo ""
	@echo "All-in-one:"
	@echo "  make check-all        - Run all CI checks (format-check, lint, typecheck, check-circular, build)"
	@echo ""

# Install dependencies
install:
	npm ci

# Development server
dev:
	npm run dev

# Build the project
build:
	npm run build

# Code quality - Formatting
format:
	npm run format:fix

format-check:
	npm run format:check

# Code quality - Linting
lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Code quality - Type checking
typecheck:
	npm run typecheck

# Security audit (note: may have warnings, continues in CI)
audit:
	@echo "Note: Some audit warnings may be expected (e.g., update-notifier)"
	npm audit || true

# Check for circular dependencies (uses npx, no install needed)
check-circular:
	npx madge --circular . --extensions ts,js,jsx,tsx

# Run all checks (mirrors CI workflow)
check-all: format-check lint typecheck check-circular build
	@echo ""
	@echo "✅ All checks passed! Ready to commit."

# Clean build artifacts
clean:
	npm run clear
	rm -rf build .docusaurus

# Serve built site locally
serve:
	npm run serve

