var AjaxResultHandler = function(data) {
	if (typeof(data) == 'object') {
		if (typeof(data.success) != 'undefined') {
			if (data.success == true) {
				return 1;
			} else {
				if (typeof(data.redirect) != 'undefined') {
					window.location.href=data.redirect;
					return;
				} else if (typeof(data.error_message) != 'undefined') {
					return 2;
				} else {
					return 3;
				}
			}
		}
	} else {
		return 0;
	}
}