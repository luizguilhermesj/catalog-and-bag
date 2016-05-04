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

        if (localStorage) {
            var products = localStorage.getItem('bag-products');
            if (products) {
                this.products = JSON.parse(products);
                this.render();
            }
        }
    };

    Bag.prototype.add = function(newProduct) {
        var product;
        var id = newProduct.sku + newProduct.size;

        if (this.products[id]) {
            this.products[id].quantity++;
            this.products[id].price = this.products[id].price + this.products[id].price;
            this.$element.trigger('bag.updated');

            var message = this.products[id].quantity;
            message += ' '+this.products[id].title;
            message += ' - '+this.products[id].size;
            message += ' na Sacola!';
            Materialize.toast(message, 4000, 'yellow darken-4');
            return;
        }

        product = {
            id: id,
            sku: newProduct.sku,
            size: newProduct.size,
            price: newProduct.price,
            color: newProduct.color,
            title: newProduct.title,
            imageUrl: newProduct.imgUrl,
            quantity: 1,
            currencyFormat: this.options.currencyFormat
        }

        this.products[id] = product;

        Materialize.toast(product.title+' - '+product.size+' adicionado(a) à Sacola!', 4000, 'green');
        this.$element.trigger('bag.updated');
    };

    Bag.prototype.removeEvent = function(e) {
        this.remove($(e.target).data('remove'));
    };

    Bag.prototype.remove = function(id) {
        var message = this.products[id].quantity;
        message += ' '+this.products[id].title;
        message += ' - '+this.products[id].size;
        message += ' removido da Sacola!';
        Materialize.toast(message, 4000, 'blue darken-2');

        delete this.products[id];
        this.$element.trigger('bag.updated');
    };

    Bag.prototype.render = function() {
        var rendered ="";
        var subtotal = 0;
        var quantity = 0;
        if (localStorage) localStorage.setItem('bag-products', JSON.stringify(this.products));
        $('body').toggleClass('bag-is-empty', (Object.keys(this.products).length == 0));

        for (var i in this.products) {
            this.products[i].priceFormatted = $.formatPrice(this.products[i].price);

            rendered += Mustache.render(this.templateHtml, this.products[i]);
            subtotal += this.products[i].price;
            quantity += this.products[i].quantity;
        }

        this.$badges.text(quantity);
        this.$priceFull.html(this.options.currencyFormat+' '+$.formatPrice(subtotal));
        this.$priceInstallments.html('OU EM ATÉ 10 X de '+this.options.currencyFormat+' '+$.formatPrice(subtotal/10));

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
    });

    // initialize bag on page ready
    $(document).ready(function(){
        $('[data-bag]').bag();
    });
})();