sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/task/controller/FactFuncTable/JSONTableModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/CustomData",
	"sap/ui/task/TableConfig/TableCreator",
	"sap/ui/task/TableConfig/UiTableCreator",
	"sap/ui/task/TableConfig/ColumnFactory",
	"sap/ui/task/TableConfig/CellFactory",
	"sap/ui/task/TableConfig/TreeTableCreator",
	"sap/ui/task/TableConfig/MTableCreator",
	"sap/ui/task/TableConfig/MColumnFactory",
	"sap/ui/task/TableConfig/MCellFactory",
], function(BaseController,JSONModel,JSONTableModel,Fragment,CustomData,TableCreator,UiTableCreator,ColumnFactory,CellFactory,TreeTableCreator,MTableCreator,MColumnFactory,MCellFactory){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.App",{
		onInit : function (){
			var that = this;
			
			//init local model
			
			
			
			
			var tableModel = new JSONTableModel();
			this.getView().setModel(tableModel,"tables");
			
			//load data into local model
			
			this.getView().setBusy(true);
			Promise.all([
				this.reedData({
					sPath : "/Employees"
				}),
				this.reedData({
					sPath : "/Categories"
				}),
				this.reedData({
					sPath : "/Products",
					urlParameters:{
						$expand: "Supplier"
					}
				})
			])
			.then( results => {
					var aEmployees = results[0].results;
					var aCategories = results[1].results;
					var aProducts = results[2].results;
					var aHandledCategories = tableModel.handleCategoriesAndProducts(aCategories, aProducts);
					tableModel.setEmployees(aEmployees);
					tableModel.setCategories(aHandledCategories);
			})
			.catch( oError => 
				this.getRouter().getTargets().display("notFound",{
					fromTarget : "home"
				})
			)
			.finally(() => this.getView().setBusy(false))
			
			
			// handle sap.ui.table Table
			var oTable = this.byId("employeeTable1");
			
			
			oTable.addStyleClass("sapUiResponsiveMargin");
			
			
			var oCellConfig = new CellFactory(that);
			var oColumnConfig = new ColumnFactory(that);
			
			var oMCellConfig = new MCellFactory(that);
			var oMColumnConfig = new MColumnFactory(that);
			
			
			var oUiTableCreator = new UiTableCreator({
				column : {
					model : tableModel,
					path : "/metadata/commonTable"
				},
				row : {
					model : tableModel,
					path : "/data/employees"
				},
				table : oTable,
				columnFactory : oColumnConfig,
				cellFactory : oCellConfig,
			});
			oUiTableCreator.build();
			
			// handle sap.m Table
			var oMTable = this.byId("employeeTable2");
			
			var oMTableCreator = new MTableCreator({
				column : {
					model : tableModel,
					path : "/metadata/commonTable"
				},
				row : {
					model : tableModel,
					path : "/data/employees"
				},
				table : oMTable,
				columnFactory : oMColumnConfig,
				cellFactory : oMCellConfig
			});
			oMTableCreator.build();
			
			
			//handle Tree table
			var treeTable = this.byId("treeTable");
			
			var oTreeTableCreator = new TreeTableCreator({
				column : {
					model : tableModel,
					path : "/metadata/treeTable"
				},
				row : {
					model : tableModel,
					path : "/data/categories"
				},
				table : treeTable,
				columnFactory : oColumnConfig,
				cellFactory : oCellConfig,
				arrayNames : ["results"]
			});
			oTreeTableCreator.build();
			
			
		}
	});
});