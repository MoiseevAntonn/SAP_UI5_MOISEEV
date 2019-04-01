sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/task/controller/FactFuncTable/JSONTableModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/CustomData",
	"sap/ui/task/TableCreator"
], function(BaseController,JSONModel,JSONTableModel,Fragment,CustomData,TableCreator){
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
			
			/*oTable.bindAggregation('columns',{
				path: "tables>/metadata/commonTable",
				factory: this.сolumnFactoryUITable.bind(this)
			});
			oTable.addStyleClass("sapUiResponsiveMargin");*/
			
			var oTableCreator = new TableCreator({
				sType : "ui_table",
				sMetadataModelName : "tables",
				sMetadataColumnsPath : "/metadata/commonTable",
				sDataModelName : "tables",
				sDataRowsPath : "/data/employees",
				oTable : oTable,
				fCardHandler : this.onAddressPopover.bind(this)
			});
			
			// handle sap.m Table
			var oMTable = this.byId("employeeTable2");
			
			oMTable.setModel( tableModel, "columns");
			
			var oTableCreator1 = new TableCreator({
				sType : "m_table",
				sMetadataModelName : "columns",
				sMetadataColumnsPath : "/metadata/commonTable",
				sDataModelName : "tables",
				sDataRowsPath : "/data/employees",
				oTable : oMTable,
				fCardHandler : this.onAddressPopover.bind(this)
			});
			
			/*oMTable.bindAggregation('columns',{
				path: "tables>/metadata/commonTable",
				template: new sap.m.Column({
					header: new sap.m.Text({text:"{tables>label}"}),
					width : {
						model:"tables",
						path:"width"
					}
				})
			});
			
			oMTable.setModel( tableModel, "columns");
			oMTable.bindAggregation('items',{
				model: "tables",
				path : "/data/employees",
				factory : function(sId , oRowCtx){
					var oCLI = new sap.m.ColumnListItem();
					
					oCLI.bindAggregation("cells", {
						model: "columns",
						path:"/metadata/commonTable",
						factory: function(sId, oClmnCtx){
							return that.getTemplate(oClmnCtx, oRowCtx);
						}
					});
					
					return oCLI;
				}
			});
			oMTable.addStyleClass("sapUiResponsiveMargin");*/
			
			
			//handle Tree table
			var treeTable = this.byId("thirdTable");
			
			var newTable = new TableCreator({
				sType : "tree_table",
				sMetadataModelName : "tables",
				sMetadataColumnsPath : "/metadata/treeTable",
				sDataModelName : "tables",
				sDataRowsPath : "/data/categories",
				oTable : treeTable,
				fCheckBoxEventHandler : this.checkBoxEventHandler.bind(this)
			});
			
			/*treeTable.bindAggregation('columns',{
				path: "tables>/metadata/treeTable",
				factory: this.сolumnFactoryUITable.bind(this)
			});
			treeTable.bindAggregation('rows',{
				path : 'tables>/data/categories',
				parameters:{
					arrayNames:['results']
				}
			});
			treeTable.addStyleClass("sapUiResponsiveMargin");*/
		},
		
		сolumnFactoryUITable: function(sId,oContext){
			
			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({
					text:{
						model:"tables",
						path:"label"
					}
				}),
				width:{
					model:"tables",
					path:"width"
				}
			});
	
			var oTemplate = this.getTemplate(oContext,"tables");		
			oColumn.setTemplate(oTemplate);
		
			return oColumn;
		},
		
		getTemplate: function(oClmnCtx,oRowCtx){
			var oControl,
				oData = oClmnCtx.getObject();
			
			var oBindObj = {};
			
			oBindObj.parts = []; 
			oData.field.split("_").forEach(item=>{
				oBindObj.parts.push({path:item,model:"tables"})
			});
			
			switch (oData.type){
			case "img":
				oBindObj.formatter = id => "./Photos/images"+id%6+".jpg";
				oControl = new sap.m.Image({
					src: oBindObj,
					width:"50px",
					height:"50px"
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
						new CustomData({
							key:"level", 
							value: {
								model:"tables",
								path:"level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				break;
				
			case "card":
				oControl = new sap.m.Link({
					press: this.onAddressPopover.bind(this),
					text : "To address detail {tables>FirstName}"
				});
				break;
				
			case "checkbox":
				oControl = new sap.m.CheckBox({
					width : "1em",
					selected: oBindObj,
					visible:{
						model: "tables",
						path: "level",
						formatter: lvl => lvl !== "s"
					}
				});
				oControl.attachSelect(this.checkBoxEventHandler,this);
				break;
				
			default:
				oControl = new sap.m.Text({
					text:oBindObj
				});
			};
			return oControl;
			
		},
		
		onAddressPopover : function(oEvent){
			var oView = this.getView();
				
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("tables");
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
					oPopover.bindElement({path:sPath,model:"tables"});
					oView.addDependent(oPopover);
					oPopover.openBy(oSelectedItem);
				});
			} else {
				var oPopover = this.byId("popoverAddress");
				oPopover.bindElement({path:sPath,model:"tables"});
				oPopover.openBy(oSelectedItem);
			}
		},

		checkBoxEventHandler:function(oEvent){
			var oRefToItem = oEvent.getSource().getBindingContext('tables').getObject();
			var checkBoxValue = oEvent.getParameter("selected");
			
			if (oRefToItem.level == "c"){
				oRefToItem.results.forEach(product=>{
					product.selected = checkBoxValue;
				});
			};
			if (oRefToItem.level == "p"){
				if (checkBoxValue){
					var category = oRefToItem.__parent
					if (category.results.every(prod=> prod.selected)){
						category.selected = checkBoxValue;
					};
				} else {
					var category = oRefToItem.__parent;
					category.selected = checkBoxValue;
			
				};
			}
			//this.tableModel().updateModel();
			this.getView().getModel("tables");
		}
	});
});