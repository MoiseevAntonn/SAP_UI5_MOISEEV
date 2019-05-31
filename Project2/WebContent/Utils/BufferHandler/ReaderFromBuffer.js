sap.ui.define([
	"./BaseBufferHandler",
	"./Exceptions/BufferError"
], function(BaseBufferHandler,BufferError){
	"use strict";
	var cReaderFromBuffer = BaseBufferHandler.extend("ReaderFromBuffer",{
		
		constructor : function(oParameters){
			this.metadata = (oParameters.aMetadata) ? oParameters.aMetadata : null;
			this.typeHandlers = (oParameters.aTypeHandlers) ? oParameters.aTypeHandlers : null;
			if (!this._validateHandlers(this.typeHandlers)) throw new BufferError("wrong array of handlers")
		},
	
		parseData : function(sInput){	
			if (!sInput) throw new BufferError("undefined buffer string");
			var aInputRows = sInput.split("\r\n");
				
			return aInputRows.map(inputRow=>{
				if (inputRow.split("\t").length != this.metadata.length) throw new BufferError("Different count of metadata and buffer value lengths")
				var aInputCell = inputRow.split("\t");
				var item = {};
				
				this.metadata.forEach((columnMetadata,position)=>{
					var {field} = columnMetadata;
					var cellValue = aInputCell[position]
					
					if (!field) throw new BufferError("there must be a field property");
					
					var typeHandlerMap = this.typeHandlers.find(handlerMap=>handlerMap.field === field);
					var transformedValue;
					
					if (!typeHandlerMap) return item[field] = cellValue;
					
					if (typeHandlerMap.verificate){
						if (!typeHandlerMap.verificate(cellValue)) throw new TypeError(`wrong ${field} value`)
					};
					transformedValue = (typeHandlerMap.handler)? typeHandlerMap.handler(cellValue) : cellValue;
					item[field] = transformedValue;
				});
				return item;
			});	
		},
		_validateHandlers : function(aTypeHandlers){
			return aTypeHandlers.every(mapHandler=>{
				if (typeof mapHandler.handler !== "function") return false;
				if (typeof mapHandler.verificate !== "function") return false;
				return true;
			})
		}
	});
	
	cReaderFromBuffer.readFromBuffer = function(){
		return navigator.clipboard.readText();
	};
	cReaderFromBuffer.handleEventObject = function(oEvent){
		var oOriginalEvent = oEvent.originalEvent;
		var clipboardData = oOriginalEvent.clipboardData || window.clipboardData;
		var pastedData = clipboardData.getData("Text");
		
		if (pastedData){
			return Promise.resolve(pastedData);
		};
		return Promise.reject(new BufferError("Cant get buffer data"))
	}
	
	return cReaderFromBuffer;
});
