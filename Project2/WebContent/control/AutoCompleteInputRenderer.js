sap.ui.define([
	"sap/m/InputRenderer",
	"sap/ui/core/Renderer"
], function(InputRenderer,Renderer){
	"use strict";
	var AutocompleteInputRenderer = Renderer.extend(InputRenderer);
	
	AutocompleteInputRenderer.writeInnerAttributes = function(oRm,oControl){
		oRm.writeAttribute("autocomplete",oControl.getAutocomplete());
	};
	
	return AutocompleteInputRenderer;
});