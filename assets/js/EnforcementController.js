//******** Class EnforcementController **********************

var EnforcementController = function EnforcementController(zoneId,pbtId,zoneName,subId) {
	this.pbtId = pbtId;
	this.zoneId = zoneId;
	this.zoneName = zoneName;
	this.subId = subId;
	this.initiate();
}

EnforcementController.prototype = {};
EnforcementController.prototype.initiate = function() {
	this.item = $(document).find('[zone-id='+this.zoneId+']');
	this.createHeader();
	this.tab = $(document).find('#tab_zone_'+this.zoneId).find('input:radio[name='+this.zoneId+'_type]');
	this.avoidTwice = true;
	this.holder = this.item.parent();
	this.counter = 0;
	this.lot = new LotController(this);
	this.plate = new PlateController(this);
	this.plateCompounder = new PlateCompounder(this);
	var self = this;

	this.holder.focusin(function() {
		menu.show('menu_zone_'+self.zoneId);
		console.log('FOCUS -' + self.item.attr('zone-id'));
		if ($(this).is(':visible')) {
			if (self.avoidTwice == false) {
				self.avoidTwice = true;
				self.activate(self.tab.filter(':checked').val(),false);
			} else {
				console.log('Already active - Cannot be re-active...');
			}
		} else {
			console.log('Holder is NOT visible - Cannot be activate...');
		}
	});

	this.holder.focusout(function() {
		if ($(this).is(':visible')) {
			console.log('BLUR but Still active - '+$(this).attr('holder'));
		} else {
			console.log('BLUR -' + self.item.attr('zone-id'));
			self.avoidTwice = false;
			self.deactivate();
		}
	});

	this.tab.change(function(){
		if ($(this).is(':checked')) {
			self.avoidTwice = true;
			self.activate($(this).val(),false);
		}
	});


}

EnforcementController.prototype.createHeader = function() {
	this.itemHeader = $('<div class="item-header">');
	this.itemBack= $('<a>').attr('href',enforceUrl+'/sub/'+this.subId).attr('data-container','container-1').html("<i class='fa fa-arrow-circle-left pull-left;'></i>");
	this.itemHeader.prepend(this.itemBack);
	this.zoneTitle = $('<span>').text(this.zoneName);
	this.itemHeader.append(this.zoneTitle);
	this.itemRight = $('<div>',{style:'position: fixed; right: 50px; top: 2px;'});
	this.itemStatus = $('<i>',{class:'fa fa-retweet status'}).attr('data-toggle','popover').attr('data-content','Maklumat disegerakkan dengan lancar dari pelayan kepada peranti anda.').attr('role','button').attr('data-original-title','Penyegerakkan').attr('data-placement','bottom').attr('popover-alert','info');
	this.itemStatus.popover();
	this.itemRight.append(this.itemStatus);
	this.tabHolder = $('<div>',{class:'btn-group toggle-item type-toggle'}).attr('id','tab_zone_'+this.zoneId).attr('data-toggle','buttons').append("<label class='btn btn-enforce'><input type='radio' name='"+this.zoneId+"_type' value='plate'>Plat</label><label class='btn btn-enforce'><input type='radio' name='"+this.zoneId+"_type' value='lot'>Lot</label>");
	this.itemRight.append(this.tabHolder);
	this.itemHeader.append(this.itemRight);
	menu.register(this.itemHeader,'menu_zone_'+this.zoneId);
}

EnforcementController.prototype.activate = function(type,pre) {
	pre = typeof pre !== 'undefined' ? pre : true;
	if (pre==true) {
		this.tab.filter('[value='+type+']').parent('label').addClass('active');
		this.tab.filter('[value='+type+']').prop('checked',true);
	}
	if (type == 'lot') {
		this.lot.activate();
		this.plate.deactivate();
	} else {
		this.plate.activate();
		this.lot.deactivate();
	}
}

EnforcementController.prototype.deactivate = function() {
	this.lot.deactivate();
	this.plate.deactivate();
}

//***************** PlateCompounder *******************//

var PlateCompounder = function PlateCompounder(parent) {
	this.parent = parent;
	this.initiate();
	
}

PlateCompounder.prototype = {};
PlateCompounder.prototype.initiate = function() {
	var self = this;
	this.container = this.parent.item.find('.plate');
	this.compoundInput = this.parent.item.find('.compounder');
	this.focusTimer = false;
	this.inputLastValue = '';
	this.compoundInput.focusin(function(e) {
		self.focusTimer = setInterval(function(){self.checkInput();},100);
	});
	this.compoundInput.focusout(function(e) {
		clearInterval(self.focusTimer);
		console.log('clear Interval');
	});
	this.compoundButton = this.parent.item.find('.search_plate').find('.btn-danger');
	this.reason = this.parent.item.find('.reason');
	this.reason.selectric({
		disableOnMobile: false
	});
	this.compoundButton.click(function(e) {
		var plate = self.compoundInput.val().replace(' ','');
		if (plate != '') {
			if (self.compoundButton.attr('confirmed') == 'confirmed') {
				self.compoundButton.removeAttr('confirmed');
				self.compoundButton.attr('disabled',true).empty().append("<i class='fa fa-refresh fa-spin'></i>");
				$.get(enforceUrl+'/compound-plate',{pbtid:self.parent.pbtId,zoneid:self.parent.zoneId,lotid:0,plate:plate,reason:self.reason.val()},function(data) {
					self.compoundButton.attr('disabled',false).empty().text('Kompaun');
					var ResultSignal = AjaxResultHandler(data);
					if (ResultSignal == 1) {
						notification.show('notice','Berjaya',JSON.parse(data.success_message));
					} else if (ResultSignal == 2) {
						notification.show('alert','Tidak Berjaya',data.error_message);
					} else {
						notification.show('alert','Ralat','Terdapat kegagalan pada bahagian pelayan');
					}
					self.reason.val(0).selectric('refresh');
					self.compoundInput.val('').focusin();
				}).fail(function() {
					self.compoundButton.attr('disabled',false).empty().text('Kompaun');
					notification.show('alert','Ralat','Tidak dapat menghubungi pelayan.');
					self.reason.val(0).selectric('refresh');
					self.compoundInput.val('').focusin();
				});
			} else {
				var confirmation = {
					header: 'compound_confirmation',
					contents: {
						proceedButton: self.compoundButton,
						plateNumber: plate
					}
				};
				notification.show('notice','Kepastian',confirmation);
			}
		}
	});
}


PlateCompounder.prototype.checkInput = function() {
	var showKey = this.compoundInput.val().toUpperCase();
	if ((showKey != '')) {
		if (showKey != this.inputLastValue) {
			this.container.find('.list-group-item').unhighlight();
			this.inputLastValue = showKey;
			this.container.find('.list-group-item:not([plate*='+showKey+'])').hide();
			this.container.find('.list-group-item[plate*='+showKey+']').show().find('.plate-element').highlight(showKey);
		}
	} else {
		if (showKey != this.inputLastValue) {
			this.inputLastValue = showKey;
			this.container.find('.list-group-item').unhighlight();
			this.container.find('.list-group-item').show();
		}
	}
}

//***************** TypeController *******************//
var TypeController = function typeController(parent) {
	this.parent = parent;
	this.container = this.parent.item;
	this.type="TYPE";
	this.timer = null;
	this.resource = enforceUrl+'/zone/'+this.parent.zoneId+'/';
	this.counter = 0;
	this.objCounter = 0;
	this.objSize = 0;
	this.token = null;
	this.items = {};
	this.initiate();
}

TypeController.prototype = {};
TypeController.prototype.initiate = function() {
	this.active = true;
	this.avoidTwice = true;
	this.oneTime = null;
}

TypeController.prototype.activate = function() {
	console.log('Activate zone: '+this.parent.zoneId+', type: '+this.type);
	this.container.show();
	if (Object.keys(this.items).length == 0) {
		var self = this;
		setTimeout(function() {self.sync();},1);
	} else {
		this.sync();
	}
}

TypeController.prototype.deactivate = function() {
	this.container.hide();
	if(typeof this.request != 'undefined') {
		console.log('Deactivate zone: '+this.parent.zoneId+', type: '+this.type+' - AJAX REQUEST ABORTED!');
	}
	clearTimeout(this.timer);
}

TypeController.prototype.sync = function() {
	if (this.container.is(':visible')) {
		clearTimeout(this.timer);
		var self = this;
		if (window_focus == true) {
			if (this.active == true) {
				this.counter++;
				console.log('Synchronizing... - ZONE: '+this.parent.zoneId+', TYPE: '+this.type+', COUNTER: '+this.counter);
				this.request = $.get(this.resource,{token:this.token},function(data) {
					if (typeof(data) == 'object') {
						if (typeof(data.redirect) == 'undefined') {
							self.parent.itemStatus.attr('popover-alert','info');
							self.parent.itemStatus.attr('data-content','Maklumat disegerakkan dengan lancar dari pelayan kepada peranti anda.');
							self.parent.itemStatus.removeClass('fa-exclamation-triangle').removeClass('fa-blink').addClass('fa-retweet');
							self.token = data.token;
							self.objSize = Object.keys(data.data).length;
							self.objCounter = 0;
							self.process(data.data);
						} else {
							window.location.href=data.redirect;
						}
					} else if (data == '') {
						self.realtime(true);
						self.timer = setTimeout(function() {self.sync();},3000);
					} else {
						self.realtime(false);
						self.timer = setTimeout(function() {self.sync();},3000);
					}
				}).fail(function() {
					self.realtime(false);
					self.timer = setTimeout(function() {self.sync();},3000);
				});
			}
		} else {
			console.log('Window is inactive - sleep. Zone: '+this.parent.zoneId+', Type: '+this.type);
			self.timer = setTimeout(function() {self.sync();},3000);
		}
	} else {
		console.log('This type ('+this.type+') is not visible. Their Synchronizing stop');
	}
}

TypeController.prototype.process = function(data) { //method to be override
	console.log('Default process: '+data);
}

TypeController.prototype.realtime = function(status) {
	if (status == true) {
		if (this.parent.itemStatus.hasClass('fa-exclamation-triangle')) {
			this.parent.itemStatus.attr('popover-alert','info');
			this.parent.itemStatus.attr('data-content','Maklumat disegerakkan dengan lancar dari pelayan kepada peranti anda.');
			this.parent.itemStatus.removeClass('fa-exclamation-triangle').removeClass('fa-blink').addClass('fa-retweet');
			this.parent.itemStatus.popover('hide');
		}
	} else {
		if (this.parent.itemStatus.hasClass('fa-retweet')) {
			this.parent.itemStatus.attr('popover-alert','danger');
			this.parent.itemStatus.attr('data-content','Penyegerakkan tidak berlaku. Tiada sambungan internet atau terdapat masalah pada bahagian pelayan.');
			this.parent.itemStatus.removeClass('fa-retweet').addClass('fa-exclamation-triangle').addClass('fa-blink');
			this.parent.itemStatus.popover('hide');
		}
	}
}

//**************** LotController ********************// Entend TypeController
var LotController = function LotController(parent) {
	this.parent = parent;
	this.type = 'LOT';
	this.container = this.parent.item.find('.lot');
	this.timer = null;
	this.resource = enforceUrl+'/zone/'+this.parent.zoneId+'/lot';
	this.counter = 0;
	this.objCounter = 0;
	this.objSize = 0;
	this.token = null;
	this.items = {};
	this.initiate();
}

LotController.prototype = Object.create(TypeController.prototype);
LotController.prototype.constructor = LotController;
LotController.prototype.process = function(data) {
	var self = this;
	if (this.objCounter < this.objSize) {	
		var namespace = '_'+data[this.objCounter].li;
		if (typeof this.items[namespace] != 'undefined') {
			this.items[namespace].reshape(data[this.objCounter]);
		} else {
			this.items[namespace] = new LotItem(data[this.objCounter],this);
			this.items[namespace].reshape(data[this.objCounter]);
		}
		
		setTimeout(function() {self.process(data)}, 0);
		this.objCounter++;
		return;
	} else {
		this.timer = setTimeout(function() {self.sync();},3000);
	}
}

var LotItem = function LotItem(data,parent) {
	this.parent = parent;
	this.data = data;
	this.lotId = data.li;
	this.lotNum = data.ln;
	this.transactionPlateNo = null;
	this.compoundedPlateNo = null;
	this.lotStatus = null;
	this.lotReservation = 1;
	this.generateHTML();
}

LotItem.prototype = {};
LotItem.prototype.generateHTML = function() {
	this.element = $('<div>', {class: 'list-group-item neutral'});
	var self = this;
	this.element.click(function() {
		lotDetails.request(self);
	})
	this.element.css('opacity',0);
	this.lotReservationElement = $('<div>', {class: 'reservation'});
	this.lotReservationElement.appendTo(this.element);
	this.lotElement = $('<div>', {class: 'lot-element'});
	this.lotElement.text(this.data.ln);
	this.lotElement.appendTo(this.element);
	this.plateElement = $('<div>', {class: 'lot-plate-element lot-plate-number hide-quick'});
	this.plateElement.appendTo(this.element);
	this.compoundElement = $('<div>', {class: 'lot-plate-element last-compounded hide-quick'});
	this.compoundElement.appendTo(this.element);
	$('<div>', {style: 'clear: both;'}).appendTo(this.element);
	this.element.appendTo(this.parent.container);
	this.element.animate({opacity:1});
}

LotItem.prototype.reshape = function(data) {
	if ((this.lotNum != data.ln) || (this.transactionPlateNo != data.tpn) || (this.compoundedPlateNo != data.cpn) || (this.lotStatus != data.ls) || (this.lotReservation != data.lr)) {
		console.log('Change on lot: '+this.lotNum);		
		if (this.lotNum != data.ln) {
			this.lotNum = data.ln;
			this.lotElement.text(data.ln);
		}
		if (this.lotStatus != data.ls) {
			this.element.switchClass(statusDefinition[this.lotStatus],statusDefinition[data.ls]);
		}
		if (this.lotReservation != data.lr) {
			this.lotReservation = data.lr;
			if(data.lr == 1) {
				this.element.removeClass('reserved');
			} else {
				this.element.addClass('reserved');
			}
		}

		if (data.tpn != null) {
			this.plateElement.switchClass('hide-quick','show-quick');
		} else {
			this.plateElement.switchClass('show-quick','hide-quick');
		}
		this.plateElement.text(data.tpn);
			if (data.cpn != null) { // !COMPOUNDED
				this.compoundElement.switchClass('hide-quick','show-quick');
			} else { // COMPOUNDED
				this.compoundElement.switchClass('show-quick','hide-quick');
			}
			this.compoundElement.text(data.cpn);
			this.lotNum = data.ln;
			this.transactionPlateNo = data.tpn;
			this.compoundedPlateNo = data.cpn;
			this.lotStatus = data.ls;
		}
	}

//**************** Plate Controller ********************// Entend TypeController


var PlateController = function PlateController(parent) {
	this.parent = parent;
	this.type = 'PLATE';
	this.container = this.parent.item.find('.plate');
	this.timer = null;
	this.resource = enforceUrl+'/'+this.parent.pbtId+'/zone/'+this.parent.zoneId+'/plate';
	this.items = {};
	this.counter = 0;
	this.objCounter = 0;
	this.objSize = 0;
	this.token = null;
	this.initiate();
	this.proxy = {};
}

PlateController.prototype = Object.create(TypeController.prototype);
PlateController.prototype.constructor = PlateController;

PlateController.prototype.process = function(data) {
	this.proxy = {};
	for(key in data) {
		if (data.hasOwnProperty(key)) {
			var namespace = data[key].tpn;
			this.proxy[namespace] = {};
			this.proxy[namespace].tid = data[key].tid;
			this.proxy[namespace].tpn = data[key].tpn;
			this.proxy[namespace].ps = data[key].ps;
			this.proxy[namespace].com = data[key].com;
		}
	}
	for (key in this.items) {
		if (this.items.hasOwnProperty(key))  {
			if (typeof this.proxy[key.replace('_','')] != 'undefined') { //HAVE IT AND CHANGE IT!
				this.items[key].reshape(this.proxy[key.replace('_','')]);
				delete this.proxy[key.replace('_','')];
			} else { //NO NEED TO BE DISPLAYED ANYMORE.
				this.items[key].destroy();
				delete this.items[key];
			}
		}
	}
	this.delayMaker();
}

PlateController.prototype.delayMaker = function() {
	var self = this;
	for(key in this.proxy) {
		if (this.proxy.hasOwnProperty(key)) {
			var namespace = '_'+key;
			this.items[namespace] = new PlateItem(this.proxy[key],this);
			this.items[namespace].reshape(this.proxy[key]);
			delete this.proxy[key];
			setTimeout(function() {self.delayMaker()}, 0);
			return;
		}
	}
	this.timer = setTimeout(function() {self.sync();},3000);
}

var PlateItem = function PlateItem(data,parent) {
	this.parent = parent;
	this.data = data;
	this.transactionPlateNo = this.data.tpn;
	this.compounded = 0;
	this.plateStatus = 1;
	this.generateHTML();
}

PlateItem.prototype = {};
PlateItem.prototype.generateHTML = function() {
	var self = this;
	this.element = $('<div>', {class: 'list-group-item valid'});
	this.element.css('opacity',0);
	this.element.attr('plate',this.data.tpn);
	this.plateElement = $('<div>', {class: 'plate-element'});
	this.plateElement.text(this.data.tpn);
	this.plateElement.appendTo(this.element);
	this.compoundElement = $('<div>', {class: 'plate-compounded-element hide-quick'});
	this.compoundElement.text('Dikompaun');
	this.compoundElement.appendTo(this.element);
	$('<div>', {style: 'clear: both;'}).appendTo(this.element);
	this.element.appendTo(this.parent.container);
	this.element.animate({opacity:1});
	this.element.click(function(e) {
		plateDetails.request(self);
	});
}

PlateItem.prototype.reshape = function(data) {
	if (this.plateStatus != data.ps) {
		this.element.switchClass(statusDefinition[this.plateStatus],statusDefinition[data.ps]);
		this.plateStatus = data.ps;
	}
	if (this.compounded != data.com) {
		if (data.com == 1) {
			this.compoundElement.switchClass('hide-quick','show-quick');
		} else {
			this.compoundElement.switchClass('show-quick','hide-quick');
		}
		this.compounded = data.com;
	}
}

PlateItem.prototype.destroy = function() {
	this.element.remove();
}