var global = {	createCookie: function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	eraseCookie: function(name) {
		this.createCookie(name,"",-1);
	}
};


var local = {
	setCookie: function(name, value) {
		global.createCookie(name, value, 30);
	},
	getCookieValue: function(name) {
		if (global.readCookie(name) != null)
			return global.readCookie(name);
		else
			return "";	
	}
};


$(function() {
	
	// reset reveals
	var rev = local.getCookieValue("reveals");
	if (rev != "")
	{
		$("div#reveals").show();
		$(rev).show();
	}
	
	// preload background images
	// $(".dressThumb a").each(function() {
		// var thumb = $(this).siblings("img");	
		// var fileExt = getFileExt(thumb);
		// var src = thumb.attr("src").replace("thumb."+fileExt,"."+fileExt);
		// var img = $('<img src="' + src + '" />').load();
   	// });
	
	// background resizing
	$("body").removeAttr("style");
	$("#bgrd").removeAttr("style");
	
	// load chosen dress from cookie
	var dress = local.getCookieValue("dress");
	var dressThumb = local.getCookieValue("dressThumb");
	var thumbEle;
	var fileExt;
	var startSlide = 0;
	if (dress != "" && dressThumb != "")
	{
		var thumbClass = dressThumb.split(" ")[1];
		thumbEle = $("." + thumbClass + " img");
		startSlide = Math.ceil((thumbClass.substring(2)) / 4) - 1;
	}
	else
	{
		thumbEle = $(".dressThumb img").eq(0);
	}
	sortDress(thumbEle, $("div#bgrd img"), getFileExt(thumbEle));
	
	$("#bgrd").ezBgResize();	
	
	// dress thumbs arrow scrolls
	$("#collScrollerInner").cycle({fx: 'fade', timeout: 0, speed: 200, prev: '#aLeft', next: '#aRight', startingSlide: startSlide});
	
	// dress thumbs click event handler
	$(".dressThumb a").click(function(i) {	
		var thumb = $(this).siblings("img");
		var bgrd = $("div#bgrd img");
		sortDress(thumb, bgrd, getFileExt(thumb));
		return false;
	});
	
	function sortDress(thumb, bgrd, fileExt) {
		var src;
		var img;
		if (thumb.attr("src") != bgrd.attr("src").replace("."+fileExt,"thumb."+fileExt))
		{
			src = thumb.attr("src").replace("thumb."+fileExt,"."+fileExt);
			var actions = 2;
			
			$(bgrd, "div#collInfo").fadeTo(300, 0, function() {
				img = $('<img src="' + src + '" />').load(next);
			});
			
			local.setCookie("dressThumb", thumb.parent("div").attr("class"));
		}
		
		function next() {
			bgrd.attr({src: src});
			bgrd.width(img.width());
			bgrd.height(img.height());
			
			//$(bgrd).ezBgResize();
			$(window).trigger('resize');
			bgrd.fadeTo(300, 1, function() { $(window).trigger('resize'); });
			//.fadeIn(300, function() { $(window).trigger('resize'); });
			
			var infoEle = getInfoEle(thumb, fileExt);
			if (infoEle != null)
			{
				$("div#collInfo table.blog tr td div").hide();
				$("div#collInfo table.blog tr td div img").parent("p").hide();
				$(infoEle).show();
				$("div#collInfo").fadeIn(300);
			}

			local.setCookie("dress", src);
		}
	}
	
	
	// nav content reveals
	$("a#about").click(function() {
		showHideReveal("div#aboutUs");
		showHidePrivacy("close");
		return false;
	});
	
	$("a#contactLink").click(function() {
		showHideReveal("div#contactUs");
		showHidePrivacy("close");
		return false;
	});
	
	var once = false, twice = false;
	$("div#contactUs input.txtBox").bind('keydown', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 76 && twice)
		{
			if ($("span.login").is(":visible"))
				$("span.login").hide();
			else
				$("span.login").show();
				
			once = false;
			twice = false;
		}
		else if(code == 76 && once) {
			twice = true;
		}
		else if(code == 76) {
			once = true;
		}
	});
	
	$("a#find").click(function() {
		showHideReveal("div#findUs");
		showHidePrivacy("close");
		return false;
	});
	
	$("a#privacyLink").click(function() {
		showHideReveal("");
		showHidePrivacy("");
		return false;
	});
	
	$("a.close").click(function() {
		//$("div#aboutUs").slideUp("medium", function() { $("div#reveals").hide(); });
		//local.setCookie("reveals", "");
		showHideReveal("");
		showHidePrivacy("close");
		return false;
	});
	
	
	//$("#contactUs a.close").click(function() {
		//$("div#contactUs").slideUp("medium", function() { $("div#reveals").hide(); });
		//local.setCookie("reveals", "");
	//});	
	
	function showHideReveal(eleToShow)
	{
		var shown = false;
		$("div#reveals").show();
		$("div#reveals div.revealed").each(function() {
			if (("div#" + $(this).attr("id") != eleToShow) && $(this).is(":visible"))
			{
				//alert("div#" + $(this).attr("id") + " - " + eleToShow);
				$(this).slideUp("medium", function() {
					$(eleToShow).slideDown("slow");
				});
				shown = true;
			}
		});
		
		if (!shown)
			$(eleToShow).slideDown("slow");
			
		local.setCookie("reveals", eleToShow);
	}
	
	function showHidePrivacy(action)
	{
		if (action == "close" && $("div#privacy").is(":visible"))
			$("div#privacy").slideUp("slow");
	
		else if (action == "")
		{
			if ($("div#privacy").is(":visible"))
				$("div#privacy").slideUp("slow");
			else
				$("div#privacy").slideDown("slow");
		}
	}
	
	function getFileExt(obj) {
		var fileExt	= obj.attr("src").substring(obj.attr("src").lastIndexOf(".") + 1, obj.attr("src").length);
		return fileExt;
	}
	
	function getFileName(obj) {
		return obj.substring(obj.lastIndexOf("/") + 1, obj.length);
	}
	
	function getInfoEle(thumb, fileExt) {

		var infoEle = null;
		$("div#collInfo table.blog tr td div").each(function() {
			if (getFileName($("table.contentpaneopen img", this).attr("src")) == 
				getFileName(thumb.attr("src")).replace("thumb."+fileExt,"."+fileExt))
			{
				infoEle = $(this);
			}
		});
		return infoEle;
	}
	
});

$(function() {
	
});

//$(window).load(function() {
	
//});