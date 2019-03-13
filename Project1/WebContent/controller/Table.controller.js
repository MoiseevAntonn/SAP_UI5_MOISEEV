sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],function(Controller,JSONModel,ODataModel,Filter,FilterOperator){
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.InvoiceList",{
		onInit : function(){
			
			var that = this;
			this.lclm = new JSONModel();
			this.lclm.loadData("./data/dataStructure.json",null,false);
			
			//получить из компонента
			this.srvm = this.getOwnerComponent().getModel("invoice");
			
			
			this.getView().setBusy(true);
			this.srvm.read("/Categories",{
				success:function(oData, responce){
					that.lclm.setProperty("/Invoices",oData.results);
					that.getView().setBusy(false);
				},
				
				error: function(err){
					that.getView().setBusy(false);
				},
				urlParameters:{
					$expand: "Products"
				}
			});
			
			var data = "1";
			
			testFile.test();
			
			this.getView().setModel(this.lclm,"local");
			
		},
		
		onFilterTable :function(oEvent){
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			
			//1. доработать фильтр для обработки чисел (quantity)
			var test = Number.parseInt(sQuery)
			if (Number.isNaN(test)){
				
				aFilter.push(new Filter("CategoryName",FilterOperator.Contains,sQuery));
			} else {
				aFilter.push(new Filter("CategoryID",FilterOperator.LE,sQuery));	
			}
			var that = this;
			
			this.srvm.read("/Categories",{
				success:function(oData, responce){
					that.lclm.setProperty("/Invoices",oData.results);
				},
				
				error: function(err){
					
				},
				filters: aFilter
			});
			
		}
		
	});
	
})