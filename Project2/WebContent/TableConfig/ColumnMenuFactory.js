sap.ui.define([
	"sap/ui/task/TableConfig/ColumnFactory",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(ColumnFactory,Fragment,Filter,FilterOperator){
	"use strict";
	
	return ColumnFactory.extend("ColumnMenuFactory",{

	
		
		getElement:function(oClmnCtx, sMetadataModelName){
			"use strict"
			var oColumn = null,
				{type} = oClmnCtx.getObject();
			var that = this;
			
			switch (type) {
			case "":
				
				break;
				
			default:
				oColumn = new sap.ui.table.Column({
					filtered: {
						model : sMetadataModelName,
						path : "filtered"
					},
					label:new sap.m.Label({
						text : {
							model : sMetadataModelName,
							path : "label"
						}
					}),
					width:{
						model:sMetadataModelName,
						path:"width"
					}
				});
			}
		
			var oMenu = sap.ui.xmlfragment("sap.ui.task.view.Fragments.ColumnMenu", this);
			
			oColumn.setMenu(oMenu);
			
			return oColumn;
		},
		// my custom extend
		
		
		onMenuItemPress: function(oEvent){
			var oItem = oEvent.getParameter("item");
			var oData = oEvent.getSource().getBindingContext("column").getObject();
			var oColumn = oEvent.getSource().getParent();
			
			switch (oItem.data("type")) {
			case "filter":
				this.chooseFilterPopover(oEvent);
				break;
			case "filterClear":
				this.handleArrayFilters(oColumn);
				oColumn.setFiltered(false);
				break;
			case "mass":
				this.chooseMassPopover(oEvent);
				break;
			case "categorySearchHelp":
				this.onCategorySearchHelp(oEvent);
				break;
			case "productSearchHelp":
				this.onProductSearchHelp.apply(this,[oEvent]);
				break;
			case "priceSearchHelp":
				this.onPriceSearchHelp.apply(this,[oEvent]);
				break;
			default:
				break;
			}
			
		},
		
		chooseFilterPopover : function(oEvent){
			var oView = this.oController.getView();
			var {type} = oEvent.getSource().getBindingContext("column").getObject();
			var oColumn = oEvent.getSource().getParent();
			var that = this;
			
			var sFragmentName,sControlId;
			
			switch (type){
			case "marginText":
				sFragmentName = "SearchFieldPopover";
				sControlId = "searchFieldPopover"
				break;
			case "checkbox":
				sFragmentName = "CheckBoxPopover";
				sControlId = "checkBoxPopover"
				break;
			case "marginPrice":
				sFragmentName = "FilterPricePopover";
				sControlId = "filterPricePopover"
				break;
			};
			
			if (!this.oController.byId(sControlId)) {
				var oFragmentController = {
						getFilterDataFromEvent : function(oEvent){
							return that.getFilterDataFromEvent.apply(that,[oEvent, oColumn])
						}
					};
				Fragment.load({
					id: oView.getId(),
					name: `sap.ui.task.view.Fragments.${sFragmentName}`,
					controller : oFragmentController
				}).then(function (oPopover) {
					oPopover.setPlacement(sap.m.PlacementType.Bottom);
					oView.addDependent(oPopover);
					oPopover.openBy(oColumn);
				});
			} else {
				var oPopover = that.oController.byId(sControlId);
				oPopover.openBy(oColumn);
			}
		},
		getFilterDataFromEvent : function(oEvent, oColumn){
			var oData = oColumn.getBindingContext("column").getObject();
			var sQuery,sOperation;
			
			switch (oData.field){
			case "selected":
				//sQuery = oEvent.getSource().getParent().getContent()[0].getSelected()
				sOperation = FilterOperator.EQ;
				sQuery = this.oController.getView().getModel("fragmentModel").getProperty("/FilterCheckBox/selected");
				break;
			case "name":
				//sQuery = oEvent.getParameter("query");
				sOperation = FilterOperator.Contains;
				sQuery = this.oController.getView().getModel("fragmentModel").getProperty("/FilterName/value");
				break;
			case "UnitPrice":
				//sQuery = oEvent.getSource().getParent().getContent()[1].getValue();
				//sOperation = oEvent.getSource().getParent().getContent()[0].getSelectedKey();
				sOperation = this.oController.getView().getModel("fragmentModel").getProperty("/FilterPrice/selectedKey");
				sQuery = this.oController.getView().getModel("fragmentModel").getProperty("/FilterPrice/value");
				break;
			};
			this.onCreateFilter({field:oData.field,query:sQuery,operation:sOperation},oColumn)
		},
		onCreateFilter : function(oFilterData, oColumn){
			
			var {field,query,operation} = oFilterData;
			
			var oFilter = new Filter(field,operation,query);
			
			this.handleArrayFilters(oColumn,oFilter);
			
			if (query === ""){ 
				oColumn.setFiltered(false);
			} else {
				oColumn.setFiltered(true);
			};
			
		},
		handleArrayFilters : function(oColumn,oFilter){
			var oTreeTable = this.oController.byId("treeTable");
			var oBinding = oTreeTable.getBinding("rows");	
			var aFilters = oBinding.aFilters;
			var {field} = oColumn.getBindingContext("column").getObject();
			var res = [];
			
			if (aFilters.length > 0){
				if (aFilters[0].aFilters.length > 0){
					res = aFilters[0].aFilters.slice();
					res.forEach((item,i,arr) => {
						if (item.sPath == field) arr.splice(i,1);
					})
				}
			};
			if (oFilter) res.push(oFilter);
			
			var oParentFilter = new Filter({
				filters : res,
				and:true
			}) ;
			oBinding.filter(oParentFilter);
		},
		chooseMassPopover : function(oEvent){
			var oColumn = oEvent.getSource().getParent();
			var oView = this.oController.getView();
			var {type} = oEvent.getSource().getBindingContext("column").getObject();
			var that = this;
			
			var sFragmentName,sControlId;
			
			switch (type) {
			case "checkbox":
				sFragmentName = "MassCheckBoxPopover";
				sControlId = "massCheckBoxPopover";
				break;
			case "marginInput":
				sFragmentName = "MassInputPopover";
				sControlId = "massInputPopover";
				break;
			}
			
			if (!this.oController.byId(sControlId)) {
				var oFragmentController = {
						getMassDataFromEvent : function(oEvent){
							return that.getMassDataFromEvent.apply(that,[oEvent, oColumn])
						}
					};
				
				Fragment.load({
					id: oView.getId(),
					name: `sap.ui.task.view.Fragments.${sFragmentName}`,
					controller : oFragmentController
				}).then(function (oPopover) {
					oPopover.setPlacement(sap.m.PlacementType.Bottom);
					oView.addDependent(oPopover);
					oPopover.openBy(oColumn);
				});
			} else {
				var oPopover = that.oController.byId(sControlId);
				oPopover.openBy(oColumn);
			}
		},
		getMassDataFromEvent : function(oEvent, oColumn){
			var oTable = oColumn.getParent();
			var oModel = oTable.getModel("row");
			var aFilteredItems = oTable.getBinding("rows").filterInfo.aFilteredContexts.filter(item=>item?item:false);
			var {field,type} = oColumn.getBindingContext("column").getObject();
			var inputValue;
			
			
			
			switch (type){
			case "checkbox":
				//inputValue = oEvent.getSource().getParent().getContent()[0].getSelected();
				inputValue = this.oController.getView().getModel("fragmentModel").getProperty("/MassCheckBox/selected");
				break;
			case "marginInput":
				//inputValue = oEvent.getSource().getParent().getContent()[0].getValue();
				inputValue = this.oController.getView().getModel("fragmentModel").getProperty("/MassInput/value");
				break;
			}
			
			if (aFilteredItems.length == 0){
				var path = oTable.getBinding("rows").getPath();
				var categories = oModel.getProperty(path);
				categories.results.forEach(category=>{
					category[field] = inputValue;
					if (!category.results) return;
					var products = category.results;
					products.forEach(product=>{
						product[field] = inputValue;
						product.results[field] = inputValue;
					})
				})
			}
			aFilteredItems.forEach(item=>{
				var path = item.getPath();
				var element = oModel.getProperty(path);
				element[field] = inputValue;
			});
			oModel.updateBindings();
			
		},
		onCategorySearchHelp : function(oEvent){
			var oTableModel = oEvent.getSource().getModel("tables")
			var categories = oTableModel.getCategories();
			var that = this;
			var oDataModel = this.oController.getOwnerComponent().getModel("invoice");
			
			var oSearchHelp = new SearchHelp({
				//data : categories.results,
				fields : [
					{field : "CategoryID"},
					{field : "CategoryName"}
				],
				title : "Search help categories",
				tableSettings : {
					//visibleRowCount : categories.length
				},
				selectionMode : "MultiToggle",
				horizontalScrolling : false,
				resizable : true,
				getSelectedRows : that.onChangeHandler,
				dataModel : oDataModel,
				dataPath : "/Categories"
			});
			
			oSearchHelp.open();
			oSearchHelp.getAsyncSelectedRows().then(res=>console.log(res));
		},
		onProductSearchHelp : function(oEvent){
			var oTableModel = oEvent.getSource().getModel("tables");
			var products = oTableModel.getProducts();
			var that = this;
			
	
			var oSearchHelp = new SearchHelp({
				fields : [
					{field : "ProductID"},
					{field : "ProductName"}
				],
				title : "Search help products",
				tableSettings : {
					//visibleRowCount : products.length,
				},
				selectionMode : "Single",
				horizontalScrolling : false,
				resizable : true,
				getSelectedRows : that.onChangeHandler,
				dataModel : oTableModel,
				dataPath : "/data/products"
			}).addStyleClass("sapUiSizeCompact");
			//oSearchHelp.attachGetSelectedRows(that.onChangeHandler)
			oSearchHelp.open();
			oSearchHelp.getAsyncSelectedRows().then(res=>console.log(res));
		},
		onChangeHandler(oEvent){
			
		},
		onPriceSearchHelp : function(oEvent){
			var that = this;
			var oTableModel = oEvent.getSource().getModel("tables");
			var oDataModel = this.oController.getOwnerComponent().getModel("invoice");
			
			var oSearchHelp = new SearchHelp({
				fields : [
					{field : "ProductID"},
					{field : "UnitPrice"},
					{field : "ProductName",label : "Product Name"}
				],
				title : "Search help prices",
				tableSettings : {
					//visibleRowCount : products.length,
				},
				selectionMode : "Single",
				horizontalScrolling : false,
				resizable : true,
				getSelectedRows : that.onChangeHandler,
				dataModel : oDataModel,
				dataPath : "/Products",
				//dataPath : "/data/products",
				filterOperation : "EQ"
			}).addStyleClass("sapUiSizeCompact");
			//oSearchHelp.attachGetSelectedRows(that.onChangeHandler)
			oSearchHelp.open();
			oSearchHelp.getAsyncSelectedRows().then(res=>console.log(res));
		}
	});
});