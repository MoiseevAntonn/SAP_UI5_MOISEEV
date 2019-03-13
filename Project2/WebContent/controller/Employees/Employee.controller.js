sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.Employees.Employee",{
		onInit : function (){
			var oRouter = this.getRouter();
			oRouter.getRoute("appEmployee").attachPatternMatched(this._onRouteMathced,this);
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
			if (!this.getView().getBindingContext()){
				this.getRouter().getTargets().display("notFound");
			}
		},
		onShowResume : function (oEvent) {
			var oCtx = this.getView().getElementBinding("invoice").getBoundContext();

			this.getRouter().navTo("appEmployeeResume", {
				employeeID : oCtx.getProperty("EmployeeID")
			});
		}
	});
});