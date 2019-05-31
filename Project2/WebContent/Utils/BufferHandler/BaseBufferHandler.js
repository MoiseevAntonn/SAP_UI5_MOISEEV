sap.ui.define([
	"sap/ui/base/Object"
], function(Object){
	"use strict";
	
	var AbstractBaseBufferHandler = Object.extend("BaseBufferHandler",{
		
		parseData : function(){
			throw new Error("Abstract method. Redefine parseDataToString!");
		}
		
	});
	
	return AbstractBaseBufferHandler;

});