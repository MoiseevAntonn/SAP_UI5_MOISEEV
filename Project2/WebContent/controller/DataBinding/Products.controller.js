sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],function(BaseController,JSONModel,Filter,FilterOperator){
	"use strict";
	
	return BaseController.extend("sap.ui.task.controller.Employees.EmployeeList",{
		
		onInit : function(){
			var localModel = new JSONModel();
			localModel.loadData("./model/Products.json",null,false);
			localModel.setProperty("/Output",[]);
			this.getView().setModel(localModel,"products");
			//localModel.attachPropertyChange(this.handleDatalength,this)
			
			var oList = this.byId("invoiceList");
			//oList.getBinding("items").attachChange(this.dataLengthHandler,this);
			
			var products = localModel.getProperty("/Products")
			var oPaginator = this.byId("testPaginator");
			
			oPaginator.setDataLength(products.length);
			oPaginator.attachCalculateIndexAndLength(this.paginatorInfoHandler,this);
			
			var oInput = this.byId("visibleCount");
			oInput.attachSubmit(this.visibleCountHandler,this);
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
		},
		
		paginatorInfoHandler : function(oEvent){
			var startIndex = oEvent.getParameter("startIndex");
			var length = oEvent.getParameter("length");
			var oProductList = this.byId("invoiceList");
			
			//oProductList.removeAggregation("items");
			oProductList.bindAggregation("items",{
				model : "products",
				path : "/Products",
				template : new sap.m.StandardListItem({
					title : {
						model : "products",
						path : "ProductName"
					},
					iconDensityAware : false ,
					iconInset : false,
					type : "Navigation"
				}),
				length : length,
				startIndex : startIndex,
				filters : new Filter("ProductName",FilterOperator.Contains,"ququ")
			})
		},
		
		visibleCountHandler : function(oEvent){
			var value = parseInt(oEvent.getParameter("value"));
			var oPaginator = this.byId("testPaginator");
			
			oPaginator.setVisibleItemsCount(value);
		},
		
		dataLengthHandler : function(oEvent){
			
			var oPaginator = this.byId("testPaginator");
			
			//oPaginator.setDataLength();
		},
		
		onSearchProduct : function(oEvent){
			var aFilters = [];
			var sQuery = oEvent.getParameter("query");
			var oPaginator = this.byId("testPaginator");
			
			
			
			if (sQuery){
				aFilters.push(new Filter("ProductName",FilterOperator.Contains,sQuery))
			};
			
			var oList = this.byId("invoiceList");
			oList.getBinding("items").filter(aFilters);
			oPaginator.setDataLength(oList.getBinding("items").getLength());
		}
	});
});