sap.ui.define([
	"sap/m/Button",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
],function(Button,QUnitUtils,createAndAppendDiv){
	"use strict";
	/*QUnit.module("Module A");
	QUnit.test("1. test example",2,function(assert){
		assert.ok(true,"good");
		var value = "hello1"; 
        assert.equal(value, "hello1", "We expect value to be 'hello1'"); 
	})*/
	createAndAppendDiv("myContent");
	var oButton = new Button("testButton",{text:"TestButton"});
	oButton.placeAt("myContent");
	//QUnitUtils.delayTestStart(5000);
	QUnit.module("Module A");
	QUnit.test("1. test example",function(assert){
		assert.ok(true,"this test is fine");
		var value = "hello1"; 
        assert.equal(value, "hello1", "We expect value to be 'hello1'");
        //QUnitUtils.triggerKeydown("myButton", "ENTER");
		assert.ok( true, "another test after the action" );
		//asdasdasd
	});
	QUnit.module("Module B");
	QUnit.test("2. test example",function(assert){
		assert.ok(true,"this test is fine");
		var value = "hello1"; 
        assert.equal(value, "hello1", "We expect value to be 'hello1'");
        QUnitUtils.triggerKeydown("myButton", "ENTER");
		assert.ok( true, "another test after the action" );
	});
})