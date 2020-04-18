var LotDetailsController = function lotDetailsController(modalId) {
	this.modal = $(modalId);
	this.initiate();
}

LotDetailsController.prototype = {};
LotDetailsController.prototype.initiate = function() {
	this.search = this.modal.find('.search_lot');
	this.searchButton = this.search.find('[type=button]');
	this.searchInput = this.search.find('[type=text]');
	this.details = this.modal.find('.details');
	this.loading = this.modal.find('.backdrop');
	this.title = this.modal.find('.modal-title');
	this.titleText = this.modal.find('.modal-title-text');
	this.lotObj = null;
	this.plateList = {};
	var self = this;
	this.searchButton.click(function(e) {
		self.getSearch();
	});
}

LotDetailsController.prototype.getSearch = function() {
	var searchKey  = this.searchInput.val().replace(' ','');
	if (searchKey != '') {
		if (this.searchButton.attr('confirmed') == 'confirmed') {
			this.searchButton.attr('disabled',true).empty().append("<i class='fa fa-refresh fa-spin'></i>");
			var self = this;
			$.get(enforceUrl+'/compound-plate',{pbtid:this.lotObj.parent.parent.pbtId,zoneid:this.lotObj.parent.parent.zoneId,lotid:this.lotObj.lotId,plate:searchKey},function(data) {
				self.searchButton.attr('disabled',false).empty().text('Kompaun');
				self.searchInput.val('');

				var SignalResult = AjaxResultHandler(data);
				if (SignalResult == 1) {
					notification.show('notice','Berjaya',JSON.parse(data.success_message));
				} else if (SignalResult == 2) {
					notification.show('alert','Tidak Berjaya',data.error_message);
				} else {
					notification.show('alert','Tidak Berjaya','Maklum balas tidak dikenali dari pelayan.');
				}
			}).fail(function() {
				self.searchButton.attr('disabled',false).empty().text('Kompaun');
				notification.show('alert','Tidak Berjaya','Harap maaf. Tidak dapat menghubungi pelayan.');
			});
		} else {
			var confirmation = {
				header: 'compound_confirmation',
				contents: {
					proceedButton: this.searchButton,
					plateNumber: searchKey
				}
			};
			notification.show('notice','Kepastian',confirmation);
		}
	}
}

LotDetailsController.prototype.request = function(lotObj) {
	this.lotObj = lotObj;
	this.modal.modal('show');
	this.loadingState();
	for(key in this.plateList) {
		if(this.plateList.hasOwnProperty(key)) {
			delete this.plateList[key];
		}
	}
	var self = this;
	$.get(enforceUrl+'/'+this.lotObj.parent.parent.pbtId+'/lot/'+this.lotObj.lotId+'/details',function(data) {
		self.resultState();
		var SignalResult = AjaxResultHandler(data);
		self.process(data);
	}).fail(function() {
		self.modal.modal('hide');
		notification.show('alert','Tidak Berjaya','Harap maaf. Terdapat masalah pada bahagian pelayan.');
	});
}

LotDetailsController.prototype.resultState = function() {
	var self = this;
	this.details.empty();
	this.loading.fadeOut('normal',function() {
		self.details.fadeIn('normal');
	});
	this.title.show();
	this.titleText.text(this.lotObj.lotNum);
}


LotDetailsController.prototype.loadingState = function() {
	this.details.hide();
	this.title.hide();
	this.loading.show('slow');
}

LotDetailsController.prototype.process = function(data) {
	var count = 0;
	for(key in data) {
		if(data.hasOwnProperty(key)) {
			this.plateList[data[key].plat_no] = new PlatePanelController(data[key],this);
			if (count == 0) { this.plateList[data[key].plat_no].collapse(); }
		}
		count++;
	}
}

LotDetailsController.prototype.removePlate = function(plateNo) {
	delete this.plateList[plateNo];
	for(key in this.plateList) {
		if(this.plateList.hasOwnProperty(key)) {
			return;
		}
	}
	this.modal.modal('hide');
}

LotDetailsController.prototype.clearExpired = function() {
	for(key in this.plateList) {
		if(this.plateList.hasOwnProperty(key)) {
			if(this.plateList[key].plateObj.ps == 3) {
				this.plateList[key].destroy();
			}
		}
	}
}


var PlatePanelController = function PlatePanelController(plateObj,parent) {
	this.parent = parent;
	this.plateObj = plateObj;
	this.initiate();
}

PlatePanelController.prototype = {};
PlatePanelController.prototype.initiate = function() {
	this.element = $('<div>', {class: 'panel '+statusDefinition[this.plateObj.ps]});
	this.panelHeading = $('<div>', {class: 'panel-heading'});
	this.panelHeading.appendTo(this.element);
	this.panelTitle = $('<h4>', {class: 'panel-title'});
	this.panelTitle.appendTo(this.panelHeading);
	this.panelTitleText = $('<a>', {href: '#collapse_'+this.plateObj.plat_no});
	this.panelTitleText.attr('data-toggle','collapse');
	this.panelTitleText.attr('data-parent','#accordion');
	this.panelTitleText.text(this.plateObj.plat_no);
	this.panelTitleText.appendTo(this.panelTitle);
	if (this.plateObj.ps == 3)	{
		var self = this;
		this.panelCompoundButton = $('<button>', {class: 'btn btn-danger btn-sm pull-right', type: 'button'});
		this.panelCompoundButton.text('Kompaun');
		this.panelCompoundButton.appendTo(this.panelTitle);
		if (this.plateObj.com == 0) {
			this.panelCompoundButton.click(function(e) {
				self.compound();
			});
		} else {
			this.panelCompoundButton.attr('disabled',true).text('Dikompaun');
		}
		this.panelClearButton = $('<button>', {class: 'btn btn-primary btn-sm pull-right', type: 'button'});
		this.panelClearButton.text('Padam');
		this.panelClearButton.appendTo(this.panelTitle);
		this.panelClearButton.click(function(e) {
			self.clearSession();
		});
	}
	this.panelContent = $('<div>', {id: 'collapse_'+this.plateObj.plat_no, class: 'panel-collapse collapse'});
	this.panelContent.appendTo(this.element);
	this.panelBody = $('<div>', {class: 'panel-body'});
	this.panelBody.appendTo(this.panelContent);
	this.panelBody.append(this.addDetails('No. plat',this.plateObj.plat_no));
	this.panelBody.append(this.addDetails('No. resit',this.plateObj.receipt_no));
	this.panelBody.append(this.addDetails('No. Tel',this.plateObj.mobile_no));
	this.panelBody.append(this.addDetails('Masa mula',this.plateObj.start));
	this.panelBody.append(this.addDetails('Masa tamat',this.plateObj.last));
	this.panelBody.append(this.addDetails('Status parkir',statusDefinitionMalay[this.plateObj.ps]));
	this.element.appendTo(this.parent.details);
}

PlatePanelController.prototype.clearSession = function() {
	this.panelClearButton.attr('disabled',true).empty().append("<i class='fa fa-refresh fa-spin'></i>");
	var self = this;
	$.get(enforceUrl+'/clear/'+this.plateObj.id,function(data) {
		var SignalResult = AjaxResultHandler(data);
		if (SignalResult == 1) {
			self.element.remove();
			self.parent.removePlate(self.plateObj.plat_no);
		} else if (SignalResult == 2) {
			self.panelClearButton.attr('disabled',false).empty().text('Padam');
		} else {
			notification.show('alert','Tidak Berjaya','Maklumbalas yang tidak dikenali dari pelayan.');
		}
	}).fail(function() {
		self.panelClearButton.attr('disabled',false).empty().text('Padam');
		notification.show('alert','Tidak Berjaya','Harap maaf. Tidak dapat menghubungi pelayan.');
	});
}

PlatePanelController.prototype.compound = function() {
	if (this.panelCompoundButton.attr('confirmed') == 'confirmed') {
		this.panelCompoundButton.attr('disabled',true).empty().append("<i class='fa fa-refresh fa-spin'></i>");
		var self = this;
		$.get(enforceUrl+'/compound-transaction',{pbtid:this.parent.lotObj.parent.parent.pbtId,transactionId:this.plateObj.id},function(data) {
			var SignalResult = AjaxResultHandler(data);
			if (SignalResult == 1) {
				notification.show('notice','Berjaya',JSON.parse(data.success_message));
				self.parent.clearExpired();
			} else if (SignalResult == 2) {
				notification.show('alert','Tidak Berjaya',data.error_message);
				self.panelCompoundButton.attr('disabled',false).empty().text('Kompaun');
			} else {
				notification.show('alert','Tidak Berjaya','Maklumbalas yang tidak dikenali dari pelayan');
				self.panelCompoundButton.attr('disabled',false).empty().text('Kompaun');

			}
		}).fail(function() {
			self.panelCompoundButton.attr('disabled',false).empty().text('Kompaun');
			notification.show('alert','Tidak Berjaya','Harap maaf. Tidak dapat menghubungi pelayan.');
		});
	} else {
		var confirmation = {
			header: 'compound_confirmation',
			contents: {
				proceedButton: this.panelCompoundButton,
				plateNumber: this.plateObj.plat_no
			}
		};
		notification.show('notice','Kepastian',confirmation);
	}
}

PlatePanelController.prototype.destroy = function() {
	this.element.remove();
	this.parent.removePlate(this.plateObj.plat_no);
}

PlatePanelController.prototype.addDetails = function(label,value) {
	return "<div>"+label+":  <span>"+value+"</span></div>";
}

PlatePanelController.prototype.collapse = function() {
	this.panelContent.addClass('in');
}