sap.ui.define([
	"sap/ui/task/TableConfig/BaseConfig",
	"sap/ui/core/Fragment"
], function(BaseConfig,Fragment){
	"use strict";

	return BaseConfig.extend("CellFactory",{
		
		constructor : function(oController){
			this.oController = oController;
		},
		
		getElement : function(oClmnCtx,sDataModelName){
			
			var oControl,
				oData = oClmnCtx.getObject();
			
			var oBindObj = {};
			
			oBindObj.parts = []; 
			oData.field.split("_").forEach(item=>{
				oBindObj.parts.push({path:item,model:sDataModelName});
			});
			
			switch (oData.type){
			case "img":
				var sImagePath = oData.path || "./Photos/";
				oBindObj.formatter = id => sImagePath + "images"+id%6+".jpg";
				oControl = new sap.m.Image({
					src: oBindObj,
					width : oData.imageWidth || "50px",
					height : oData.imageWidth || "50px"
				});
				break;
				
			case "date":
				oControl = new sap.m.DateTimeField({
					dateValue : oBindObj
				});
				break;
				
			case "text":
				oControl = new sap.m.Text({
					text : oBindObj,
					tooltip: {
						model:"row",
						path:oData.field,
						formatter: value => value+"" 
					},
					wrapping : false,
					
				});
				break;
			
			case "marginText":	
				oControl = new sap.m.Text({
					text : oBindObj,
					customData:[
						new sap.ui.core.CustomData({
							key:"level", 
							value: {
								model: sDataModelName,
								path : "level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				break;
			case "marginPrice":
				oBindObj.formatter = price => price ? price.toPrecision(price.toString().split(".")[0].length + 2) : undefined
				oControl = new sap.m.Text({
					text : oBindObj,
					customData:[
						new sap.ui.core.CustomData({
							key:"level", 
							value: {
								model: sDataModelName,
								path : "level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				break;
			case "marginInput":
				//oBindObj.formatter = price => price ? price.toPrecision(price.toString().split(".")[0].length + 2) : undefined
				oControl = new sap.m.Input({
					value : oBindObj,
					customData:[
						new sap.ui.core.CustomData({
							key:"level", 
							value: {
								model: sDataModelName,
								path : "level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				break;
			case "card":
				oControl = new sap.m.Link({
					text : oBindObj
				});
				
				
				break;
				
			case "checkbox":
				oControl = new sap.m.CheckBox({
					width : "1em",
					selected: oBindObj,
					visible : {
						model : sDataModelName,
						path : "level",
						formatter : value => value != "s" ? true : false
					}
				});
				break;
				
			default:
				oControl = new sap.m.Text({
					text:oBindObj
				});
			};
			return oControl;
		},
		
		
	});
	
	
});