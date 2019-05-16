sap.ui.define([
	"sap/ui/demo/bulletinboard/model/DateFormatter"
], function (DateFormatter) {
	"use strict";

	return {
		
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		priceState: function (iPrice) {
			if (iPrice < 50) {
				return "Success";
			} else if (iPrice >= 50 && iPrice < 250) {
				return "None";
			} else if (iPrice >= 250 && iPrice < 2000) {
				return "Warning";
			} else {
				return "Error";
			}
		},
		date : function(date){
			return new DateFormatter({now:Date.now}).format(date);
		}

	};

});
