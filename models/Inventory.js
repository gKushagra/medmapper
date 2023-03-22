class Inventory {
    constructor(id, product_ndc, generic_name, product_type, manufacturer_name, quantity_on_hand, last_updated) {
        this.id = id;
        this.product_ndc = product_ndc;
        this.generic_name = generic_name;
        this.product_type = product_type;
        this.manufacturer_name = manufacturer_name;
        this.quantity_on_hand = quantity_on_hand;
        this.last_updated = last_updated;
    }
}

module.exports = Inventory;