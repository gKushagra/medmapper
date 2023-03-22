drop table public.inventory;

CREATE TABLE public.inventory (
	id uuid NOT NULL,
	product_ndc varchar NOT NULL,
	generic_name varchar NOT NULL,
	brand_name varchar,
	active_ingredients text,
	package_ndc varchar,
	product_id varchar,
	product_type varchar NOT NULL,
	dosage_form varchar,
	manufacturer_name varchar NOT NULL,
	quantity_on_hand int NOT NULL,
	last_updated timestamp with time zone NOT NULL,
	package_description text,
	item_barcode varchar,
	CONSTRAINT inventory_pk PRIMARY KEY (id)
);