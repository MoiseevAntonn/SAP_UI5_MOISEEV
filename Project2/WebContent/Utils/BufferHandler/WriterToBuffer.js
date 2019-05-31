sap.ui.define([
	"./BaseBufferHandler",
	"./Exceptions/BufferError"
], function(BaseBufferHandler,BufferError){
	"use strict";
	var cWriterToBuffer = BaseBufferHandler.extend("WriterToBuffer",{
		
		constructor : function(oParameters){
			this.data = oParameters.aData;
			this.metadata = oParameters.aMetadata;
			this.mapOfHandlers = oParameters.aMapOfHandlers ? oParameters.aMapOfHandlers : null;
			this.includedField = oParameters.sIncludedField ? oParameters.sIncludedField : "title"
		},
		
		parseData : function(oParams){
			var result = "";
			if (oParams.addTitles){
				result = this._addTitlesToResultString(result,this.includedFields);
			}
			result = this._addDataToResultString(result,this.includedFields);
			return result;
		},
		
		_dataFormatter : function(data,sColumnKey){
			if (this.mapOfHandlers){
				var handlerMap = this.mapOfHandlers.find(item=>item.columnKey == sColumnKey)
				if (handlerMap){
					return handlerMap.handler(data);
				} else {
					return data;
				}
			} else return data;
		},
		
		_addTitlesToResultString : function(sResult){
			this.metadata.forEach(column=>{
				sResult += column[this.includedField];
				sResult += "\t";
			});
			sResult += "\r\n";
			return sResult;
		},
		
		_addDataToResultString : function(sResult){
			this.data.forEach(row => {
				this.metadata.forEach(column=>{
					var {field} = column;
					sResult += this._dataFormatter(row[field],field);
					sResult += "\t";
				});
				sResult += "\r\n";
			});
			return sResult;
		}
	});
	
	cWriterToBuffer.writeToBuffer = function(sInput){
		if (navigator.clipboard){
			return navigator.clipboard.writeText(sInput)
		} else {
			return new Promise(()=>{			
				var inputElem = document.createElement("textarea");
				
				inputElem.value = sInput;
				document.body.appendChild(inputElem);
				inputElem.select();
				
				try {
					var successful = document.execCommand("copy");
					if (!successful) throw new BufferError("wrong input value")
				} catch(err) {};
				
				document.body.removeChild(inputElem)
				
			});
		}
	};
	
	return cWriterToBuffer;
});