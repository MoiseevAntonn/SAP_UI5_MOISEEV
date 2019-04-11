sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/task/TableConfig/BaseConfig"
], function(Object,BaseConfig){
	"use strict";
	
	return Object.extend('UiTableCreator',{
		constructor : function(oSettings){
			
			var that = this;
			
			this._columnModel = oSettings.column.model;
			this._metadataColumnsPath = oSettings.column.path;
			
			this._rowModel = oSettings.row.model;
			this._dataRowsPath = oSettings.row.path;
			
			this._table = oSettings.table;
			
			this._columnFactory = oSettings.columnFactory;
		
			this._cellFactory = oSettings.cellFactory;
			
			this.checkProps();
			
		},
		
		checkProps:function(){
			if (!(this._table instanceof sap.ui.table.Table)){
				throw new Error("oTable is required parameter");
			};
			if (!(this._columnFactory instanceof BaseConfig)){
				throw new TypeError("oColumnConfig must be descendant of BaseConfig")
			};
			if (!(this._cellFactory instanceof BaseConfig)){
				throw new TypeError("oCellConfig must be descendant of BaseConfig")
			};
			
		},
		
		build:function(){
			this.bindModel();
			this.bindColumns();
			this.bindRows();
			
			return this._table;
		},
		
		getTable:function(){
			return this._table;
		},
		getRowModel:function(){
			return this._rowModel;
		},
		getColumnModel:function(){
			return this._columnModel;
		},
		getColumnPath:function(){
			return this._metadataColumnsPath;
		},
		getRowPath:function(){
			return this._dataRowsPath;
		},
		
		bindRows : function(){
			this._table.bindAggregation('rows',{
				model: "row",
				path : this._dataRowsPath
			});
		},
		
		bindColumns : function(){
			var that = this;
			
			this._table.bindAggregation('columns',{
				model: "column",
				path : this._metadataColumnsPath,
				factory : function(sId, oClmnCtx){
					
					var oColumn = that._columnFactory.getElement(oClmnCtx, "column");
					var oTemplate = that._cellFactory.getElement(oClmnCtx, "row");
					
					oTemplate.bindElement({
						model:"column",
						path: oClmnCtx.getPath()
					});
					
					oColumn.setTemplate(oTemplate);
					
					return oColumn;
				}
			});
		
		},
		bindModel : function(){
			this._table.setModel(this._columnModel,"column");
			this._table.setModel(this._rowModel,"row");
		}
	});

},true);