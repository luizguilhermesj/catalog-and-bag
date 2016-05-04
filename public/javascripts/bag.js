(function(){
    var Bag = function(element, options){
        this.$element = $(element);
        this.options  = options;

        this.products = {};
        this.templateHtml = null;

        this.$itens = this.$element.find('[data-itens]');
        this.$priceFull = this.$element.find('[data-price-full]');
        this.$priceInstallments = this.$element.find('[data-price-installments]');
        this.$badges = $('[data-bag-badge]');

        this.$element.on('bag.updated', $.proxy(this, 'render'));
        this.$element.on('click', '[data-remove]', $.proxy(this, 'removeEvent'));

        this.init();
    };

    Bag.DEFAULTS = {
        template: null,
        currencyFormat: "$"
    };

    Bag.prototype.init = function() {
        if (!this.options.template) {
            throw new Error("data-template must be defined as an attribute with the css selector for the template");
        }
        this.templateHtml = $(this.options.template).html();

        Mustache.parse(this.templateHtml);   // optional, speeds up future uses
    };

    Bag.prototype.add = function(product) {
        var product = jQuery.extend({}, product);
        var id = product.sku+product.size;
        if (this.products[id]) {
            this.products[id].quantity++;
            this.$element.trigger('bag.updated');

            Materialize.toast(this.products[id].quantity +' '+product.title+' - '+product.size+' na Sacola!', 4000, 'yellow darken-4');
            return;
        }

        product.id = id;
        product.quantity = 1;
        product.imageUrl = '/images/example-1.jpg';
        product.currencyFormat = this.options.currencyFormat;

        this.products[id] = product;

        Materialize.toast(product.title+' - '+product.size+' adicionado(a) à Sacola!', 4000, 'green');
        this.$element.trigger('bag.updated');
    };

    Bag.prototype.removeEvent = function(e) {
        this.remove($(e.target).data('remove'));
    }

    Bag.prototype.remove = function(id) {
        var message = this.products[id].quantity;
        message += ' '+this.products[id].title;
        message += ' - '+this.products[id].size;
        message += ' removido da Sacola!';
        Materialize.toast(message, 4000, 'blue darken-2');
        delete this.products[id];
        this.$element.trigger('bag.updated');
    }

    Bag.prototype.render = function() {
        var rendered ="";
        var subtotal = 0;
        var quantity = 0;
        $('body').toggleClass('bag-is-empty', (Object.keys(this.products).length == 0));

        for (var i in this.products) {
            console.log(i);
            console.log(this.products[i]);
            rendered += Mustache.render(this.templateHtml, this.products[i]);
            subtotal += this.products[i].price;
            quantity += this.products[i].quantity;
        }

        this.$badges.text(quantity);
        this.$priceFull.html(this.options.currencyFormat+' '+subtotal.toString().replace('.',','));
        this.$priceInstallments.html('OU EM ATÉ 10 X de '+this.options.currencyFormat+' '+(subtotal/10).toFixed(2).replace('.',','));

        this.$itens.html(rendered);
    };

    /*
     * Jquery plugin declaration
    */
    $.fn.bag = function(option, args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bag');
            var options = $.extend({}, Bag.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('bag', (data = new Bag(this, options)));

            if (typeof option == 'string') data[option](args);
        });
    };

    $(document).on('bag.add', function(e){
        $('[data-bag]').bag('add', $(e.target).data());
    })

    // initialize bag on page ready
    $(document).ready(function(){
        $('[data-bag]').bag();
    });
})();