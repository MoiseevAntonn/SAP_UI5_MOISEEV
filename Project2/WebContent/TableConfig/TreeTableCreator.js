sap.ui.define([
	"sap/ui/task/TableConfig/UiTableCreator"
], function(UiTableCreator){
	"use strict";
	
	return UiTableCreator.extend('TreeTableCreator',{
		constructor : function(oSettings){
			UiTableCreator.prototype.constructor.apply(this,arguments);
			this.arrayNames = oSettings.arrayNames;
			
		},

		bindRows : function(){
			this._table.bindAggregation('rows',{
				model: "row",
				path : this._dataRowsPath,
				parameters:{
					arrayNames:this.arrayNames
				}
			});
		},
	});

},true);