sap.ui.define([
	"sap/ui/task/TableConfig/BaseConfig"
], function(BaseConfig){
	"use strict";
	
	return BaseConfig.extend("MColumnFactory",{

		constructor:function(oController){
			this.oController = oController;
		},
		
		getElement : function(oClmnCtx, sMetadataModelName){
			
			var oColumn = null,
				{type} = oClmnCtx.getObject();
			
			switch (type) {
			case "":
				
				break;
				
			default:
				oColumn = new sap.m.Column({
					header: new sap.m.Text({
						text:{
							model:sMetadataModelName,
							path: "label"
						}
					}),
					width : {
						model : sMetadataModelName,
						path : "width"
					}
				})
			}
			
			
			return oColumn;
		}
		
	});

});