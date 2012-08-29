/**************************
* Application
**************************/
Timeline = Em.Application.create();

/**************************
* Models
**************************/
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
	isEnabled: false,
	position: function() {
		var position = '';
		var num_dots = Timeline.dotsController.content.length;
		var position = this.getPosition();

		if( ( position/num_dots ) > 0.5 ) {
			position = 'right';
		} else {
			position = 'left';
		}
		return position;

	}.property('Timeline.dotsController.@each'),

	color: '#999999',
	display: 'none',

	showYear: false,
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
	}.property('width', 'height', 'border', 'border_radius', 'margin_left', 'background'),
	getPosition: function() {
		for(var i=0;i<Timeline.dotsController.content.length;i++){ 
		    if(Timeline.dotsController.content[i]==this)
		    	return i;
		}
	}
});

/**************************
* Controllers
**************************/
Timeline.dotsController = Em.ArrayController.create({
	content: [],
	sort: function() {
	    var content = this.get("content");
	    this.set('content', Ember.copy(content.sort(), true));
	    },
	addToTimeline: function() {
	    var t = Timeline.Dot.create();
	    this.pushObject(t);
	    },
	highlightDot: function(e) {
		//alert('highlightDot');
		
		var dot = e.content;
		dot.set('isEnabled', true);
		dot.set('background', '#FFFFFF');
		dot.set('color', '#333333');
		dot.set('border', '4px solid #333333');
		dot.set('display', 'block');
		dot.set('showYear', true);
	},
	unhighlightDot: function(e) {
		
		var dot = e.content;
		dot.set('isEnabled', false);
		dot.set('background', '#0066FF');
		dot.set('color', '#999999');
		dot.set('border', '4px solid #666666');
		dot.set('display', 'none');
		dot.set('showYear', false);
	},
	addToTimelineWithContent: function() {
		var me = this;
		var title = me.get("title");
		var year = me.get("year");
		var text = me.get("text");
		var t = Timeline.Dot.create({
		    year: year,
		    title: title,
		    text: text,
		});
		me.pushObject(t);
		// me.sort();
	}
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


Timeline.EntryTextField = Em.TextField.extend({

});

Timeline.EntryTitleField = Em.TextField.extend({

});

Timeline.EntryYearField = Em.TextField.extend({

});

Timeline.EntryTextField = Em.TextField.extend({
    insertNewline: function(){
        Timeline.dotsController.addToTimelineWithContent();
    }
});



// Testing

anUndorderedListView = Em.CollectionView.create({
    tagName: 'div',
    elementId: 'entries',
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
      	classNameBindings: ['isEnabled:enabled:disabled'],
      	isEnabled: false,
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