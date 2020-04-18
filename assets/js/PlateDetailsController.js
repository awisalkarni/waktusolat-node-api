var PlateDetailsController = function PlateDetailsController(modalId) {
	this.modal = $(modalId);
	this.initiate();
}

PlateDetailsController.prototype = {};
PlateDetailsController.prototype.initiate = function() {
	this.header = this.modal.find('.modal-header');
	this.loading = this.modal.find('.backdrop');
	this.details = this.modal.find('.details');
	this.title = this.modal.find('#plateLabel');
	this.compoundButton = this.modal.find('.btn-danger');
	this.plateNum = this.modal.find('[label=plate_num]');
	this.receiptNum = this.modal.find('[label=receipt_num]');
	this.phoneNum = this.modal.find('[label=phone_num]');
	this.lotNum = this.modal.find('[label=lot_num]');
	this.startTime = this.modal.find('[label=start_time]');
	this.endTime = this.modal.find('[label=end_time]');
	this.parkingStatus = this.modal.find('[label=parking_status]');
	this.lotId = 0;
	this.plateObj = null;
	var self = this;
	this.compoundButton.click(function() {
		if (self.compoundButton.attr('confirmed') == 'confirmed') {
		self.compoundButton.attr('disabled',true).empty().append("<i class='fa fa-refresh fa-spin'></i>");
		$.get(enforceUrl+'/compound-plate',{pbtid:self.plateObj.parent.parent.pbtId,zoneid:self.plateObj.parent.parent.zoneId,lotid:self.lotId,plate:self.plateObj.data.tpn},function(data) {
			var SignalResult = AjaxResultHandler(data);
			if (SignalResult == 1) {
				self.compoundButton.attr('disabled',true).empty().text('Dikompaun');
				notification.show('notice','Berjaya',JSON.parse(data.success_message));
				self.modal.modal('hide');
			} else if (SignalResult == 2) {
				self.compoundButton.attr('disabled',false).empty().text('Kompaun');
				notification.show('alert','Tidak Berjaya',data.error_message);
			} else {
				self.compoundButton.attr('disabled',false).empty().text('Kompaun');
				notification.show('alert','Tidak Berjaya','Maklumbalas yang tidak dikenali dari pelayan.');
			}

		}).fail(function() {
			self.compoundButton.attr('disabled',false).empty().text('Kompaun');
			notification.show('alert','Ralat','Tidak dapat menghubungi pelayan.');
			self.modal.modal('hide');
		});
	} else {
		var confirmation = {
					header: 'compound_confirmation',
					contents: {
						proceedButton: self.compoundButton,
						plateNumber: self.plateObj.data.tpn
					}
				};
				notification.show('notice','Kepastian',confirmation);
	}
	});

}

PlateDetailsController.prototype.request = function(plateObj) {
	var self = this;
	this.header.attr('class','modal-header neutral');
	this.plateObj = plateObj;
	this.modal.modal('show');
	this.title.text(this.plateObj.data.tpn);
	this.loadingState();
	$.get(enforceUrl+'/plate/details',{pbtId:this.plateObj.parent.parent.pbtId,transactionId:this.plateObj.data.tid},function(data) {
		var SignalResult = AjaxResultHandler(data);
		if (typeof(data) == 'object') {
			self.resultState();
			self.lotId = data.lot_id;
			self.plateNum.text(data.plat_no);
			self.receiptNum.text(data.receipt_no);
			self.phoneNum.text(data.mobile_no);
			if (data.no_lot == null) {
				self.lotNum.text('Tiada');
			} else {
				self.lotNum.text(data.no_lot);
			}
			self.startTime.text(data.start_time);
			self.endTime.text(data.end_time);
			self.parkingStatus.text(statusDefinitionMalay[data.ps]);
			self.header.switchClass('neutral',statusDefinition[data.ps]);
			if (data.ps == 3) {
				if (data.com == 0) {
					self.compoundButton.attr('disabled',false);
					self.compoundButton.text('Kompaun');
				} else {
					self.compoundButton.attr('disabled',true);
					self.compoundButton.text('Dikompaun');
				}
			} else {
				self.compoundButton.attr('disabled',true);
				self.compoundButton.text('Kompaun');
			}
		} else {
			notification.show('alert','Ralat','Terdapat kegagalan pada bahagian pelayan');
			self.modal.modal('hide');
		}
	}).fail(function() {
		notification.show('alert','Ralat','Tidak dapat menghubungi pelayan.');
		self.modal.modal('hide');
	});
}


PlateDetailsController.prototype.loadingState = function() {
	this.details.hide('slow');
	this.loading.show('slow');
}

PlateDetailsController.prototype.resultState = function() {
	var self = this;
	this.loading.fadeOut('normal', function() {
		self.details.fadeIn('normal');
	});

}