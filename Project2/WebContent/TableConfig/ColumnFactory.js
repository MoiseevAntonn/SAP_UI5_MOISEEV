sap.ui.define([
	"sap/ui/task/TableConfig/BaseConfig",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseConfig,Fragment,Filter,FilterOperator){
	"use strict";
	
	return BaseConfig.extend("ColumnFactory",{

		constructor:function(oController){
			this.oController = oController;
		},
		
		getElement : function(oClmnCtx, sMetadataModelName){
			
			var oColumn = null,
				{type} = oClmnCtx.getObject();
			
			switch (type) {
			case "":
				
				break;
				
			default:
				oColumn = new sap.ui.table.Column({
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
			oColumn.attachColumnMenuOpen(this.columnMenuOpenHandler,this);
			
			return oColumn;
		},
		// my custom extend
		columnMenuOpenHandler : function(oEvent){
			var oView = this.oController.getView();
			var oColumn = oEvent.getSource();
			var sPath = oColumn.getBindingContext("column").getPath();
			var that = this;
			
			if (!this.oController.byId("columnMenu")) {
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.task.view.Fragments.ColumnMenu" ,
				}).then(function (oColumnMenu) {
					oView.addDependent(oColumnMenu);
					that.bindAndOpenColumnMenu(oColumnMenu,sPath,oColumn);
				});
			} else {
				var oColumnMenu = this.oController.byId("columnMenu");
				that.bindAndOpenColumnMenu(oColumnMenu,sPath,oColumn);
			}
		},
		popoverOpenHandler : function(oEvent, oColumn){
			var oView = this.oController.getView();
			var {type} = oEvent.getSource().getBindingContext("tables").getObject();
			var that = this;
			
			var sFragmentName,sControlId;
			
			switch (type){
			case "SearchField":
				sFragmentName = "SearchFieldPopover";
				sControlId = "searchFieldPopover"
				break;
			case "CheckBox":
				sFragmentName = "CheckBoxPopover";
				sControlId = "checkBoxPopover"
				break;
			case "Select":
				sFragmentName = "FilterPricePopover";
				sControlId = "filterPricePopover"
				break;
			case "ResetButton":
				this.handleArrayFilters(oColumn);
				this.deleteResetMenuButton(oColumn);
				
				oColumn.setFiltered(false);
				return;
			};
			
			if (!this.oController.byId(sControlId)) {
				var oFragmentController = {
						onFilterCategories : function(oEvent){
							return this.onFilterCategories.apply(this,[oEvent, oColumn])
						}.bind(this)
					};
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.task.view.Fragments." + sFragmentName,
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
		onFilterCategories : function(oEvent, oColumn){
			var {field} = oColumn.getBindingContext("column").getObject();
			var sQuery,sOperation;
			
			switch (field){
			case "selected":
				sQuery = oEvent.getSource().getParent().getContent()[0].getSelected()
				sOperation = FilterOperator.EQ;
				break;
			case "name":
				sQuery = oEvent.getParameter("query");
				sOperation = FilterOperator.Contains;
				break;
			case "UnitPrice":
				sQuery = oEvent.getSource().getParent().getContent()[1].getValue();
				sOperation = oEvent.getSource().getParent().getContent()[0].getSelectedKey();
				break;
			};
			
			var oFilter = new Filter(field,sOperation,sQuery);
			
			this.handleArrayFilters(oColumn,oFilter);
			this.addResetMenuButton(oColumn);
			
			if (sQuery === ""){ 
				oColumn.setFiltered(false);
			} else {
				oColumn.setFiltered(true);
			};
			
		},
		menuItemFactory : function(oColumn){
			var that = this;
			var oItem;
			oItem = new sap.m.MenuItem({
				text : {
					model : "tables",
					path : "label"
				},
				press : function(oEvent){
					return that.popoverOpenHandler.apply(that,[oEvent,oColumn]);
				}
			});
			
			return oItem;	
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
			} 
			if (oFilter) res.push(oFilter);
			
			var oParentFilter = new Filter({
				filters : res,
				and:true
			}) ;
			oBinding.filter(oParentFilter);
		},
		addResetMenuButton(oColumn){
			var sPath = oColumn.getBindingContext("column").getPath();
			var oColumnModel = oColumn.getModel("column");
			var {menuItems} = oColumnModel.getProperty(sPath);
			
			if (menuItems && !hasTypeValue(menuItems,"ResetButton")){
				menuItems.push({label:"Reset filter",type:"ResetButton"})
			};
			
			function hasTypeValue(menuItems,value){
				return menuItems.some(item=>item.type == value);
			};
		},
		deleteResetMenuButton(oColumn){
			var sPath = oColumn.getBindingContext("column").getPath();
			var oColumnModel = oColumn.getModel("column");
			var {menuItems} = oColumnModel.getProperty(sPath);
	
			menuItems.forEach((item,i,arr)=>{
				if (item.type == "ResetButton") arr.splice(i,1);
			});
		},
		bindAndOpenColumnMenu(oColumnMenu,sPath,oColumn){
			var that = this;
			oColumnMenu.bindAggregation("items",{
				model:"tables",
				path: sPath+"/menuItems",
				factory: function(sId,oCtx){
					return that.menuItemFactory.apply(that,[oColumn])
				}
			});
			oColumnMenu.openBy(oColumn);
		}
		
	});

});