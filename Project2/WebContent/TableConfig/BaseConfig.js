sap.ui.define([
	"sap/ui/base/Object"
], function(Object){
	"use strict";
	
	return Object.extend("BaseConfig",{
		
		getElement : function(){
			throw new Error("Abstract method. Redefine getElement!");
		}
		
	});

});