export class Inventory {
    constructor(id, product_ndc, generic_name, active_ingredients, package_ndc, product_id,
        product_type, dosage_form, manufacturer_name, quantity_on_hand, last_updated,
        package_description, item_barcode) {
        this.id = id;
        this.product_ndc = product_ndc;
        this.generic_name = generic_name;
        this.active_ingredients = active_ingredients;
        this.package_ndc = package_ndc;
        this.product_id = product_id;
        this.product_type = product_type;
        this.dosage_form = dosage_form;
        this.manufacturer_name = manufacturer_name;
        this.quantity_on_hand = quantity_on_hand;
        this.last_updated = last_updated;
        this.package_description = package_description;
        this.item_barcode = item_barcode;
    }
}