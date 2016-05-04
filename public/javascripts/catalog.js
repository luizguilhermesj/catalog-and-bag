(function(){
    var Catalog = function(element, options){
        this.$element = $(element);
        this.options  = options;

        this.products = [];
        this.templateHtml = null;

        this.$element.on('catalog.updated', $.proxy(this, 'render'));
        this.init();
    };

    Catalog.DEFAULTS = {
        url: '/data/products.json',
        template: null
    };

    Catalog.prototype.init = function() {
        if (!this.options.template) {
            throw new Error("data-template must be defined as an attribute with the css selector for the template");
        }
        this.templateHtml = $(this.options.template).html();

        Mustache.parse(this.templateHtml);   // optional, speeds up future uses
        this.fetch();
    };

    Catalog.prototype.fetch = function() {
        $.get(this.options.url, $.proxy(this, 'fetchEnded'))
            .fail($.proxy(this, 'fetchFailed'));
    };

    Catalog.prototype.fetchFailed = function(data, status){
        console.log(data);
    };

    Catalog.prototype.fetchEnded = function(data, status){
        for (var i=0; i<data.products.length; i++) {
            var price = data.products[i].price.toString().split('.');
            data.products[i].priceInteger = price[0];
            data.products[i].priceDecimal = $.pad(price[1],2);
            if (data.products[i].installments) {
                data.products[i].installmentsPrice = $.formatPrice(data.products[i].price / data.products[i].installments);
            }
        }
        this.products = data.products;
        this.$element.trigger('catalog.updated');
    };

    Catalog.prototype.render = function() {
        var rendered ="";
        for (var i=0; i<this.products.length; i++) {
            rendered += Mustache.render(this.templateHtml, this.products[i]);
        }

        this.$element.html(rendered);
    };

    Catalog.prototype.updateImages = function() {
        for (var i=0; i<this.products.length; i++) {
            (function(product){
                $.get("http://www.netshoes.com.br/search?Ntt="+product.title.replace(/\ /g,"+"), function(data){
                    var el = document.createElement( 'html' );
                    el.innerHTML = data;
                    el = el.querySelector('.lazy');
                    if(el){
                        $("#"+product.sku).find('img').attr('src', el.getAttribute('data-src').replace('254','480'));
                        $("#"+product.sku).find('[data-img-url]').attr('data-img-url', el.getAttribute('data-src').replace('254','480'));
                    }
                });
            })(this.products[i]);
        }
    };

    /*
     * Jquery plugin declaration
    */
    $.fn.catalog = function(option, args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('catalog');
            var options = $.extend({}, Catalog.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('catalog', (data = new Catalog(this, options)));

            if (typeof option == 'string') data[option](args);
        });
    };

    // initialize catalog on page ready
    $(document).ready(function(){
        $('[data-catalog]').catalog();
    });
})();