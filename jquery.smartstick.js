/* 
* Based on jQuery stickyfloat (http://plugins.jquery.com/project/stickyfloat)
* 
* With multiple DOM capability from Weightshift's Scott Robin (nice .each loops + data storage!)
* 
* Modified to allow for top margin on stuck element and usage of position: fixed 
* instead of animating to the new position with position: absolute 
* (this was causing it to look janky in the latest versions of Chrome/Firefox)
*
* Author: Matt Crest @Artletic
*
* Future feature goals:
* - detect if browser supports position: fixed and fallback to animating position: absolute if not
*/
(function($){
    $.fn.smartstick = function(options) {
      var opts = $.extend(
        { 
      		duration	: 0,
      		topOffset	: 0, 
      		lockBottom	: true,
			class		: 'fixed', // class for the fixed position element
			bodyClass	: false // class for the fixed position element
      	}, options),
          elements = [];
      
      
      this.each(function() {
        var parentPaddingTop = parseInt($(this).parent().css('paddingTop'));
        
        $(this).data({
          'parentPaddingTop': parentPaddingTop,
          'startOffset': $(this).parent().offset().top - opts.topOffset
        });
        
        if(opts.lockBottom){
      		var bottomPos = $(this).parent().height() - $(this).height() + parentPaddingTop; //get the maximum scrollTop value
      		if( bottomPos < 0 )
      			bottomPos = 0;
      		$(this).data('bottomPos', bottomPos);
      	}
        
        elements.push($(this));
        
      });
      	
    	$(window).scroll(function() {
    	  
    	  var pastStartOffset			= $(document).scrollTop() > opts.topOffset;	// check if the window was scrolled down more than the start offset declared.

    	  $.each(elements, function() {
 //   debug.log($(this).attr('class') + " " + pastStartOffset);	  
    	        
    	    var parentPaddingTop = $(this).data('parentPaddingTop'),
    	        startOffset = $(this).data('startOffset'),
    	        bottomPos = $(this).data('bottomPos');
    	            	    
    	    $(this).stop(); // stop all calculations on scroll event

      		var objFartherThanTopPos	= $(this).offset().top > startOffset;	// check if the object is at it's top position (starting point)
      		var objBiggerThanWindow 	= $(this).outerHeight() < $(window).height();	// if the window size is smaller than the Obj size, then do not animate.
      		      		      		
      		// if window scrolled down more than startOffset OR obj position is greater than
      		// the top position possible (+ offsetY) AND window size must be bigger than Obj size
      		if( (pastStartOffset || objFartherThanTopPos) && objBiggerThanWindow ){
      			var newpos = ($(document).scrollTop() - startOffset + parentPaddingTop);
				$(this).removeClass("bottom").addClass(opts.class);
				if(opts.bodyClass){
					$('body').addClass(opts.bodyClass);
//	debug.log("Scrolled below starting offset for header");	  
//	debug.log(pastStartOffset + " " + objFartherThanTopPos + " " + objBiggerThanWindow);	  
				}
      			if ( newpos > bottomPos ) { // At the bottom of the container
      				newpos = bottomPos;
      				$(this).removeClass(opts.class).addClass("bottom");
      			}
//	debug.log("Scrolled up? " + $(document).scrollTop() < startOffset);
      			if ( $(document).scrollTop() < startOffset ){ // if window scrolled < starting offset, then reset Obj position (opts.offsetY);
      				newpos = parentPaddingTop;
					$(this).removeClass(opts.class).removeClass("bottom");
				}
				
				if(opts.bodyClass){
					if ( $(document).scrollTop() < opts.topOffset ){
						$(this).removeClass(opts.class);
						$('body').removeClass(opts.bodyClass);
//				debug.log("Scrolled above starting offset for header");	  
					}
				}
      		//	$(this).animate({ top: newpos }, opts.duration );
      		} else {
      			$(this).removeClass(opts.class); // Above the parent container, back to position:absolute
      			if(opts.bodyClass){
      				$('body').removeClass(opts.bodyClass);				
      			}
      		}
      		
    	  });
    	  
    	});
    };
})(jQuery);
