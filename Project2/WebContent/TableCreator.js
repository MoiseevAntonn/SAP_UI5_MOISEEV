sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel){
	"use strict";
	const TYPE_SIMPLE_TABLE = "simple_table",
		TYPE_TREE_TABLE = "tree_table",
		TYPE_UI_TABLE = "ui_table",
		TYPE_M_TABLE = "m_table";
	
	class TableCreator{
		constructor(oSettings){
			this.sType = oSettings.sType;
			
			//this.aRowsMetadata = oSettings.aRowsMetadata;
			//this.aColumnsMetadata = oSettings.aColumnsMetadata;
			
			this.sMetadataModelName = oSettings.sMetadataModelName;
			this.sMetadataColumnsPath = oSettings.sMetadataColumnsPath;
			
			this.sDataModelName = oSettings.sDataModelName;
			this.sDataRowsPath = oSettings.sDataRowsPath;
			
			this.mTableSettings = oSettings.mTableSettings;
			
			this.sTableStyleClass = oSettings.sTableStyleClass
			
			this.aCustomData = oSettings.aCustomData;
			
			this.fCheckBoxEventHandler = oSettings.fCheckBoxEventHandler;
			if (!this.fCheckBoxEventHandler){
				this.fCheckBoxEventHandler = function(oEvent){};
			};
			this.fCardHandler = oSettings.fCardHandler;
			if (!this.fCardHandler){
				this.fCardHandler = function(oEvent){};
			};
			
			this.sArrayNames = oSettings.sArrayNames
			
			this.oTable = oSettings.oTable;
			
			if (!this.oTable){
				this.oTable = new sap.ui.table.Table();
			};
			
			if (this.mTableSettings){
				this.oTable.mSettings = this.mTableSettings;
			};
			
			if (this.sTableStyleClass){
				this.oTable.addStyleClass(this.sTableStyleClass);
			} else {
				this.oTable.addStyleClass("sapUiResponsiveMargin");
			};
			
			if (this.sType == TYPE_SIMPLE_TABLE){
				
				if (this.oTable instanceof sap.ui.table.Table){
					if (this.sDataModelName && this.sDataRowsPath){
						this.oTable.bindAggregation('rows',{
							model: this.sDataModelName,
							path : this.sDataRowsPath
						});
					};
					
					if (this.sMetadataModelName && this.sMetadataColumnsPath){
						this.oTable.bindAggregation('columns',{
							model: this.sMetadataModelName,
							path : this.sMetadataColumnsPath,
							factory : function(sId,oColumnContext){
								var oColumn = new sap.ui.table.Column({
									label: new sap.m.Label({
										text:{
											model : this.sMetadataModelName,
											path : "label"
										}
									}),
									width:{
										model : this.sMetadataModelName,
										path : "width"
									}
								});
						
								var oTemplate = this.getSimpleTemplate(oColumnContext,null,this.sDataModelName);
								oColumn.setTemplate(oTemplate);
							
								return oColumn;
							}.bind(this)
						});
						
					};
				};
				if (this.oTable instanceof sap.m.Table){
					if (this.sMetadataModelName && this.sMetadataColumnsPath){
						this.oTable.bindAggregation('columns',{
							model: this.sMetadataModelName,
							path : this.sMetadataColumnsPath,
							template : new sap.m.Column({
								header: new sap.m.Text({
									text:{
										model:this.sMetadataModelName,
										path: "label"
									}
								}),
								width : {
									model : this.sMetadataModelName,
									path : "width"
								}
							})
						});
					};
					
					if (this.sDataModelName && this.sDataRowsPath){
						this.oTable.bindAggregation('items',{
							model: this.sDataModelName,
							path : this.sDataRowsPath,
							factory : function(sId , oRowCtx){
								
								var that = this;
								
								var oCLI = new sap.m.ColumnListItem();
								
								oCLI.bindAggregation("cells", {
									model: this.sMetadataModelName,
									path : this.sMetadataColumnsPath,
									factory: function(sId, oClmnCtx){
										return that.getSimpleTemplate(oClmnCtx, oRowCtx,that.sDataModelName);
									}
								});
								
								return oCLI;
							}.bind(this)
						});
					};
				}
				
				
				if (this.oTable instanceof sap.ui.table.TreeTable){
					
					var arrayNames = this.sArrayNames || 'results';
					
					if (this.sDataModelName && this.sDataRowsPath){
						this.oTable.bindAggregation('rows',{
							model: this.sDataModelName,
							path : this.sDataRowsPath,
							parameters:{
								arrayNames:[arrayNames]
							}
						});
					};
					
					if (this.sMetadataModelName && this.sMetadataColumnsPath){
						this.oTable.bindAggregation('columns',{
							model: this.sMetadataModelName,
							path : this.sMetadataColumnsPath,
							factory : function(sId,oColumnContext){
								var oColumn = new sap.ui.table.Column({
									label: new sap.m.Label({
										text:{
											model : this.sMetadataModelName,
											path : "label"
										}
									}),
									width:{
										model : this.sMetadataModelName,
										path : "width"
									}
								});
						
								var oTemplate = this.getSimpleTemplate(oColumnContext,null,this.sDataModelName);
								oColumn.setTemplate(oTemplate);
							
								return oColumn;
							}.bind(this)
						});
						
					};
				};
			};
			
			if (this.sType == TYPE_UI_TABLE && this.oTable instanceof sap.ui.table.Table){
				
				if (this.sMetadataModelName && this.sMetadataColumnsPath){
					this.oTable.bindAggregation('columns',{
						model: this.sMetadataModelName,
						path : this.sMetadataColumnsPath,
						factory: this.сolumnFactoryUITable.bind(this)
					});
				};
				
				if (this.sDataModelName && this.sDataRowsPath){
					this.oTable.bindAggregation('rows',{
						model: this.sDataModelName,
						path : this.sDataRowsPath
					});
				};
			};
			if (this.sType == TYPE_M_TABLE && this.oTable instanceof sap.m.Table){
				
				if (this.sMetadataModelName && this.sMetadataColumnsPath){
					this.oTable.bindAggregation('columns',{
						model: this.sMetadataModelName,
						path : this.sMetadataColumnsPath,
						template : new sap.m.Column({
							header: new sap.m.Text({
								text:{
									model:this.sMetadataModelName,
									path: "label"
								}
							}),
							width : {
								model : this.sMetadataModelName,
								path : "width"
							}
						})
					});
				};
				
				if (this.sDataModelName && this.sDataRowsPath){
					this.oTable.bindAggregation('items',{
						model: this.sDataModelName,
						path : this.sDataRowsPath,
						factory : function(sId , oRowCtx){
							
							var that = this;
							
							var oCLI = new sap.m.ColumnListItem();
							
							oCLI.bindAggregation("cells", {
								model: this.sMetadataModelName,
								path : this.sMetadataColumnsPath,
								factory: function(sId, oClmnCtx){
									return that.getTemplate(oClmnCtx, oRowCtx,that.sDataModelName);
								}
							});
							
							return oCLI;
						}.bind(this)
					});
				};
			};
			if (this.sType == TYPE_TREE_TABLE && this.oTable instanceof sap.ui.table.TreeTable){
				
				var arrayNames = this.sArrayNames || 'results';
				
				this.oTable.bindAggregation('columns',{
					path : this.sMetadataColumnsPath,
					model : this.sMetadataModelName,
					factory: this.сolumnFactoryUITable.bind(this)
				});
				
				this.oTable.bindAggregation('rows',{
					model: this.sDataModelName,
					path : this.sDataRowsPath,
					parameters:{
						arrayNames:[arrayNames]
					}
				});
			}
			
			
			
		};
		getTable(){
			return this.oTable;
		}
		сolumnFactoryUITable(sId,oColumnContext){
			
			var oColumn = new sap.ui.table.Column({
				label: new sap.m.Label({
					text:{
						model : this.sMetadataModelName,
						path : "label"
					}
				}),
				width:{
					model : this.sMetadataModelName,
					path : "width"
				}
			});
	
			var oTemplate = this.getTemplate(oColumnContext,null,this.sDataModelName);		
			oColumn.setTemplate(oTemplate);
		
			return oColumn;
		};
		getTemplate(oClmnCtx,oRowCtx,sDataModelName){
			var oControl,
				oData = oClmnCtx.getObject();
			
			var oBindObj = {};
			
			oBindObj.parts = []; 
			oData.field.split("_").forEach(item=>{
				oBindObj.parts.push({path:item,model:sDataModelName});
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
						new sap.ui.core.CustomData({
							key:"level", 
							value: {
								model: sDataModelName,
								path : "level",
								formatter: value => !value ? "" : value + ""
							},
							writeToDom : true
						})
					]
				});
				break;
				
			case "card":
				oControl = new sap.m.Link({
					press: this.fCardHandler.bind(this),
					text : oBindObj
				});
				break;
				
			case "checkbox":
				oControl = new sap.m.CheckBox({
					width : "1em",
					selected: oBindObj
				});
				oControl.attachSelect(this.fCheckBoxEventHandler,this);
				break;
				
			default:
				oControl = new sap.m.Text({
					text:oBindObj
				});
			};
			return oControl;
		};
		getSimpleTemplate(oClmnCtx,oRowCtx,sDataModelName){
			var oControl,
				oData = oClmnCtx.getObject();
			
			var oBindObj = {};
			
			oBindObj.parts = []; 
			oData.field.split("_").forEach(item=>{
				oBindObj.parts.push({path:item,model:sDataModelName});
			});
			
			oControl = new sap.m.Text({
				text : oBindObj
			})
			return oControl;
		};
		checkBoxEventHandler(oEvent){
			
		};
		
	};
	
	return TableCreator;
});