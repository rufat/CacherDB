.PHONY: test test-ci-coverage

MOCHA=node_modules/.bin/mocha
COVERALLS=node_modules/.bin/coveralls
_MOCHA=node_modules/.bin/_mocha
ISTANBUL=node_modules/.bin/istanbul

test:
	npm test

test-ci-coverage:
	npm install coveralls
	npm install istanbul
	@rm -rf coverage
	$(ISTANBUL) cover $(_MOCHA) --report lcovonly -- -R tap

	@echo
	@echo Sending report to coveralls.io...
	@cat ./coverage/lcov.info | $(COVERALLS)
	@rm -rf ./coverage
	@echo Done