# Netshoes Cart Test
Demo available at: http://162.243.215.133:8888

### Dependencies

To install the dependencies, at the root of the project, run:

```shell
npm install
```

### Server

To launch the server, at the root of the project, run:

```shell
bin/www
```

Access http://localhost:3000 and you are good to go!

The server runs on port 3000 by default, if you want to change it, you can declare a PORT env variable like this:

```shell
PORT=8080 bin/www
```

### Architecture

This is a components architecture, the idea is to have independent components that can work alongside each other,
without tied behaviors.
They work through events, data-attributes and programatically as a jquery plugin

Their scope are sealed and this three ways are the only ways to comunicate with them.

#### Components

There are three front-end components in this project:
- catalog
- bag
- size-selector

##### catalog
It's used to load and manage the catalog products display
It's loaded on document ready event at the [data-catalog] element

##### size-selector
It's used to select the size of a product
It's loaded on [data-size-selector] click

It will render the data-available-sizes options, so the user can select one.
When the user does it, the component will add a data-size to its element and trigger a `size-selector.change` event.

##### bag
It's used to manage the bag itens, add, remove and calculate the bag total price, installments and itens count for the bag-badge
It's loaded on document ready event at the [data-bag] element

It will listen to `bag.add` events, that can be fired on any element of the document.
This element must have one data-attributes for each of the following informations:
- sku
- title
- size
- price
- color

It will update the html of all [data-bag-badge] elements in the page with the actual number of itens, each time there is a change

### Bonus

Run the following command on your browser to try your lucky with netshoes images =]
```javascript
$('[data-catalog]').catalog('updateImages');
```
