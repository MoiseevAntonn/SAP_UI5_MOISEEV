sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/task/controller/FactFuncTable/JSONTableModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/CustomData",
	"sap/ui/task/TableConfig/TableCreator",
	"sap/ui/task/TableConfig/UiTableCreator",
	"sap/ui/task/TableConfig/ColumnMenuFactory",
	"sap/ui/task/TableConfig/CellEventsFactory",
	"sap/ui/task/TableConfig/TreeTableCreator",
	"sap/ui/task/TableConfig/MTableCreator",
	"sap/ui/task/TableConfig/MColumnFactory",
	"sap/ui/task/TableConfig/MCellFactory",
	"sap/ui/task/control/SearchHelp",
	"utils/BufferHandler/WriterToBuffer",
	"utils/BufferHandler/ReaderFromBuffer",
], function(BaseController,
		JSONModel,
		JSONTableModel,
		Fragment,
		CustomData,
		TableCreator,
		UiTableCreator,
		ColumnMenuFactory,
		CellEventsFactory,
		TreeTableCreator,
		MTableCreator,
		MColumnFactory,
		MCellFactory,
		SearchHelp,
		WriterToBuffer,
		ReaderFromBuffer){
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
					tableModel.setCategories(aHandledCategories.results);
					tableModel.setProducts(aProducts);
			})
			.catch( oError => 
				this.getRouter().getTargets().display("notFound",{
					fromTarget : "home"
				})
			)
			.finally(() => this.getView().setBusy(false))
			
			
			var oFragmentModel = new JSONModel();
			oFragmentModel.loadData("./model/fragmentsModelStructure.json");
			this.getView().setModel(oFragmentModel,"fragmentModel");
			
			// handle sap.ui.table Table
			var oTable = this.byId("employeeTable1");
			
			
			oTable.addStyleClass("sapUiResponsiveMargin");
			
			
			var oCellConfig = new CellEventsFactory(that);
			var oColumnConfig = new ColumnMenuFactory(that);
			
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
			
			//this.byId("tableInput").attachBrowserEvent()
			var oInput = that.byId("bufferInput");
			oInput.attachBrowserEvent("paste",this.inputPasteHandler.bind(this))
		},
		checkInput : function(oEvent){
			var oAutoCompleteInput = this.getView().byId("autocompelteInput");
			if (oAutoCompleteInput.getAutocomplete() === "on") {
				oAutoCompleteInput.setAutocomplete("off");
			} else {
				oAutoCompleteInput.setAutocomplete("on")
			}
		},
		parseDataFromTable : function(oEvent){
			var oTable = this.byId("tTable");
			var employees = oTable.getContent()[0].getModel("row").getEmployees();
			var metadata = oTable.getContent()[0].getModel("row").getProperty("/metadata/commonTable");
			var handlers = [{columnKey : "Address",handler : function(sInput){return sInput.replace(/(\r\n)+|\r+|\n+|\t+/i,"")}}]
			
			var oBufferHandler = new WriterToBuffer({aData:employees,aMetadata:metadata,aMapOfHandlers:handlers,sIncludedField:"label"});
			
			var parsedString = oBufferHandler.parseData({addTitles:true});
		
			WriterToBuffer.writeToBuffer(parsedString)
		},
		parseDataToTable : function(oEvent){
			var that = this;
			var oTable = that.byId("employeeTable1");
			var metadata = oTable.getModel("row").getProperty("/metadata/commonTable");
			var aTypeHandlers = [
				{	
					field:"HireDate",
					handler:sDate=>new Date(sDate),
					verificate: sDate => (new Date(sDate)).toString() === 'Invalid Date' ? false : true
				},
				{
					field:"EmployeeID",
					handler:sId=>parseInt(sId),
					verificate: nId => isNaN(nId) ? false : true
				}
				
			];
			
			var oBufferHandler = new ReaderFromBuffer({aMetadata:metadata,aTypeHandlers: aTypeHandlers});
			
			ReaderFromBuffer.readFromBuffer()
			.then(sInput=>oBufferHandler.parseData(sInput))
			.then(parsedData=>{
				var oTable = that.byId("employeeTable1");
				var employees = oTable.getModel("tables").getProperty('/data/employees');
				
				parsedData.forEach(employee=>{
					employees.push(employee);
				})
				oTable.setVisibleRowCount(employees.length)
				oTable.getModel("tables").updateBindings();
			})
			.catch(err=>{throw err});
			
		},
		inputPasteHandler : function(oEvent){
			oEvent.preventDefault();
			
			var that = this;
			var oTable = that.byId("employeeTable1");
			var metadata = oTable.getModel("row").getProperty("/metadata/commonTable");
			var aTypeHandlers = [
				{	
					field:"HireDate",
					handler:sDate=>new Date(sDate),
					verificate: sDate => (new Date(sDate)).toString() === 'Invalid Date' ? false : true
				},
				{
					field:"EmployeeID",
					handler:sId=>parseInt(sId),
					verificate: nId => isNaN(nId) ? false : true
				}
				
			];
			
			var oBufferHandler = new ReaderFromBuffer({aMetadata:metadata,aTypeHandlers: aTypeHandlers});
			
			ReaderFromBuffer.handleEventObject(oEvent)
			.then(sInput=>oBufferHandler.parseData(sInput))
			.then(parsedData=>{
				var oTable = that.byId("employeeTable1");
				var employees = oTable.getModel("tables").getProperty('/data/employees');
				
				parsedData.forEach(employee=>{
					employees.push(employee);
				})
				oTable.setVisibleRowCount(employees.length)
				oTable.getModel("tables").updateBindings();
			});
			var oInput = that.byId("bufferInput");
			oInput.setValue("");
		}
	});
});