compiled=./physics_engine.js

compile:
	@find ./src -type f -name "*.js" | xargs cat > $(compiled)
