(function(){
    var SizeSelector = function(element, options){
        this.$element = $(element);
        this.options  = options;
        this.availableSizes = null;

        this.init();
        this.$element.parent().on('click', "[data-size-select]", $.proxy(this, 'sizeSelected'));
    };

    SizeSelector.prototype.init = function() {
        if (!this.options.availableSizes) {
            throw new Error("you must inform available sizes like this: data-available-sizes=\"s1,s2,s3\"");
        }

        this.availableSizes = this.options.availableSizes.split(',');
        this.render();
    };

    SizeSelector.prototype.render = function() {
        var $el = this.$element.parent().find('[data-size-selector-options]');
        var html;
        this.$element.parent().addClass('is-active');
        
        if ($el.length) return;
        
        html = "<ul class='size-selector-options' data-size-selector-options>";
        for (var i=0; i<this.availableSizes.length; i++) {
            html += "<li class=''><a href='#' class='size-selector-item' data-size-select='"+this.availableSizes[i]+"'>"+this.availableSizes[i]+"</a></li>";
        }
        html+="</ul>";

        this.$element.parent().append(html);
    };

    SizeSelector.prototype.sizeSelected = function(e) {
        this.$element.data('size',$(e.target).data('sizeSelect'));
        this.$element.parent().removeClass('is-active');
        this.$element.trigger('size-selector.change');
    }

    /*
     * Jquery plugin declaration
    */
    $.fn.sizeSelector = function(option, args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('size-selector');
            var options = $.extend({}, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('size-selector', (data = new SizeSelector(this, options)));

            if (typeof option == 'string') data[option](args);
        });
    };

    // initialize only on click
    $(document).on('click', '[data-size-selector]', function(){
        $(this).sizeSelector('render');
    });
})();