sap.ui.define([
	"sap/ui/task/TableConfig/BaseConfig",
	"sap/ui/core/Fragment"
], function(BaseConfig,Fragment){
	"use strict";

	return BaseConfig.extend("MCellFactory",{
		
		constructor : function(oController){
			this.oController = oController;
		},
		
		getElement : function(oClmnCtx, oRowCtx, sDataModelName){
			
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
					text : oBindObj
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
				
			case "card":
				oControl = new sap.m.Link({
					press: function(oEvent){
						return this.fCardHandler.apply(this.oController,[oEvent,sDataModelName]);
					}.bind(this),
					text : oBindObj
				});
				
				
				break;
				
			case "checkbox":
				oControl = new sap.m.CheckBox({
					width : "1em",
					selected: oBindObj
				});
				
				break;
				
			default:
				oControl = new sap.m.Text({
					text:oBindObj
				});
			};
			return oControl;
		},
		
		fCardHandler : function(oEvent,sDataModelName){
			
			var oView = this.getView();
			
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext(sDataModelName);
			var sPath = oContext.getPath();
			
			// create dialog lazily
			if (!this.byId("popoverAddress")) {
				// load asynchronous XML fragment
				var oFragmentController = {
					onClosePopover:function(){
						oView.byId("popoverAddress").close();
					}
				};
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.task.view.FactFuncTable.AddressFragment",
					controller : oFragmentController
				}).then(function (oPopover) {
					// connect dialog to the root view of this component (models, lifecycle)
					oPopover.bindElement({
						path:sPath,
						model:sDataModelName
					});
					oView.addDependent(oPopover);
					oPopover.openBy(oSelectedItem);
				});
			} else {
				var oPopover = this.byId("popoverAddress");
				oPopover.bindElement({path:sPath,model:sDataModelName});
				oPopover.openBy(oSelectedItem);
			}
		}
		
	});
	
	
});