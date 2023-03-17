CREATE TABLE public.scan_session (
	id uuid NOT NULL,
	link text NOT NULL,
	expiry timestamp with time zone NOT NULL,
	created_by varchar NOT NULL,
	created_at timestamp with time zone NOT NULL,
	CONSTRAINT scan_session_pk PRIMARY KEY (id)
);
