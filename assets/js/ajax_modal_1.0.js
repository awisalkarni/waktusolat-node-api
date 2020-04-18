var ajaxModal = function(modal) {
	var modal = $(modal);
	var form = modal.find('form');
	var url = form.attr('action');
	var loading = 'Loading...';
	var submitButton = modal.find('.ajax-submit');
	var oldSubmitText = submitButton.text();
	var refreshAfterSuccess = false;
	var refreshOnClose = false;
	var clearOnShow = true;
	var instantAlert = [];
	var instantAlertPostion = 'insertAfter';
	var alertCustomClass = 'alert alert-danger';
	var successCustomClass = 'alert alert-success';
	var alertFieldCustomClass = 'has-error';
	var resetOnSuccess = false;
	this.data = null;
	var parent = this;



	modal.on('show.bs.modal', function () {
		if (parent.getClearOnShow() == true) {
			form[0].reset();
			removeAlert();
		}
	});

	this.getClearOnShow = function() {
		return clearOnShow;
	}

	this.setClearOnShow = function(value) {
		clearOnShow = value;
	}

	this.setLoading = function(loadingText) {
		loading = loadingText;
	}

	this.setRefreas

	this.setRefreshAfterSuccess = function(value) {
		refreshAfterSuccess = value;
	}

	this.setRefreshOnClose = function (value) {
		if (value == true) {
			modal.on('hidden.bs.modal', function () {
				location.reload();
			});
		}
	}

	this.setAlertClass = function(value) {
		alertCustomClass = value;
	}

	this.setSuccessClass = function(value) {
		successCustomClass = value;
	}

	this.setAlertPosition = function(value) {
		instantAlertPostion = value;
	}

	this.setErrorInputClass = function(value) {
		alertFieldCustomClass = value;
	}

	this.setResetOnSuccess = function(value) {
		resetOnSuccess = value;
	}

	var removeAlert = function() {
		modal.find('[type=alert]').each(function(index) {
			$(this).remove();
		})
		modal.find('.'+alertFieldCustomClass).each(function(index) {
			$(this).removeClass(alertFieldCustomClass);
		})
	}

	var loadingState = function() {
		submitButton.text(loading);
		submitButton.attr('disabled',true);
		modal.find('[data-dismiss=modal]').each(function(index) {
			$(this).attr('disabled',true);
		});
	}

	var doneState = function() {
		submitButton.text(oldSubmitText);
		submitButton.attr('disabled',false);
		modal.find('[data-dismiss=modal]').each(function(index) {
			$(this).attr('disabled',false);
		});
	}

	this.onError = function() {
	}

	this.onSuccess = function() {
	}

	var redefineSubmit = function() {
		form.submit(function(e) {
			e.preventDefault();
			submitButton.trigger('click');
		});
	}
	redefineSubmit();

	var onClickEventHandler = function(e){
		form = modal.find('form');
		url = form.attr('action');
		removeAlert();
		loadingState();
		$.post(url, form.serialize() ,function(data){
			parent.data = data;
			doneState();
			var SignalResult = AjaxResultHandler(data);
			if (SignalResult == 1) {
				if (refreshAfterSuccess) {
					setTimeout(function() {location.reload()},1000);
				} else if (resetOnSuccess) {
					form[0].reset();
				}
				if (data.url) {
					window.location = data.url;
				}
				parent.onSuccess();
				if (data.success_message) {
					eval("modal.find('.modal-body').prepend('<div class=\\'"+successCustomClass+"\\' type=\\'alert\\'>"+data.success_message+"</div>')");
				}
			} else if (SignalResult == 2) {
				eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>"+data.error_message+"</div>')");
			} else if (SignalResult == 3) {
				if (data.errors){
					for(key in data.errors) {
						if(data.errors.hasOwnProperty(key)) {
							eval("$('<div class=\\'"+alertFieldCustomClass+"\\' type=\\'alert\\'>"+data.errors[key]+"</div>')."+instantAlertPostion+"(modal.find('[name="+key+"]'))");
							modal.find('[name='+key+']').closest('.form-group').addClass(alertFieldCustomClass);
						}
					}

				}
			} else {
				eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>Maklumbalas yang tidak dikenali dari pelayan.</div>')");
			}
		}).fail(function() {
			eval("modal.find('.modal-body').prepend('<div class=\\'"+alertCustomClass+"\\' type=\\'alert\\'>Tidak dapat menghubungi pelayan.</div>')");
			doneState();
		});
	}

	submitButton.click(onClickEventHandler);


	
}