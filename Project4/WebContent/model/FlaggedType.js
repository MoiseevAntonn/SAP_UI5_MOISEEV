sap.ui.define([
	"sap/ui/model/SimpleType"
], function (SimpleType) {
	"use strict";
	return SimpleType.extend("sap.ui.demo.bulletinboard.model.FlaggedType", {
		formatValue: function (iFlagged) {
			return iFlagged === 1;
		},
		parseValue: function (bFlagged) {
			if (bFlagged) {
				return 1;
			}

			return 0;
		},
		validateValue: function () {
			return true;
		}
	});
});