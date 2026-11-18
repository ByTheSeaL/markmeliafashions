/******************************************************
	* jQuery plug-in
	* Easy Background Image Resizer
	* Developed by J.P. Given (http://johnpatrickgiven.com)
	* Useage: anyone so long as credit is left alone
******************************************************/

var containerObj;

(function($) {
	// plugin definition
	$.fn.ezBgResize = function(options) {
		// First position object
		containerObj = this;
		
		containerObj.css("visibility","hidden");
		
		$(window).load(function() {
			resizeImage();
		});
		
		$(window).bind("resize",function() {
			resizeImage();
		});
		
	};
	
	function resizeImage() {

		containerObj.css({
			"width":getWindowWidth() + "px",
			"height":getWindowHeight() + "px"
		});
		
		// reset style set width and height in img
		containerObj.children('img').css("width", "");
		containerObj.children('img').css("height", "");
		
		// Resize the img object to the proper ratio of the window.
		var iw = containerObj.children('img').width();
		var ih = containerObj.children('img').height();		

		var width = 0;
		var height = 0;
		
		// if ((getWindowWidth() + 0) > (getWindowHeight() + 0)) {
			// // Window width > Width Height
			
			if (iw > ih) {
				// Image width > Image height
				
				var fRatio = iw/ih; // (ratio of width to height (always > 1))
				
				width = getWindowWidth();
				height = Math.round(width * (1/fRatio));

				if(height > getWindowHeight()) {
					// new image height > Window Height
				
					var fRatio = ih/iw; // (ratio of height to width (always < 1))
					
					height = getWindowHeight();
					width = Math.round(getWindowHeight() * (1/fRatio));
					
				}
				
				if (getWindowHeight() > height)
				{
					containerObj.css("margin-top", ( (getWindowHeight() - height) / 2) );
					containerObj.css("margin-left", "0" );
				}
				else
				{
					containerObj.css("margin-top", "0" );
					containerObj.css("margin-left", ( (getWindowWidth() - width) / 2) );
				}
				
			} else {
				// Image height > Image width
			
				var fRatio = ih/iw; // (ratio of height to width (always > 1))
				
				height = getWindowHeight();
				width = Math.round(height * (1/fRatio));
				
				if(width > getWindowWidth()) {
					// new image width > Window Width
				
					var fRatio = iw/ih; // (ratio of width to height (always < 1))
					
					height = getWindowHeight();
					width = Math.round(getWindowHeight() * (1/fRatio));
				}
				
				if (getWindowWidth() > width)
				{
					containerObj.css("margin-left", ( (getWindowWidth() - width) / 2) );
					containerObj.css("margin-top", "0" );
				}
				else
				{
					containerObj.css("margin-left", "0" );
					containerObj.css("margin-top", ( (getWindowHeight() - height) / 2) );					
				}
			}
		// } else {
			// // Window height > Window width
		
			// var fRatio = ih/iw;
			
			// height = getWindowHeight();
			// width = Math.round(getWindowHeight() * (1/fRatio));
			// //containerObj.css("left", (getWindowWidth() - ih) < 0 ? 0 : ( (getWindowWidth() - ih) / 2) );
		// }
		
		containerObj.children('img').css("height", height + "px");
		containerObj.children('img').css("width", width + "px");
					
		containerObj.css("visibility","visible");
	}
	
	// private function for debugging
	function debug($obj) {
		if (window.console && window.console.log) {
			window.console.log('Window Width: ' + $(window).width());
			window.console.log('Window Height: ' + $(window).height());
		}
	};
	
	// Dependable function to get Window Height
	function getWindowHeight() {
		// var windowHeight = 0;
		// if (typeof(window.innerHeight) == 'number') {
			// windowHeight = window.innerHeight;
		// }
		// else {
			// if (document.documentElement && document.documentElement.clientHeight) {
				// windowHeight = document.documentElement.clientHeight;
			// }
			// else {
				// if (document.body && document.body.clientHeight) {
					// windowHeight = document.body.clientHeight;
				// }
			// }
		// }
		return $(window).height();
	};
	
	// Dependable function to get Window Width
	function getWindowWidth() {
		// var windowWidth = 0;
		// if (typeof(window.innerWidth) == 'number') {
			// windowWidth = window.innerWidth;
		// }
		// else {
			// if (document.documentElement && document.documentElement.clientWidth) {
				// windowWidth = document.documentElement.clientWidth;
			// }
			// else {
				// if (document.body && document.body.clientWidth) {
					// windowWidth = document.body.clientWidth;
				// }
			// }
		// }
		return $(window).width();
	};
})(jQuery);