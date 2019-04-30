sap.ui.define([
	"sap/m/Input",
], function(Input){
	"use strict";
	
	return Input.extend("sap.ui.task.control.AutoCompleteInput",{
		metadata : {
			properties : {
				autocomplete : {
					type : "String",
					defaultValue : "on"
				}
			}
		},
		renderer : {
			writeInnerAttributes : function(oRm,oControl){
				oRm.writeAttribute("autocomplete",oControl.getAutocomplete());
			}
		}
	});
});


/*var inputElem = this.$("inner")[0];
var autocompleteValue = this.getAutocomplete();
if (autocompleteValue === "on" || autocompleteValue === "off"){
	inputElem.setAttribute('autocomplete',autocompleteValue)
} else {
	throw new Error("wrong parameter autocomplete");
}*/