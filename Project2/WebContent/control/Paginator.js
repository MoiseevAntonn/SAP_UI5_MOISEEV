sap.ui.define([
	"sap/m/SegmentedButton",
	"sap/m/SegmentedButtonItem"
], function(SegmentedButton,SegmentedButtonItem){
	"use strict";
	
	const RIGHT_BUTTON_KEY = "right";
	const FAR_RIGHT_BUTTON_KEY = "far-right";
	const LEFT_BUTTON_KEY = "left";
	const FAR_LEFT_BUTTON_KEY = "far-left";
	const NEXT_BUTTON_KEY = "next";
	const FIRST_KEY = "1";
	
	return SegmentedButton.extend("Paginator",{
		metadata : {
			properties : {
				
				visibleItemsCount : {
					type : "int",
					defaultValue : 2
				},
				dataLength : {
					type : "int"
				},
				allowedButtonCount : {
					type : "int",
					defaultValue : 5
				}
			},
			events : {
				calculateIndexAndLength : {
					parameters : {
						startIndex : {type : "int"},
						length : {type : "int"}
					}
				}
			}
		},
		init : function () {
			
			SegmentedButton.prototype.init.apply(this,arguments);
			
			this.attachSelectionChange(this.selectionChangeHandler,this);
			
			this.isInitialized = false;
			
			
			
		},
		renderer :{}, 
		
		onBeforeRendering: function() {
			if(SegmentedButton.prototype.onBeforeRendering) {
				SegmentedButton.prototype.onBeforeRendering.apply(this,arguments);
            };
            
            if (!this.isInitialized){ 
            	this.selectNumerableKey(this.getFirstKey());
            	this.assemblePaginator();
    			
            	if (this.getItemByKey(this.getFirstKey())){
            		this.fireSelectionChange({item : this.getItemByKey(this.getFirstKey())});
            	} else {
            		this.fireCalculateIndexAndLength({startIndex: 0,length: this.getDataLength()});
            	}
            	
            	this.isInitialized = true;
            }
			
		},
		
		assemblePaginator : function(){
			
			this.removeAllItems();
		
			var buttonCount = Math.ceil(this.getDataLength() / this.getVisibleItemsCount());
			var allowedButtonCount = this.getAllowedButtonCount();
			
			if (buttonCount <= 1){
            	return;
			}
			
			
			
			var farLeftButton = new SegmentedButtonItem({
				icon : "sap-icon://close-command-field",
				key : FAR_LEFT_BUTTON_KEY
			});
			
			var leftButton = new SegmentedButtonItem({
				icon : "sap-icon://navigation-left-arrow",
				key : LEFT_BUTTON_KEY
			});
			
			var rightButton = new SegmentedButtonItem({
				icon : "sap-icon://navigation-right-arrow",
				key : RIGHT_BUTTON_KEY
			});
			
			var farRightButton = new SegmentedButtonItem({
				icon : "sap-icon://open-command-field",
				key : FAR_RIGHT_BUTTON_KEY
			});
			
			var oNextButton = new SegmentedButtonItem({
            	text : "...",
            	key : NEXT_BUTTON_KEY
            });
	           
			this.addItem(farLeftButton);
	        this.addItem(leftButton);
	        
	        if (buttonCount <= allowedButtonCount){	
		        this.addNumerableButtonWithKeyFromTo({from: 1,to: buttonCount})
            
			} else {
	           	var currentTriplet = this.getCurrentButtonTriplet();
	           	
	           	if (currentTriplet >= buttonCount){
	           		var remainedButtonCount = buttonCount - (currentTriplet - this.getAllowedButtonCount());
		       		
	           		this.addNumerableButtonWithKeyFromTo({from: (currentTriplet - this.getAllowedButtonCount() + 1),to: (currentTriplet - this.getAllowedButtonCount() + remainedButtonCount) })
	           
	           	} else {    		
	           		this.addNumerableButtonWithKeyFromTo({from: (currentTriplet - this.getAllowedButtonCount() + 1),to: currentTriplet});
	            	
	            	this.addItem(oNextButton);
	           	}
	        }
	        
	        this.addItem(rightButton);
	        this.addItem(farRightButton);
	        
	        this.selectNumerableKey(this.selectedNumerableKey);
			
		},
		
		selectionChangeHandler : function(oEvent){
			var button = oEvent.getParameter("item");
			var startIndex;
			
			var length = this.getVisibleItemsCount();
			
			switch (button.getKey()) {
			case FAR_LEFT_BUTTON_KEY:
				startIndex = 0;
				
				this.selectNumerableKey(this.getFirstKey());
				
				this.assemblePaginator();
				
				break;
			case LEFT_BUTTON_KEY:
				var intCurrentKey = parseInt(this.selectedNumerableKey);
				
				startIndex = (intCurrentKey !== 1) ? this.getVisibleItemsCount() * (intCurrentKey - 2) : 0 ;
				
				this.selectNumerableKey((intCurrentKey - 1).toString());
				
				if (intCurrentKey === 1) {
					this.selectNumerableKey(this.getFirstKey());
				}
				
				this.assemblePaginator();
				break
			case RIGHT_BUTTON_KEY:
				var intCurrentKey = parseInt(this.selectedNumerableKey);
				
				if (this.selectedNumerableKey === this.getLastKey()){
					startIndex = this.getVisibleItemsCount() * (intCurrentKey - 1);
					
					this.selectNumerableKey(this.getLastKey());
				} else {
					startIndex = this.getVisibleItemsCount() * (intCurrentKey ) ;
					
					this.selectNumerableKey((intCurrentKey + 1).toString());
				}
				
				this.assemblePaginator();
				break;
			case FAR_RIGHT_BUTTON_KEY:
				var intLastKey = parseInt(this.getLastKey());
				
				startIndex = this.getVisibleItemsCount() * (intLastKey - 1);
				
				this.selectNumerableKey(this.getLastKey());
				
				this.assemblePaginator();
				break;
			case NEXT_BUTTON_KEY:
				
				var currentTriplet = this.getCurrentButtonTriplet();
				var intUtmostKey = currentTriplet + 1; 
				
				this.selectNumerableKey(intUtmostKey.toString());
				
				this.assemblePaginator();
				this.fireSelectionChange({item : this.getItemByKey(intUtmostKey.toString())});
				
				return;
				
				break;
			default :
				
				var intCurrentKey = parseInt(button.getKey());
				
				var startIndex = this.getVisibleItemsCount() * (intCurrentKey - 1);
				
				this.selectNumerableKey(button.getKey());
			}
			
			this.fireCalculateIndexAndLength({startIndex: startIndex,length: length});
		},
		
		getItemByKey : function (sKey){
			var items = this.getItems();
			return items.find(item => item.getKey() === sKey);
		},
		
		getLastKey : function(){
			return Math.ceil(this.getDataLength().toString() / this.getVisibleItemsCount()).toString();
		},
		
		getFirstKey : function(){
			return FIRST_KEY;
		},
		
		_refreshControl : function(){
			this.isInitialized = false;
			this.rerender();
		},
		
		selectNumerableKey : function(sKey){
			this.selectedNumerableKey = sKey;
			this.setSelectedKey(sKey);
		},
		
		setDataLength : function(iDataLength){
			this.setProperty("dataLength",iDataLength);
			this._refreshControl();
		},
		
		setVisibleItemsCount : function(iVisibleItemsCount){
			this.setProperty("visibleItemsCount",iVisibleItemsCount);
			this._refreshControl();
		},
		
		addNumerableButtonWithKeyFromTo : function(oInterval){
			var {from,to} = oInterval;
			
			for (let i = from ; i <= to; i++){
				let oIButton = new SegmentedButtonItem({
	            	text : i.toString(),
	            	key : i.toString()
	            });
           		this.addItem(oIButton);
			}	
		},
		
		getCurrentButtonTriplet : function(){
			var currentNumerableKey = parseInt(this.selectedNumerableKey);
			return Math.ceil(currentNumerableKey / this.getAllowedButtonCount()) * this.getAllowedButtonCount();
		},
		
		
		
	});
});