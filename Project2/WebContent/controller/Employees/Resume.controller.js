sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.Employees.Resume",{
		onInit : function (){
			var oRouter = this.getRouter();
			oRouter.getRoute("appEmployeeResume").attachMatched(this._onRouteMathced,this);
		},
		_onRouteMathced : function(oEvent){
			var oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();
			
			var localModel = this.getOwnerComponent().getModel("pathModel");
			var pathStr = localModel.getProperty("/path");
			
			oView.bindElement({
				//path: "/Invoices(ProductName" + oArgs.productName  + ")",
				path: pathStr,
				model: "invoice",
				events : {
					
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
			
		},
		_onBindingChange: function(oEvent){
			if (!this.getView().getBindingContext("invoice")){
				this.getRouter().getTargets().display("notFound");
			}
		}
		
	});
});