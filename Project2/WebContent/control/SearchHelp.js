sap.ui.define([
	"sap/m/Dialog",
	"sap/m/SearchField",
	"sap/ui/table/Table",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/task/TableConfig/UiTableCreator",
	"sap/ui/task/TableConfig/ColumnFactory",
	"sap/ui/task/TableConfig/CellFactory",
], function(Dialog,SearchField,Table,Button,JSONModel,Filter,FilterOperator,UiTableCreator,ColumnFactory,CellFactory){
	"use strict";
	
	return Dialog.extend("SearchHelp",{
		metadata : {
			properties : {
				
				contentWidth: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "70%"},

				contentHeight: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "80%"},
				
				selectionMode : {
					type : "sap.ui.table.SelectionMode",
					defaultValue : "MultiToggle" 
				},
				fields : {
					type : "any"
				},
				tableSettings : {
					type : "object"
				},
				searchFieldSettings : {
					type : "object"
				},
				dataModel : {
					type : "object"
				},
				dataPath : {
					type : "string"
				},
				filterOperation : {
					type : "sap.ui.model.FilterOperator",
					defaultValue : "Contains"
				}
			},
			events : {
				getSelectedRows : {
					parameters : {
						result : {type : "any"}
					}
				}
			}
		},
		init : function () {
			//TODO
			//1. promise
			//2. filter operator as parameter	*
			//3. ResizeHandler 
			//4. onSubmit empty selection show error and do not close	*
			//5. table busyIndicator	*
			//6. sap.ui.table.SelectionBehavior.Row as default	*
			//7. add filter by id *
			
			Dialog.prototype.init.apply(this,arguments);
			
			var oMetadataModel = new JSONModel({
				metadata : {}
			});
			
			this.setModel(oMetadataModel,"metadata");
			
			this._searchField = new SearchField({
				search : this._onSearch.bind(this),
			});
			
			this._table = new Table();	
			
			this._beginButton = new Button({
				text : "Close",
				press : this.close.bind(this)
			});
			
			this._promise = new Promise((res, rej) => {
				this.__res = res;		
				this.__rej = rej;
			});
			
			
			var that = this;
			
			this._endButton = new Button({
				text : "Submit",
				press : this.onSubmit.bind(this)
			});
			
			this.addContent(this._searchField);
			this.addContent(this._table);
			this.setBeginButton(this._beginButton);
			this.setEndButton(this._endButton);
			
			//this._registerId = sap.ui.core.ResizeHandler.register(this,this.resizeHandler.bind(this));
			this._registerId = sap.ui.core.ResizeHandler.register(this,this.resizeHandler.bind(this));
			
		},
		renderer :{}, 
		
		onBeforeRendering: function() {
			if(Dialog.prototype.onBeforeRendering) {
               Dialog.prototype.onBeforeRendering.apply(this,arguments);
            };
            
            if (this.getSelectionMode() == "None"){
	        	this.setSelectionMode("Single");
	        };
	        if (this.getSelectionMode() == "Single"){
	        	this._endButton.setVisible(false);
	        	this._table.attachRowSelectionChange(this.onSubmit,this);
	        };
		
	        var fields = this.getFields();
	
	        var that = this;
	          
	        this._table.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
	        this._table.applySettings(this.getTableSettings());
	        this._table.setSelectionMode(this.getSelectionMode());
	        this._searchField.applySettings(this.getSearchFieldSettings());
	          
	        fields[0].label = "Id";
	        fields[0].type = "text";
	        fields[1].label = "Name";
	        fields[1].type = "text";
	         
	        var oCellConfig = new CellFactory();
			var oColumnConfig = new ColumnFactory();
	         
	        var oUiTableCreator = new UiTableCreator({
	        	column : {
	        		model : that.getModel("metadata"),
					path : "/metadata"
				},
				row : {
					model : that.getDataModel(),
					path : that.getDataPath()
				},
				table : that._table,
				columnFactory : oColumnConfig,
				cellFactory : oCellConfig,
			});
			oUiTableCreator.build();
			
			if (this._table.getBinding() instanceof sap.ui.model.odata.v2.ODataListBinding){
				this.setBusy(true);
				this._table.getBinding().attachDataReceived(this,()=>{
					this.setBusy(false);
					this.resizeHandler();
				});
			} else {
				this._table.getBinding().attachChange(this,()=>{
					this.resizeHandler();
				});
			};
			
			this.getModel("metadata").setProperty("/metadata",fields);
			//
        },
        onAfterRendering: function() {
			if(Dialog.prototype.onAfterRendering) {
               Dialog.prototype.onAfterRendering.apply(this,arguments);
            };
            this._table.setRowHeight(this._table.$("rows-row0")[0] ? this._table.$("rows-row0")[0].offsetHeight : 0);
        },
        onExit : function(){
        	if(Dialog.prototype.onExit) {
                Dialog.prototype.onExit.apply(this,arguments);
            };
            sap.ui.core.ResizeHandler.deregister(this._registerId);
        },
		_onSearch(oEvent){
			var sQuery = oEvent.getSource().getValue();
			var sOperation = this.getFilterOperation();//FilterOperator.Contains;
			
			var oBinding = this._table.getBinding();
			
			if (sQuery === ""){
				oBinding.filter(null);
				return;
			}
			
			var sQuery1; 
			var sQuery2;
			var sField1 = this.getModel("metadata").getProperty("/metadata")[0].field;
			var sField2 = this.getModel("metadata").getProperty("/metadata")[1].field;
			
			if (oBinding instanceof sap.ui.model.odata.v2.ODataListBinding){
				var sIdFieldType = oBinding._getEntityType().property.filter(item=>item["name"] == sField1)[0].type;
				var sNameFieldType = oBinding._getEntityType().property.filter(item=>item["name"] == sField2)[0].type;
				
				switch (sIdFieldType) {
				case "Edm.Int32":
					sQuery1 = parseInt(sQuery) ? parseInt(sQuery) : 0;
					break;
				case "Edm.String":
					sQuery1 = sQuery; 
					break;
				};
				
				switch (sNameFieldType) {
				case "Edm.Int32":
					sQuery2 = parseInt(sQuery) ? parseInt(sQuery) : 0;
					break;
				case "Edm.String":
					sQuery2 = sQuery;
					break;
				case "Edm.Decimal":
					sQuery2 = parseFloat(sQuery) ? parseFloat(sQuery) : 0;
					break;
				};
			} else {
				sQuery1 = sQuery; 
				sQuery2 = sQuery;
			}

			var oFilter1 = new Filter(sField1 , "EQ", sQuery1);
			var oFilter2 = new Filter(sField2 , sOperation, sQuery2);
			
			var oFinalFilter = new Filter({
				filters : [
					oFilter1,
					oFilter2
				],
				and : false
			})
			
			oBinding.filter(oFinalFilter);
			
		},
		onSubmit(){
			var selectedIndicies = this._table.getSelectedIndices();
			var selectedRows = [];
			
			selectedIndicies.forEach(index => {
				selectedRows.push(this._table.getContextByIndex(index).getObject())
			});
			
			if (selectedRows.length == 0){
				throw new Error("need choose something");
				return;
			}
			
			this.fireEvent("getSelectedRows",{
				result : selectedRows
			});
			this.__res(selectedRows)
			this.close();
			//return selectedRows;
			
		},
		resizeHandler : function(oEvent){
            
            var headerNode = this.$("header")[0] ? this.$("header")[0] : {offsetHeight : 0};
            var searchFieldNode = this._searchField.$()[0] ? this._searchField.$()[0] : {offsetHeight : 0};
            var tableTitleNode = this.$("label")[0] ? this.$("label")[0] : {offsetHeight : 0};
            //var firstRowNode = this._table.$("rows-row0")[0] ? this._table.$("rows-row0")[0] : {offsetHeight : 1};
            var footerNode = this.$("footer")[0] ? this.$("footer")[0] : {offsetHeight : 0};
            
            var dialogHeight = this.$()[0].offsetHeight;
            
            var headerHeight = headerNode.offsetHeight; //48
            var searchFieldHeight = searchFieldNode.offsetHeight; //48
            var titleHeight = tableTitleNode.offsetHeight;
            var rowHeight = this._table.getRowHeight() > 0 ? this._table.getRowHeight() : 1 ; //33
            var footerHeight = footerNode.offsetHeight;//48
            
            var resultCount;
            var rowCount = Math.floor(( dialogHeight - headerHeight - searchFieldHeight - rowHeight - footerHeight ) / rowHeight ) ;
            var dataRowCount = this._table.getBinding().getLength();
            var visibleRowCount = this._table.getVisibleRowCount();
            
            if (dataRowCount < rowCount) {
            	resultCount = dataRowCount;
            } else {
            	resultCount = rowCount - 1;
            };
            if (dataRowCount == 0){
            	resultCount = 1 ;
            };
            
            
            //rowCount - число столбцов посчитанное 
            //dataRowCount - число столбцов даты 
            //visibleRowCount - число столбцов видимое
            
            this._table.setVisibleRowCount(resultCount);
            
		},
		getAsyncSelectedRows: function(oEvent){
			return this._promise;
		}
		
	});
});