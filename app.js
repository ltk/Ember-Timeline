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
	shortTitle: 'Default Short Title',

	width: '22px',
	height: '22px',
	border: '3px solid white',
	border_radius: '13px',
	margin_left: '13px',
	background: '#E9E9E9',
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
	showing:false,
	showEntry: false,
	showShortTitle: false,

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
	unshow: function() {
		var controller = this;
		this.content.forEach(function(item){
			controller.hide(item); //item.set('showing', false);
		});
	},
	hide: function(dot) {
		dot.set('showing', false);
		dot.set('display', 'none');
		dot.set('showYear', false);
		dot.set('isEnabled', false);
		dot.set('background', '#E9E9E9');
	},
	addToTimeline: function() {
	    var t = Timeline.Dot.create();
	    this.pushObject(t);
	    },
	highlightDot: function(e) {
		//alert('highlightDot');
		
		var dot = e.content;
		dot.set('isEnabled', true);
		dot.set('background', '#54A5DA');
		// dot.set('color', '#333333');
		// dot.set('border', '4px solid #333333');
		// dot.set('display', 'block');
		dot.set('showShortTitle', true);
	},
	unhighlightDot: function(e) {
		
		var dot = e.content;
		if(!dot.showing){
			dot.set('isEnabled', false);
			dot.set('background', '#E9E9E9');
		}
		
		// dot.set('color', '#999999');
		// dot.set('border', '4px solid #666666');
		// dot.set('display', 'none');
		dot.set('showShortTitle', false);
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
	},
	pushToTimeline: function(new_title, new_year, new_text, new_shortTitle) {
		var me = this;
		var t = Timeline.Dot.create({
		    year: new_year,
		    title: new_title,
		    text: new_text,
		    shortTitle: new_shortTitle
		});
		me.pushObject(t);
		// me.sort();
	},
	show: function(e){
		this.unshow();
		var dot = e.content;
		dot.set('showing', true);
		dot.set('display', 'block');
		dot.set('showYear', true);
		dot.set('isEnabled', true);
		dot.set('background', '#54A5DA');
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
        },
        mouseUp: function(e){
        	Timeline.dotsController.show(this);
        }
      })
    });

    dotsListView.appendTo('body');
    anUndorderedListView.appendTo('body');

    var post_data = {

    		event1: {
    			shortTitle: 'The Clean Air Act',
    			title: 'The Clean Air Act',
    			year: 1990,
    			text: 'In 1990, CCAP built an effective coalition and played a major role in the passage of SO2 emissions trading program in the Clean Air Act Amendments.  This emission trading program is a landmark policy in the environmental field.'
    		},
    		event2: {
    			shortTitle: 'California Climate Legislation',
    			title: 'Implementation of California Climate Legislation AB-32, Global Warming Solutions Act of 2006',
    			year: 2003,
    			text: 'In January 2006, CCAP released a year-long study on California that showed how Governor Schwarzenegger\'s goal of reducing greenhouse gas (GHG) emissions to 2000 levels by 2010 could be met at no net cost to California consumers.  The report was critical to the enactment of AB 32, The Global Warming Solutions Act of 2006.'
    		},
    		event3: {
    			shortTitle: 'State Climate GHG Reduction Programs',
    			title: 'State Climate GHG Reduction Programs',
    			year: 2004,
    			text: 'Over the past 15 years, CCAP has facilitated dialogues and provided analysis  across the U.S.  to help states  develop and implement programs to reduce GHG emissions.  These states include Connecticut (2004), Maine (2004), Massachusetts (2004), Minnesota (1999), New Jersey (1998), New York (2003) and Wisconsin (1993).  CCAP’s work for New York resulted in the creation of the Regional Greenhouse Gas Initiative (RGGI), the first cap-and trade program to reduce carbon emissions in the United States.'
    		},
    		event4: {
    			shortTitle: 'EPA and Clean Air Act Advisory Committee',
    			title: 'EPA and Clean Air Act Advisory Committee',
    			year: 2004,
    			text: 'CCAP\'s participation on U.S. Environmental Protection Agency\'s (EPA) Clean Air Act Advisory Committee (CAAAC) from 2004-2005 resulted in the Committee\'s recommendation that EPA evaluate industrial, commercial and institutional boilers for possible regulation to assist states in attaining the national ambient air quality standards.  CCAP\'s participation on the CAAAC also resulted in a recommendation to evaluate national/regional requirements for use of low sulfur fuels in residential applications.'
    		},
    		event5: {
    			shortTitle: 'The Clean Air Act',
    			title: 'The Clean Air Act',
    			year: 2006,
    			text: 'In 1990, CCAP built an effective coalition and played a major role in the passage of SO2 emissions trading program in the Clean Air Act Amendments.  This emission trading program is a landmark policy in the environmental field.'
    		},
    		event6: {
    			shortTitle: 'California Climate Legislation',
    			title: 'Implementation of California Climate Legislation AB-32, Global Warming Solutions Act of 2006',
    			year: 2008,
    			text: 'In January 2006, CCAP released a year-long study on California that showed how Governor Schwarzenegger\'s goal of reducing greenhouse gas (GHG) emissions to 2000 levels by 2010 could be met at no net cost to California consumers.  The report was critical to the enactment of AB 32, The Global Warming Solutions Act of 2006.'
    		},
    		event7: {
    			shortTitle: 'State Climate GHG Reduction Programs',
    			title: 'State Climate GHG Reduction Programs',
    			year: 2009,
    			text: 'Over the past 15 years, CCAP has facilitated dialogues and provided analysis  across the U.S.  to help states  develop and implement programs to reduce GHG emissions.  These states include Connecticut (2004), Maine (2004), Massachusetts (2004), Minnesota (1999), New Jersey (1998), New York (2003) and Wisconsin (1993).  CCAP’s work for New York resulted in the creation of the Regional Greenhouse Gas Initiative (RGGI), the first cap-and trade program to reduce carbon emissions in the United States.'
    		},
    		event8: {
    			shortTitle: 'EPA and Clean Air Act Advisory Committee',
    			title: 'EPA and Clean Air Act Advisory Committee',
    			year: 2012,
    			text: 'CCAP\'s participation on U.S. Environmental Protection Agency\'s (EPA) Clean Air Act Advisory Committee (CAAAC) from 2004-2005 resulted in the Committee\'s recommendation that EPA evaluate industrial, commercial and institutional boilers for possible regulation to assist states in attaining the national ambient air quality standards.  CCAP\'s participation on the CAAAC also resulted in a recommendation to evaluate national/regional requirements for use of low sulfur fuels in residential applications.'
    		}
    };

    for (eventObj in post_data) {
    	Timeline.dotsController.pushToTimeline(post_data[eventObj].title, post_data[eventObj].year, post_data[eventObj].text, post_data[eventObj].shortTitle);
    }
    