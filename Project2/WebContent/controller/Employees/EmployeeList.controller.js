sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel"
],function(BaseController,JSONModel){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.Employees.EmployeeList",{
		
		onInit : function(){
			var localModel = new JSONModel({
				Employees : null
			});
			localModel.setProperty("/Employees",this.getOwnerComponent().getModel("invoice"))
			
			
			/*var oPaginator = this.byId("testPaginator");
			oPaginator.setDataModel(this.getModel("invoices"));
			oPaginator.setDataPath("/Employees");
			oPaginator.setOutputModel(this.getModel("invoices"));
			oPaginator.setOutputPath("/Output")*/
		},
		
		onListItemPressed : function(oEvent){
			
			//extract path from event 
			var oItem, oCtx;
			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext("invoice");
			
			//add this path into local model
			var localModel = this.getOwnerComponent().getModel("pathModel");
			localModel.setProperty("/path",oCtx.getPath());
			
			
			this.getRouter().navTo("appEmployee",{
				employeeID : oCtx.getProperty("EmployeeID")
			})
		}
	});
});