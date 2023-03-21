CREATE TABLE public.users (
    id uuid NOT NULL,
    username varchar NOT NULL,
    password varchar NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
);