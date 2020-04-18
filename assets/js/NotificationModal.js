var NotificationModal = function NotificationModal(modalId) {
	this.modal = $(modalId);
	this.initiate();
}

NotificationModal.prototype = {};
NotificationModal.prototype.initiate = function() {
	var self = this;
	this.modal.on('show.bs.modal',function() {
		self.modal.css('z-index',99999999);
		$(document).find('.modal:not([id=notificationModal])').each(function(index) {
			$(this).css('z-index',99);
		});
	});
	this.modal.on('hide.bs.modal',function() {
		$(document).find('.modal:not([id=notificationModal])').each(function(index) {
			$(this).css('z-index',99999999);
			self.modal.css('z-index',99);
		});
	});
	this.title = this.modal.find('.modal-title');
	this.titleLabel = this.modal.find('.notice-title');
	this.body = this.modal.find('.modal-body');
	this.nType = 'notice';
	this.closeButton = this.modal.find('.close-notification');
	this.initCompoundConfirmation();
	this.template = {};
	this.template.compound_details = "<div class=\'details\'><div>Masa kompaun: <span >{compound_time}</span></div><div>No. plat: <span>{plate}</span></div><div>PBT: <span>{pbt}</span></div><div>Kod zon: <span>{zone}</span></div><div>No. lot: <span>{lot}</span></div><div>No. kompaun: <span>{compound_receipt}</span></div><div>Sebab kompaun: <span>{reason}</span></div></div>";
	this.template.compound_confirmation = "<div>Anda pasti untuk <strong>kompound</strong> kenderaan yang bernombor plat seperti yang di bawah?</div><div class=\'confirm-plate\'>{plate}</div>";
}

NotificationModal.prototype.initCompoundConfirmation = function() {
	this.confirmValue = null;
	this.confirmationContainer = this.modal.find('.confirmation_button_container');
	this.confirmCompoundButton = this.confirmationContainer.find('.confirm-compound');
	var self = this;
	this.confirmCompoundButton.click(function(e) {
		self.externalCompoundButton.attr('confirmed','confirmed');
		self.externalCompoundButton.click();
	});
}

NotificationModal.prototype.show = function(nType,nTitle,nBody) {
	this.closeButton.show();
	this.confirmationContainer.hide();
	var html = this.getTemplate(nBody)
	this.titleLabel.text(nTitle);
	this.body.empty();
	this.body.append(html);
	this.modal.modal('show');
	if (this.nType != nType) {
		this.title.switchClass(this.nType,nType);
		this.nType = nType;
	}
}


NotificationModal.prototype.getTemplate = function(object) {
	var html;
	if (typeof(object) == 'object') {
		if (object.header == 'compound_details') {
			html = this.template.compound_details;
			if (object.contents.lot == 0) { object.contents.lot = '-'; }
			html = html.replace(/{compound_time}/g,object.contents.compound_time);
			html = html.replace(/{plate}/g,object.contents.plate);
			html = html.replace(/{pbt}/g,object.contents.pbt);
			html = html.replace(/{zone}/g,object.contents.zone);
			html = html.replace(/{lot}/g,object.contents.lot);
			html = html.replace(/{compound_receipt}/g,object.contents.compound_receipt);
			html = html.replace(/{plate}/g,object.contents.plate);
			html = html.replace(/{reason}/g,object.contents.reason);
		} else if (object.header == 'compound_confirmation') {
			html = this.template.compound_confirmation;
			html = html.replace(/{plate}/g,object.contents.plateNumber);
			this.externalCompoundButton = object.contents.proceedButton;
			this.closeButton.hide();
			this.confirmationContainer.show();
		} else {
			html = 'Unknow object header';
		}
	} else {
		html = object;
	}
	return html;	
}