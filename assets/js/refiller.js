var refiller = function(modal) {
var modal = $(modal);
var form = modal.find('form');
var dataSource = form.attr('data-source');

this.refill = function(param) {
	var self = this;
	$.get(dataSource,param,function(data){
		var SignalResult = AjaxResultHandler(data);
		for(key in data) {
			if(data.hasOwnProperty(key)) {
				modal.find('[name='+key+']').val(data[key]);
			}
		}
	}).fail(function() {
		notification.show('alert','Tidak Berjaya','Gagal menghubungi pelayan.');
		modal.modal('hide');
	});
}
}