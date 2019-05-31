sap.ui.define([
	
], function(){
	"use strict";
	
	function BufferError(property){ 
		Error.call(this,property);
		this.name = "BufferError";
		this.message = property;
		
		if (Error.captureStackTrace){
			Error.captureStackTrace(this,BufferError);
		} else {
			this.stack = (new Error()).stack;
		};
	};

	BufferError.prototype = Object.create(Error.prototype);
	
	return BufferError;

});





