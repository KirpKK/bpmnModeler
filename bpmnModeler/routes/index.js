'use strict';
import '../views/css/app.css';
import '../node_modules/bpmn-js/assets/bpmn-font/css/bpmn-embedded.css';
import '../node_modules/diagram-js/assets/diagram-js.css';
import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import builder from 'xmlbuilder';
import nanoImp from 'nano';

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var modeler = new BpmnModeler({ container: canvas });

var newDiagramXML = builder.create('bpmn2:definitions')
	.att({ 'xmlns:xsi':'http://www.w3.org/2001/XMLSchema-instance', 
	'xmlns:bpmn2': 'http://www.omg.org/spec/BPMN/20100524/MODEL', 
	'xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI', 
	'xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC', 
	'xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI', 
	'xsi:schemaLocation': 'http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd', 
	'id': 'sample-diagram',
	'targetNamespace': 'http://bpmn.io/schema/bpmn'})
		.ele('bpmn2:process', { 'id': 'Process_1', 'isExecutable': 'false'})
			.ele('bpmn2:startEvent', { 'id': 'StartEvent_1'}).up()
		.up()
		.ele('bpmndi:BPMNDiagram', { 'id': 'BPMNDiagram_1'})
			.ele('bpmndi:BPMNPlane', { 'id': 'BPMNPlane_1', 'bpmnElement': 'Process_1'})
				.ele('bpmndi:BPMNShape', { 'id': '_BPMNShape_StartEvent_2', 'bpmnElement': 'StartEvent_1'})
				.ele('dc:Bounds', { 'height': '36.0', 'width': '36.0', 'x': '412.0', 'y': '240.0'}).up()
				.up()
			.up()
		.up();
	newDiagramXML.end({ pretty: true });

function createNewDiagram() {
  openDiagram(String(newDiagramXML));
}

function openDiagram(xml) {

  modeler.importXML(xml, function(err) {

    if (err) {
      container
        .removeClass('with-diagram')
        .addClass('with-error');

      container.find('.error pre').text(err.message);

      console.error(err);
    } else {
      container
        .removeClass('with-error')
        .addClass('with-diagram');
    }


  });
}

function saveSVG(done) {
  modeler.saveSVG(done);
}

function saveDiagram(done) {

  modeler.saveXML({ format: true }, function(err, xml) {
    done(err, xml);
  });
}

function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {

      var xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}

///////////////////    DB   /////////////////
  function insertDiagramDB() {
	var name = prompt("Enter diagram's name", 'diagram');

	var nano = nanoImp('http://127.0.0.1:5984');
	var diagrams = nano.db.use('diagrams');

	var diagram;
	modeler.saveXML({ format: true }, function(err, xml) {
	  diagram = xml;
    });

	//Insert diagram
	diagrams.insert({_id: name, diagram: String(diagram)}, name, function(err, body) {
		if (!err){
		console.log(body);
		} else {
			alert(err);
		}
	});
  }
  
  function openDiagramDB() {
	var name = prompt("Enter diagram's name", 'diagram');
	
	var nano = nanoImp('http://127.0.0.1:5984');
	var diagrams = nano.db.use('diagrams');

	var b = false;
   diagrams.view('view_diagram/', 'by_key', { include_docs: true
   }, function(err, body){
		body.rows.forEach(function(row) {
			if(row.id==String(name)){
				b = true;
				if (typeof(row.doc.diagram)=='string') {
					openDiagram(row.doc.diagram);
				} else {
					alert('Diagram is undefined');
				}
			}
		});
		if (!b) alert('No diagram is found');
	});
  }

////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function() {
	
	function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  $('#js-create-diagram').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });
  
  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');
 
    $('#js-download-db').click(function(e) {	
	e.stopPropagation();
    e.preventDefault();
	insertDiagramDB();
	});
	
	$('#js-open-db').click(function(e) {	
	e.stopPropagation();
    e.preventDefault();
	openDiagramDB();
	});

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  var _ = require('lodash');

  var exportArtifacts = _.debounce(function() {

    saveSVG(function(err, svg) {
      setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
    });

    saveDiagram(function(err, xml) {
      setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
    });
	
  }, 500);

  modeler.on('commandStack.changed', exportArtifacts);
});