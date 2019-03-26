sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/CustomData"
], function(BaseController,JSONModel,Fragment,CustomData){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.App",{
		onInit : function (){
			
			//create local model
			var modelStructure = {
					data : {
						employees : {},
						categories : {}
					},
					metadata : {
						commonTable : {},
						treeTable : {}
					}
			}
			var tableModel = new JSONModel(modelStructure);
			this.getView().setModel(tableModel,"tables");
			var employeesModel = new JSONModel();
			employeesModel.loadData("./model/employeesDataStructure.json",null,false);
			
			
			var invoiceModel = this.getOwnerComponent().getModel("invoice");
			
			//load data into local model
			invoiceModel.read("/Employees",{
				success : function(oData,responce){
					employeesModel.setProperty("/Employees",oData.results);
				}
			});
			this.getView().setModel(employeesModel,"employees");
			
			// load data for three table
			var thirdTableModel = new JSONModel({
				"Data" : null
			});
			invoiceModel.read("/Categories",{
				success:function(oData, responce){
					
					var aCtg = oData.results.map( ctg => {
						//change propety name
						ctg.name = ctg.CategoryName;
						ctg.level = "c";
						
						var listProd = ctg.Products.results.map( prod => { 
							var suppl = prod.Supplier;
							suppl.name= suppl.CompanyName;
							suppl.level = "s";
							
							prod.level = "p";
							
							prod.__parent = ctg;
							
							prod.name = prod.ProductName;
							prod.results = [suppl];
							
							return prod;
						});
						
						ctg.results = listProd;
						delete ctg.Products;
						
						return ctg;
					});
					
					thirdTableModel.setProperty("/Data",aCtg);
				},
				urlParameters:{
					$expand: "Products/Supplier"
				}
			});
			this.getView().setModel(thirdTableModel,"thirdTableModel");
			
			//inital metadata model
			this.metadataColumnsModel = new JSONModel();
			this.metadataColumnsModel.loadData("./model/metadataColumns.json",null,false);
			this.getView().setModel(this.metadataColumnsModel,"metadataColumns");
			
			
			var oTable = this.byId("employeeTable1");
			oTable.bindAggregation('columns',{
				path: "metadataColumns>/columns",
				factory: this.сolumnFactory.bind(this)
			});
			oTable.addStyleClass("sapUiResponsiveMargin");
			
			
			// handle sap.m Table
			var oMTable = this.byId("employeeTable2");
			oMTable.bindAggregation('columns',{
				path: "metadataColumns>/columns",
				template: new sap.m.Column({
					header: new sap.m.Text({text:"{metadataColumns>label}"}),
				})
			});
			
			
			oMTable.bindAggregation('items',{
				path : "employees>/Employees",
				template : new sap.m.ColumnListItem({}).bindAggregation("cells",{
					path: "metadataColumns>/columns",
					factory : this.cellFactoryM.bind(this)
				})
			});
			oMTable.addStyleClass("sapUiResponsiveMargin");
			
			
			var TreeTableColumns = {
					"columns":[
						{
							"label" : "CheckBox",
							"type": "checkbox",
							"field": "selected",
							width:"10%"
						},
						{
							"label" : "Products",
							"type": "marginText",
							"field": "name"
						}
					]
			};
			var metadataTreeTableColumns = new JSONModel(TreeTableColumns)
			this.getView().setModel(metadataTreeTableColumns,"metadataTreeTableColumns");
			var treeTable = this.byId("thirdTable");
			treeTable.bindAggregation('columns',{
				path: "metadataTreeTableColumns>/columns",
				factory: this.сolumnFactoryTree.bind(this)
			});
			treeTable.bindAggregation('rows',{
				path : 'thirdTableModel>/Data',
				parameters:{arrayNames:['results']},
				
			})
			treeTable.addStyleClass("sapUiResponsiveMargin");
			treeTable.attachToggleOpenState(this.treeTableEventHandler,this);
	
		},
		
		сolumnFactory: function(sId,oContext){
			
//			switch
			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({text:"{metadataColumns>label}"}),
			});
			
			
			var oTemplate = this.getTemplate(oContext,"employees");
			oColumn.setTemplate(oTemplate);
			
			return oColumn;
		},
		сolumnFactoryTree: function(sId,oContext){
			
//			switch
			
			
			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({text:"{metadataTreeTableColumns>label}"}),
				width:{
					model:"metadataTreeTableColumns",
					path:"width"
				}
			});
			
			
			var oTemplate = this.getTemplate(oContext,"thirdTableModel");		
			oColumn.setTemplate(oTemplate);
		
			
			/*oControl.bindAggregation("customData",{
				path : 'thirdTableModel>/Data',
				template : new sap.ui.core.CustomData({key:"level", value: "{thirdTableModel>level}",writeToDom : true})
			})*/
			
			
			return oColumn;
		},
		cellFactoryM : function(sId,oContext){
			
			var oTemplate = this.getTemplate(oContext,"employees");
			
			return oTemplate;
		},
		getTemplate: function(oClmnCtx,sModelName){
			
			var oControl,
				oData = oClmnCtx.getObject();
			
			var oBindObj = { // === "{employees>'field'}"
				model: sModelName,
				path: oData.field
			}; 
			
			switch (oData.type){
			case "img":
				//oBindObj.formatter = sBin => 'data:image/png;base64,'+btoa(sBin);
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
				delete oBindObj.path;
				delete oBindObj.model;
				oBindObj.parts = [];
				oData.field.split("_").forEach(
					item => oBindObj.parts.push({
						path:item,
						model:sModelName
					})
				);
				oControl = new sap.m.Text({
					text : oBindObj
				});
				if (sModelName === "thirdTableModel"){
					var oDataTemplate = new CustomData({
						key:"level", 
						value: "{thirdTableModel>level}",
						writeToDom : true
					});
					
					oControl.addCustomData(oDataTemplate);
				}
				break;
			
			case "marginText":	
				
				oControl = new sap.m.Text({
					text : {
						model:sModelName,
						path:"name"
					},
					customData:[
						new CustomData({
							key:"level", 
							value: {
								model:sModelName,
								path:"level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				
				break;
			case "card":
				delete oBindObj.path;
				delete oBindObj.model;
				oBindObj.parts = [];
				oData.field.split("_").forEach((item,i,arr)=>{
					oBindObj.parts.push({path:item,model:sModelName})
				});
				oControl = new sap.m.Link({
					press: this.onAddressPopover.bind(this),
					text : "To address detail {"+sModelName+">FirstName}"
				});
				break;
			case "checkbox":
				oControl = new sap.m.CheckBox({
					width : "1em",
					selected: oBindObj,
					visible:{
						model: "thirdTableModel",
						path: "level",
						formatter: lvl => lvl !== "s"
					}
				});
				oControl.attachSelect(this.checkBoxEventHandler,this);
				break;
			default:
				delete oBindObj.path;
				delete oBindObj.model;
				oBindObj.parts = []; 
				oData.field.split("_").forEach((item,i,arr)=>{
					oBindObj.parts.shift({path:item,model:sModelName})
				});
				oControl = new sap.m.Text({
					text:oBindObj
				});
			};
			return oControl;
			
		},
		
		onAddressPopover : function(oEvent){
			var oView = this.getView();
				
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("employees");
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
					oPopover.bindElement({path:sPath,model:"employees"});
					oView.addDependent(oPopover);
					oPopover.openBy(oSelectedItem);
				});
			} else {
				var oPopover = this.byId("popoverAddress");
				oPopover.bindElement({path:sPath,model:"employees"});
				oPopover.openBy(oSelectedItem);
			}
		},

		checkBoxEventHandler:function(oEvent){
			
			var oRefToItem = oEvent.getSource().getBindingContext('thirdTableModel').getObject();
			//ctx .getModel() .getPath() .getObject()
			// var row = ctx.getObject();
			// var siblings = row.__parent.childs;
			// var bSelectParent = siblings.every(child => );
			
			if (oEvent.getParameter("selected")){
				if (oRefToItem.level == "c"){
					oRefToItem.results.forEach(product=>{
						product.selected = true;
					});
				};
				if (oRefToItem.level == "p"){
					var category = oRefToItem.__parent
					if (category.results.every(prod=> prod.selected)){
						category.selected = true;
					};
				};
			} else {
				if (oRefToItem.level == "c"){
					oRefToItem.results.forEach(product=>{
						product.selected = false;
					});
				};
				if (oRefToItem.level == "p"){
					var category = oRefToItem.__parent;
					category.selected = false;
				};
			};
			this.getView().getModel("thirdTableModel").updateBindings();
		},
		treeTableEventHandler : function(oEvent){
			
		}
		
		
	});
});