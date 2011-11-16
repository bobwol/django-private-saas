function M3dHintObject(opts){
    this.config = {
        content: '.download-content',
        containerId: 'm3dHintContainerId',
        zIndex: 2003,
        mainbodyId: '#models3d-block',
        loadingImage: '/static/images/loader.big.white.gif'
    };
    jQuery.extend(this.config, opts);
    
    this.container = null;
    this.sender = null;
    this.model3d = null;
    this.shown = false;
}

M3dHintObject.prototype = {
    toggle: function(el){
	if (jQuery(el).hasClass('active')){
	    this.hide(el);
	} else {
	    this.show(el);
        }
    },
    show: function(el){
        var self = this;
        if(this.container == null) this.init();

        this.sender = jQuery(el);
	this.sender.addClass('active');

	if (BuyDialog.isShown()){
	    BuyDialog.hide(el);
	}
	if (M3dDropdown.isShown()){
	    M3dDropdown.hide(el);
	}

	this.model3d = jQuery(this.sender).closest('.model3d');
	jQuery('div.model3d.active').removeClass('active');
	this.model3d.addClass('active');

	this.model3d.find('.model3d-more-button').addClass('inactive');

        jQuery(this.config.mainbodyId).block({
            message: null,
            fadeIn:0,
            fadeOut:0,
            overlayCSS:{backgroundColor:'#fff'}
        });
        
	this.setValue(jQuery(this.config.content, this.model3d).html());
	this.move_to_position(this.sender);
	this.open();
        
        return false;
    },
    hide: function(el){
	if (this.isShown()){
	    this.sender.removeClass('active');
	    this.model3d.find('.model3d-more-button').removeClass('inactive');

	    jQuery('div.model3d.active').removeClass('active');
	    jQuery(this.config.mainbodyId).unblock();
        
	    this.close();
	}
    
        return false;
    },
    open: function(){
        if(this.isShown()) return;

        this.container.show();
        this.shown = true;
    },
    close: function(){
	if (this.container != null)
	    this.container.hide();

        this.shown = false;
    },
    setValue: function(val){
        jQuery('.bodyTip>.bodyTip-inner', this.container).html(val);
    },
    load: function(url){
        var self = this;
        jQuery.get(url,
            {ajax:1},
            function(data){
		if (data.success == 1){
		    self.setValue(data.html);
		    self.move_to_position(self.sender);
		    self.open();
		} else {
		    messenger.error(data.message);
		}
            },'json');
    },
    init: function(){
        if (!jQuery('#'+this.config.containerId).length) {
            jQuery('body').append(this.generate());
        }    
    },
    generate: function(){
        if (!this.container) {
            this.container = jQuery('<div id="'+this.config.containerId+'" class="tipContainer">'+
                                '<i class="tip-tl"></i>'+
                                '<i class="tip-tr"></i>'+
                                '<i class="tip-t"></i>'+
                                '<i class="tip-l"></i>'+
                                '<div class="tip-content">'+
				    '<div class="pointyTip"></div>'+
                                    '<div class="closeTip" title="Close (Esc)">'+
                                        '<i></i>'+
                                    '</div>'+
                                    '<div class="bodyTip">'+
                                        '<div class="bodyTip-inner clearfix"></div>'+
                                    '</div>'+
                                '</div>'+
                                '<i class="tip-r"></i>'+
                                '<i class="tip-b"></i>'+
                                '<i class="tip-bl"></i>'+
                                '<i class="tip-br"></i>'+
                            '</div>');
            
            this.container.css('z-index', this.config.zIndex);
            this.bind();
        }
        return this.container;
    },
    move_to_position: function(el){
	var _m3d = jQuery(el).closest('.model3d');
	var _cont = this.container;
        var left = _m3d.offset().left;
	if ((left + _cont.outerWidth()) >= jQuery(document).width()){
	    left +=  _m3d.outerWidth() - _cont.outerWidth() +2;
	}
	var top = jQuery(el).offset().top + jQuery(el).height();

	var pointy = jQuery('.pointyTip', this.container);
	var pointy_left = this.sender.offset().left + (this.sender.outerWidth()/2) - left;
	pointy_left -= 10; // a half of pointy width
	pointy.css({'left':pointy_left});

        jQuery(this.container).css({'left':left, 'top':top});
    },
    bind: function(){
        var self = this;
        jQuery("body").click(function(){
		if (self.isShown())
                self.hide(self.sender);
        });

        jQuery(self.container).click(function(e){
            e.stopPropagation();
        });
        
        jQuery('.closeTip', self.container).click(function(){
            self.hide(self.sender);
        });
    },
    isShown: function(){
        return this.shown;
    }
};
var M3dHint = new M3dHintObject();
