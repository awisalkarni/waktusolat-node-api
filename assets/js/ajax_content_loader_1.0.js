(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        // whatever else you want to do
        // maybe call onhashchange e.handler
        return pushState.apply(history, arguments);
    }
})(window.history);
pushStateCount = 0;
pushStateByLoader = 0;
var ajaxContentLoader = function(container,properties) {
	var container = $(container);
	var currentGet = null;
	var defaultProp = {
		cache:true,
		backdrop:'#'+container.attr('id')
	};
	if (!properties) {
		var properties = defaultProp;
	}
	var backdrop = $(properties.backdrop);
	var cache = properties.cache ? properties.cache : defaultProp.cache;
	var toLoadURL = null;
	if ($('.loading-back-drop').length == 0) {
	backdrop.prepend("<div class='loading-back-drop' style='text-align: center; top: 0; bottom: 0; z-index: 1; width: 100%; display: none; background: white; position: fixed;'><i class='fa fa-refresh fa-spin' style='margin-top: 200px; font-size: 40px; color: #D0D0D0'></i></div>");
	}
	// backdrop.loadingDots({destination:'.loading-back-drop'});
	// backdrop.showLoadingDots();
	$(document).find('[data-container='+container.attr('id')+']:not([loaded])').each(function(index) {
		$(this).attr('loaded',true)
		$(this).click(function(e) {
			if (currentGet != null) {
				currentGet.abort();
			}
		if (cache == true) {
			e.preventDefault();
			toLoadURL = $(this).attr('href');
			var button = this;
			if (container.find('[holder="'+toLoadURL+'"]').length == 0) {
				backdrop.find('.loading-back-drop').fadeIn("fast");
				currentGet = $.get(toLoadURL, function(data){
					var SignalResult = AjaxResultHandler(data);
					container.append("<div holder='"+toLoadURL+"'>"+data+"</div>");
					backdrop.find('.loading-back-drop').fadeOut("slow");
					reset(button,true);
				});
				
			} else {
				reset(this,true);
			}
		}
			
		});
	});

	var reset = function(button,focus) {
		container.find('[holder]').each(function(index) {
		if ($(this).attr('holder') != $(button).attr('href')) {
			if ($(this).is(':visible')) {
				$(this).hide();
				$(this).focusout();
			}
		} else {
			$(this).fadeIn("slow");
			if(focus == true) {
				$(this).focusin();
			}
		}
		});
		// container.find('[holder="'+toLoadURL+'"]').fadeIn("slow");
		// container.find('[holder="'+toLoadURL+'"]').focusin();
		$(document).find('[data-container='+container.attr('id')+']').each(function(index) {
			//$(this).removeClass('active');
		});
		//$(button).addClass('active');
		pushStateByLoader = 1;
		window.history.pushState("string","Title",toLoadURL);
		pushStateByLoader = 0;
	}

	var backAction = function(url,focus) {
		container.find('[holder]').each(function(index) {
		if ($(this).attr('holder') != url) {
			if ($(this).is(':visible')) {
				$(this).hide();
				$(this).focusout();
			}
		} else {
			$(this).fadeIn("slow");
			if(focus == true) {
				$(this).focusin();
			}
		}
		});
	}

	window.onpopstate = history.onpushstate = function(e) {
	if (pushStateCount != 0) {
		if (pushStateByLoader == 0) {
    		if (container.find('[holder="'+window.location+'"]').length == 0) {
				backdrop.find('.loading-back-drop').fadeIn("fast");
				currentGet = $.get(window.location, function(data){
					var SignalResult = AjaxResultHandler(data);
					container.append("<div holder='"+window.location+"'>"+data+"</div>");
					backdrop.find('.loading-back-drop').fadeOut("slow");
					backAction(window.location,false);
				});
				
			} else {
				backAction(window.location,true);
			}
    	}
	} else {
		pushStateCount++;
	}
	}
}


