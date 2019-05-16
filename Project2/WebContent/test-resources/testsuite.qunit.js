sap.ui.define(function() {
	"use strict";

	return {

		name: "TestSuite for myapp",

		defaults: {
			qunit: {
				version: "edge"
			}
		},
		sinon: {

			version: "edge",
			qunitBridge: true,
			useFakeTimers: false,
			useFakeServer: false
		},
		coverage: {
			only: null,
			never: null,
			branchTracking: false
		},
		ui5: {
			bindingSyntax: 'complex',
			noConflict: true,
			libs: [],
			theme: "sap_belize"
		},
		bootCore: true,
		skip: false, 
		
		tests: {
			qunittest: {
				  title: "My QUnit test for myapp"
			}
		}
	};
});