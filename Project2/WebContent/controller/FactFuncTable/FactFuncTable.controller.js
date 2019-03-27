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
			
			var tableModel = new JSONModel()
			tableModel.loadData("./model/metadataTables.json");
			
			var invoiceModel = this.getOwnerComponent().getModel("invoice");
			
			//load data into local model
			
			this.getView().setBusy(true);
			this.reedData({
				sPath : "/Employees"
			})
			.then(
				oData=>{
					tableModel.setProperty("/data/employees",oData.results);
				},
				oError=>{
					this.getRouter().getTargets().display("notFound",{
						   fromTarget : "home"
					});
				}
			)
			.finally(()=>{
				this.getView().setBusy(false);
			})
			
			var that = this;
			
			this.getView().setBusy(true);
			Promise.all([
				this.reedData({
					sPath : "/Categories"
				}),
				this.reedData({
					sPath : "/Products",
					urlParameters:{
						$expand: "Supplier"
					}
				})
			]).then(
				results => {
					var categories = results[0].results;
					var products = results[1].results;
				
					/*categories.forEach(category=>{
						category.level = "c";
						category.name = category.CategoryName;
						category.results = products.filter(product=>{
							
							var supplier = product.Supplier || "";
							supplier.level = "s";
							supplier.name = supplier.CompanyName;
							
							product.results = supplier;
							product.level = "p";
							product.name = product.ProductName;
							product.__parent = categories.filter(category=>{
								return product.CategoryID == category.CategoryID;
							})[0];
							return product.CategoryID == category.CategoryID;
						});
					});*/
					var handledCategories = that.handleCategoriesAndProducts(categories,products);
					that.getView().getModel("tables").setProperty("/data/categories",handledCategories);
					
				},
				error => {
					this.getRouter().getTargets().display("notFound",{
						   fromTarget : "home"
					});
				}
			)
			.finally(()=>{
				this.getView().setBusy(false);
			})
			
			// load data for three table
			
			
			this.getView().setModel(tableModel,"tables");
			
			
			
			var oTable = this.byId("employeeTable1");
			oTable.bindAggregation('columns',{
				path: "tables>/metadata/commonTable",
				factory: this.сolumnFactory.bind(this)
			});
			oTable.addStyleClass("sapUiResponsiveMargin");
			
			
			// handle sap.m Table
			var oMTable = this.byId("employeeTable2");
			oMTable.bindAggregation('columns',{
				path: "tables>/metadata/commonTable",
				template: new sap.m.Column({
					header: new sap.m.Text({text:"{tables>label}"}),
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
			oMTable.addStyleClass("sapUiResponsiveMargin");
			
			var treeTable = this.byId("thirdTable");
			treeTable.bindAggregation('columns',{
				path: "tables>/metadata/treeTable",
				factory: this.сolumnFactoryTree.bind(this)
			});
			treeTable.bindAggregation('rows',{
				path : 'tables>/data/categories',
				parameters:{arrayNames:['results']},
				
			})
			treeTable.addStyleClass("sapUiResponsiveMargin");
	
		},
		
		сolumnFactory: function(sId,oContext){
			
//			switch
			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({text:"{tables>label}"}),
			});
			
			
			var oTemplate = this.getTemplate(oContext,"tables");
			oColumn.setTemplate(oTemplate);
			
			return oColumn;
		},
		сolumnFactoryTree: function(sId,oContext){
			
//			switch

			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({text:"{tables>label}"}),
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
			
			var oBindObj = { // === "{employees>'field'}"
				model: "tables",
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
						model:"tables"
					})
				);
				oControl = new sap.m.Text({
					text : oBindObj
				});
				/*if (sModelName === "thirdTableModel"){
					var oDataTemplate = new CustomData({
						key:"level", 
						value: "{thirdTableModel>level}",
						writeToDom : true
					});
					
					oControl.addCustomData(oDataTemplate);
				}*/
				break;
			
			case "marginText":	
				
				oControl = new sap.m.Text({
					text : {
						model:"tables",
						path:"name"
					},
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
				delete oBindObj.path;
				delete oBindObj.model;
				oBindObj.parts = [];
				oData.field.split("_").forEach((item,i,arr)=>{
					oBindObj.parts.push({path:item,model:"tables"})
				});
				oControl = new sap.m.Link({
					press: this.onAddressPopover.bind(this),
					text : "To address detail {"+"tables"+">FirstName}"
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
				delete oBindObj.path;
				delete oBindObj.model;
				oBindObj.parts = []; 
				oData.field.split("_").forEach((item,i,arr)=>{
					oBindObj.parts.shift({path:item,model:"tables"})
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
			this.getView().getModel("tables").updateBindings();
		},
		handleCategoriesAndProducts : function(categories,products){
			var productMap = {};
			products.forEach(product=>{
				var supplier = product.Supplier || "";
				supplier.level = "s";
				supplier.name = supplier.CompanyName;

				product.name = product.ProductName;
				product.results = supplier;
				product.level = "p";
				product.__parent = categories.filter(category=>{
					return product.CategoryID == category.CategoryID;
				})[0];
				
				
				if(!productMap[product.CategoryID]) {
					productMap[product.CategoryID] = [];
				}
				productMap[product.CategoryID].push(product);
	
			});
			
			categories.forEach(category=>{
				category.level = "c";
				category.name = category.CategoryName;
				category.results = productMap[category.CategoryID];
			});
			return categories;
		}
	});
});