sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.App",{
		onInit : function (){
			
			//local model
			var localProductsModel = new JSONModel();
			localProductsModel.loadData("./model/dataStructure.json",null,false);
			var invoiceModel = this.getOwnerComponent().getModel("invoice");
			
			//load data into local model
			invoiceModel.read("/Products",{
				success : function(oData,responce){
					localProductsModel.setProperty("/localProducts",oData.results);
				}
			})
			
			this.getView().setModel(localProductsModel,"localProducts");
			
			
			// set local metadata model 
			this.metadataModel = new JSONModel();
			this.metadataModel.loadData("./model/metadata.json",null,false);
			this.getView().setModel(this.metadataModel,"metadata");
	
			//var props = [];
			//props = metadataModel.getProperty("/metadata");
			
		},
		productListFactory: function(sId,oContext){
			var oUIControl;
			var props = [];
			 
			props = this.metadataModel.getProperty("/metadata");
			var commonPrice = oContext.getProperty("UnitPrice");
			var res;
			for (var i = 0; i < props.length ; i++){
				if (commonPrice > props[i].limit){
					res = props[i].type;
					break;
				}
			}
			switch (res){
			case 'Text':
				oUIControl = new sap.m.CustomListItem({
					content: new sap.m.Text({
						text : oContext.getProperty("ProductName"),
					})
				}).addStyleClass("sapUiResponsiveMargin")
				//this.byId("productText").clone(sId);
				break;
			case 'Input':
				oUIControl = new sap.m.CustomListItem({
					content: new sap.m.Input({
						value : oContext.getProperty("ProductName"),
						
					})
				}).addStyleClass("sapUiResponsiveMargin")
				break;
			case 'Select':
				oUIControl = new sap.m.CustomListItem({
					content: new sap.m.Select({
						selectedKey : oContext.getProperty("ProductName"),
						items : new sap.ui.core.Item({
							text : oContext.getProperty("ProductName"),
							key : oContext.getProperty("ProductName")
						})
					})
				}).addStyleClass("sapUiResponsiveMargin")
				break;
			case 'Date picker':
				oUIControl = new sap.m.CustomListItem({
					content: new sap.m.DatePicker({
						placeholder : oContext.getProperty("ProductName"),
						change : function(){}
					})
				}).addStyleClass("sapUiResponsiveMargin")
				break;
			default:
				oUIControl = new sap.m.CustomListItem({
					content: new sap.m.Text({
						text : oContext.getProperty("ProductName"),
					})
				}).addStyleClass("sapUiResponsiveMargin")
			}
			return oUIControl;
		}
	});
});