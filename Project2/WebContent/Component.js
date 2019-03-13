sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
],function(UIComponent,JSONModel){
	"use strict";
	return UIComponent.extend("sap.ui.task.Component",{
		metadata : {
			manifest:"json"
		},
		init : function(){
			UIComponent.prototype.init.apply(this,arguments);
			
			this.getRouter().initialize();
			
			
			var dataStructure = {
					"path" : null
			}
			var localModel = new JSONModel(dataStructure);
			this.setModel(localModel,"pathModel");
		}
	});
});