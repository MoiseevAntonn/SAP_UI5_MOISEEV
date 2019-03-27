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
			
			
			//Data binding tutorial 
			var oProductModel = new JSONModel();
			oProductModel.loadData("./model/Products.json");
			this.setModel(oProductModel,"products");
			
			
			var oModel1 = new JSONModel({
				firstName: "Harry",
				lastName: "Hawk",
				enabled: true,
				address: {
					street: "Dietmar-Hopp-Allee 16",
					city: "Walldorf",
					zip: "69190",
					country: "Germany"
				},
				"salesToDate" : 12345.6789,
				"currencyCode" : "EUR",
				"priceThreshold": 20

			});
			//oModel1.setDefaultBindingMode(BindingMode.OneWay);
			this.setModel(oModel1,"tutorial");
			sap.ui.getCore().getMessageManager().registerObject(this.getRootControl(),true);

		},
		reedData : function(oParameters){
			
			return new Promise((resolve,reject) => {
			
				oParameters.success = function(oData,response){
					resolve(oData);
				};
				oParameters.error = function(oError){
					reject(oError);
				}
				var invoiceModel = this.getModel("invoice");
				invoiceModel.read(oParameters.sPath,oParameters);
			})
		}
	});
});