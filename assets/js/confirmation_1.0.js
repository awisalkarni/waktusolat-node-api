var confirmation = function(modal,target,title,string) {
	var modal = $(modal);
	var modalBody = modal.find('.modal-body');
	var confirm = modal.find('.btn-danger');
	var loading = 'Loading...';
	var oldSubmitText = confirm.text();


	var alertCustomClass = null;
	var successCustomClass = null;

	this.setAlertClass = function(value) {
		alertCustomClass = value;
	}

	this.setSuccessClass = function(value) {
		successCustomClass = value;
	}

	this.setLoading = function(loadingText) {
		loading = loadingText;
	}

	var extract = function(str) {
	  	var results = [];
	  	re = new RegExp(/{([^}]+)}/g);
	  	var text;
	  	while(text = re.exec(str)) {
	      results.push(text[1]);
	  	}
  		return results;
	}
	var results = extract(string);

	var removeAlert = function() {
		modal.find('[type=alert]').each(function(index) {
			$(this).remove();
		});
	}

	var loadingState = function() {
		confirm.text(loading);
		confirm.attr('disabled',true);
		modal.find('[data-dismiss=modal]').each(function(index) {
			$(this).attr('disabled',true);
		});
	}

	var doneState = function() {
		confirm.text(oldSubmitText);
		confirm.attr('disabled',false);
		modal.find('[data-dismiss=modal]').each(function(index) {
			$(this).attr('disabled',false);
		});
	}

	this.ask = function(params,button) {
		removeAlert();
		var newString = string;
		for (var i=0;i<results.length;i++)
		{ 
			newString = newString.replace('{'+results[i]+'}',button.attr(results[i]))
		}
		modal.find('.modal-title').text(title);
		modalBody.empty()
		modalBody.append(newString);
		confirm.unbind('click');
		confirm.click(function(e) {
			removeAlert();
			loadingState();
			$.post(target,params,function(data){
				doneState();
				var SignalResult = AjaxResultHandler(data);
				if (SignalResult == 1) {
					if (data.success_message) {
						eval("modal.find('.modal-body').prepend('<div class=\\'"+successCustomClass+"\\' type=\\'alert\\'>"+data.success_message+"</div>')");
					}
					if (data.url) {
						window.location = data.url;
					} else {
						location.reload();
					}
				} else if (SignalResult == 2) {
					eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>"+data.error_message+"</div>')");
				} else {
					eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>Maklum balas yang tidak dikenali dari pelayan.</div>')");
				}
			}).fail(function(e) {
				doneState();
				eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>Gagal menghubungi pelayan.</div>')");
				console.log(e);
			});
		});
	}


}