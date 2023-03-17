CREATE TABLE public.inventory (
	id uuid NOT NULL,
	product_ndc varchar NOT NULL,
	generic_name varchar NOT NULL,
	brand_name varchar NOT NULL,
	active_ingredients text NOT NULL,
	package_ndc varchar NOT NULL,
	product_id varchar NOT NULL,
	product_type varchar NOT NULL,
	dosage_form varchar NOT NULL,
	manufacturer_name varchar NOT NULL,
	quantity_on_hand int NOT NULL,
	max_level int NOT NULL,
	reorder_level int NOT NULL,
	last_updated timestamp with time zone NOT NULL,
	package_description text NOT NULL,
	item_barcode varchar NOT NULL,
	CONSTRAINT inventory_pk PRIMARY KEY (id)
);
