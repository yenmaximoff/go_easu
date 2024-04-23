
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE public.types (
    id integer NOT NULL,
    type_name character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);




CREATE SEQUENCE public.types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




ALTER SEQUENCE public.types_id_seq OWNED BY public.types.id;


CREATE TABLE public.files (
    id integer NOT NULL,
    title character varying,
    description text,
    file_path character varying,
    file_hash character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


CREATE TABLE public.file_types (
    id integer NOT NULL,
    file_id integer,
    type_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


CREATE SEQUENCE public.files_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_types_id_seq OWNED BY public.file_types.id;


CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


ALTER TABLE ONLY public.types ALTER COLUMN id SET DEFAULT nextval('public.types_id_seq'::regclass);


ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


ALTER TABLE ONLY public.file_types ALTER COLUMN id SET DEFAULT nextval('public.files_types_id_seq'::regclass);


SELECT pg_catalog.setval('public.types_id_seq', 9, true);


SELECT pg_catalog.setval('public.files_types_id_seq', 1, false);


SELECT pg_catalog.setval('public.files_id_seq', 4, true);


ALTER TABLE ONLY public.types


ALTER TABLE ONLY public.file_types
    ADD CONSTRAINT movies_genres_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.files
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.file_types
    ADD CONSTRAINT fk_movie_genries_genre_id FOREIGN KEY (type_id) REFERENCES public.types(id);



ALTER TABLE ONLY public.file_types
    ADD CONSTRAINT fk_movie_genries_movie_id FOREIGN KEY (file_id) REFERENCES public.files(id);


