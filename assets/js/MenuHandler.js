var MenuHandler = function MenuHandler(menu) {
	this.menu = $(document).find(menu);
	this.menuList = {};
}

MenuHandler.prototype = {};
MenuHandler.prototype.register = function(string,token) {
	for(key in this.menuList) {
		if(this.menuList.hasOwnProperty(key)) {
			this.menuList[key].hide();
		}
	}
	this.menuList[token] = new MenuItem(string,this.menu);
}

MenuHandler.prototype.show = function(token) {
	for(key in this.menuList) {
		if(this.menuList.hasOwnProperty(key)) {
			this.menuList[key].hide();
		}
	}
	this.menuList[token].show();
}

var MenuItem = function menuItem(string,menu) {
	if (typeof(string) == 'object') {
		this.element = string;
	} else {
	this.element = $(string);
	}
	this.menu = menu;
	this.menu.append(this.element);
	this.show();
}

MenuItem.prototype = {};
MenuItem.prototype.show = function() {
	this.element.show();
}

MenuItem.prototype.hide = function() {
	this.element.hide();
}