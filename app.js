/**************************
* Application
**************************/
Timeline = Em.Application.create();

/**************************
* Models
**************************/
Timeline.Entry = Em.Object.extend({
	title: 'Default Title',
	year: '2012',
	text: 'This is default text.'
});

Timeline.Dot = Em.Object.extend({
	title: 'Default Title',
	year: '2012',
	text: 'This is default text.',

	width: '22px',
	height: '22px',
	border: '4px solid #666666',
	border_radius: '13px',
	margin_left: '13px',
	background: '#0066FF',

	color: '#999999',
	display: 'block',

	showEntry: false,

	isFirst: function() {
		if( this == Timeline.dotsController.firstObject() ){
			return true;
		}
	}.property(),
	color_style: function() {
		return "display:" + this.get('display') + ";color:" + this.get('color') + ";";
	}.property('display', 'color'),
	style: function() {
		return "width:" + this.get('width') + ";height:" + this.get('height') + ";border:" + this.get('border') + ";border-radius:" + this.get('border_radius') + ";margin-left:" + this.get('margin_left') + ";background:" + this.get('background') + ";";
	}.property('width', 'height', 'border', 'border_radius', 'margin_left', 'background')
});

/**************************
* Controllers
**************************/
Timeline.entriesController = Em.ArrayController.create({
	content: [],
	makeNewEntry: function() {
		var t = Timeline.Entry.create();
		this.pushObject(t);
		return t;
	}
});

Timeline.dotsController = Em.ArrayController.create({
	content: [],
	addToTimeline: function() {
	    var t = Timeline.Dot.create();
	    this.pushObject(t);
	    Timeline.entriesController.makeNewEntry();
	    },
	showEntry: function(e) {
		var dot = e;
		dot.set('background', '#FFFFFF');
		//alert('this is in the controller')
	},
	highlightDot: function(e) {
		//alert('highlightDot');
		
		var dot = e.content;
		dot.set('background', '#FFFFFF');
		dot.set('color', '#333333');
		dot.set('border', '4px solid #333333');
		dot.set('display', 'block');
	},
	unhighlightDot: function(e) {
		var dot = e.content;
		dot.set('background', '#0066FF');
		dot.set('color', '#999999');
		dot.set('border', '4px solid #666666');
		dot.set('display', 'block');
	},
});

/**************************
* Views
**************************/
Timeline.timelineView = Em.View.extend({
	contentBinding: 'controller.dotsController',
	mouseEnter: function(e) {
		//var element = $(e.target).closest('li');
		//element.css('background', 'green');
		//alert("Mouse enter!");
		//console.log(evt.toElement);

	},
	mouseLeave: function(e) {
		//var element = $(e.target).closest('li');
		//element.css('background', 'green');
		//alert("Mouse enter!");
		//console.log(evt.toElement);
	},
	showEntry: function(e) {

		alert('show the entry!');
	}
});



// Testing

anUndorderedListView = Em.CollectionView.create({
    tagName: 'ul',
    content: Timeline.dotsController.content, //['A','B','C'],
    emptyView: Ember.View.extend({
          template: Ember.Handlebars.compile("The collection is empty")
        }),
    itemViewClass: Em.View.extend({
    	itemClass: 'item-class',
      templateName: 'entry',
      mouseEnter: function(e) {
      	//this.triggerAction();
      	Timeline.dotsController.highlightDot(this);
      },
      mouseLeave: function(e) {
      	Timeline.dotsController.unhighlightDot(this);
      }
    })
  });

  

  dotsListView = Em.CollectionView.create({
      tagName: 'ul',
      elementId: 'dots',
      content: Timeline.dotsController.content, //['A','B','C'],
      emptyView: Ember.View.extend({
            template: Ember.Handlebars.compile("The collection is empty")
          }),
      itemViewClass: Em.View.extend({
        templateName: 'dot',
        // attributeBindings: ['style'],
        // style: function() {
        //   	console.log( this );
        //   	return this.content.get('style');
        // }.property( ),
        mouseEnter: function(e) {
        	//this.triggerAction();
        	Timeline.dotsController.highlightDot(this);
        },
        mouseLeave: function(e) {
        	Timeline.dotsController.unhighlightDot(this);
        }
      })
    });

    dotsListView.appendTo('body')
    anUndorderedListView.appendTo('body')