sap.ui.define([
	"sap/ui/task/TableConfig/BaseConfig",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseConfig,Fragment,Filter,FilterOperator){
	"use strict";
	
	return BaseConfig.extend("ColumnFactory",{

		constructor:function(oController){
			this.oController = oController;
		},
		
		getElement:function(oClmnCtx, sMetadataModelName){
			"use strict"
			var oColumn = null,
				{type} = oClmnCtx.getObject();
			var that = this;
			
			switch (type) {
			case "":
				
				break;
				
			default:
				oColumn = new sap.ui.table.Column({
					filtered: {
						model : sMetadataModelName,
						path : "filtered"
					},
					label:new sap.m.Label({
						text : {
							model : sMetadataModelName,
							path : "label"
						}
					}),
					width:{
						model:sMetadataModelName,
						path:"width"
					}
				});
			}
			
			return oColumn;
		},
		// my custom extend
		
		
		
	});
});