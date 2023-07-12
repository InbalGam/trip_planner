--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

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

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    date date NOT NULL,
    trip_id integer,
    activity_name character varying NOT NULL,
    address character varying,
    url character varying,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    user_id integer,
    user_notes text,
    type character varying,
    address_lat real,
    address_lng real
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activities_id_seq OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: activity_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_comments (
    id integer NOT NULL,
    activity_id integer,
    user_id integer,
    comment text,
    "timestamp" timestamp with time zone
);


ALTER TABLE public.activity_comments OWNER TO postgres;

--
-- Name: activity_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_comments_id_seq OWNER TO postgres;

--
-- Name: activity_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_comments_id_seq OWNED BY public.activity_comments.id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    id integer NOT NULL,
    country character varying,
    city character varying,
    start_date date,
    end_date date,
    created_by integer NOT NULL,
    photo character varying
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trips_id_seq OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trips_id_seq OWNED BY public.trips.id;


--
-- Name: trips_shared; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips_shared (
    trip_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.trips_shared OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    password character varying,
    nickname character varying,
    CONSTRAINT username_email CHECK (((username)::text ~* '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'::text))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: activity_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments ALTER COLUMN id SET DEFAULT nextval('public.activity_comments_id_seq'::regclass);


--
-- Name: trips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips ALTER COLUMN id SET DEFAULT nextval('public.trips_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, date, trip_id, activity_name, address, url, start_time, end_time, user_id, user_notes, type, address_lat, address_lng) FROM stdin;
1	2023-06-08	1	Eiffel Tower	sfsfsf	sfsffs	10:00:00	12:00:00	2	stam for play	\N	\N	\N
34	2023-09-05	52	Going for coffee!	Napoli rd. 5		09:00:00	10:00:00	17	Best coffee in town	Drink	\N	\N
8	2023-05-01	32	blubli	ddsds	www.ggg.com	08:00:00	13:00:00	17	No notes	\N	\N	\N
9	2023-05-01	32	blubli	ddsds	www.ggg.com	08:00:00	13:00:00	17	No notes	\N	\N	\N
10	2023-05-01	32	blubli	ddsds	www.ggg.com	08:00:00	13:00:00	17	No notes	\N	\N	\N
13	2023-07-07	46	Check activity insert	Parisssssssssss	www.ddd.com	10:20:00	12:10:00	17		\N	\N	\N
39	2023-07-04	46	lets have fun in Paris	Paris, France	www.paris111.com	10:00:00	13:00:00	17		Tour	48.856613	2.352222
36	2023-09-06	52	City tour	Napoli rd. 10		10:00:00	15:00:00	17		Tour	\N	\N
\.


--
-- Data for Name: activity_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_comments (id, activity_id, user_id, comment, "timestamp") FROM stdin;
1	1	2	fffff	2023-06-25 11:20:12+00
6	8	17	just checking	2023-06-21 13:40:30.579+00
7	8	17	just checking	2023-06-21 13:40:32.072+00
8	8	17	just checking	2023-06-21 13:40:33.003+00
34	34	17	I love the coffee there!	2023-07-08 07:40:53.999+00
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (id, country, city, start_date, end_date, created_by, photo) FROM stdin;
1	FranceDummy	Paris	2023-06-07	2023-06-23	1	\N
53	India	Mumbai	2023-08-08	2023-08-15	17	\N
32	ItalyDummy	rome	2023-05-16	2023-05-22	17	\N
2	GermanyShtut	Berlin	2023-05-19	2023-05-22	1	\N
4	GermanyDummy	Berlin	2023-07-16	2023-07-22	1	\N
3	GermanyDummy	Berlin	2023-07-16	2023-07-22	1	\N
5	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
6	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
8	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
10	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
11	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
12	ItalCheck	Romecheck	2023-05-01	2023-05-09	1	\N
57	Germany	Munich, Germany	2023-07-12	2023-07-15	17	\N
36	United Arab Emirates	fsdfs	2023-09-04	2023-09-14	17	\N
38	United Arab Emirates	fsdfs	2023-09-04	2023-09-14	17	\N
39	Lebanon	dsfsfs	2023-09-04	2023-09-07	17	\N
41	Albania	adrfeg	2023-06-26	2023-06-26	18	\N
42	Åland Islands	daa	2023-06-26	2023-06-26	18	\N
58	France	Strasbourg, France	2023-07-16	2023-07-20	17	https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAaw_FcL8gsDmmJO3cZ16al_50cJS4zSAXcM2s_v4Ccz1_YuajTt0Hqq4ILf8yQ8_Yu1ZlJ01lrXHpzN6zGrVlfNs8tI99CZ8StWaxTq_gKFZEy4T-L51CLw0TQaJ-JaYQIp9tMtbsvLxZygQR4CH9QoGZxMnKoB5qZIlosidad5Wx0WLBsdd&3u2823&5m1&2e1&callback=none&key=AIzaSyAQ22bcXwMCKfVDWT7lTXW6SW5P2_6dFCY&token=92457
37	United Arab Emirates	fsdfs	2023-08-31	2023-09-10	17	\N
9	Italcheck	Romecheck	2023-05-01	2023-05-09	1	\N
7	GermanyDummy	Berlin	2023-04-16	2023-04-22	1	\N
46	France	Paris	2023-07-05	2023-07-12	17	\N
49	Algeria	Tel Aviv	2023-07-06	2023-07-06	18	\N
51	Kuwait	Rome	2023-08-06	2023-08-12	18	\N
52	Italy	Napoli	2023-09-04	2023-09-07	17	\N
\.


--
-- Data for Name: trips_shared; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips_shared (trip_id, user_id) FROM stdin;
1	1
32	17
52	17
52	18
37	17
53	17
53	18
37	18
57	17
46	17
46	18
57	18
58	17
58	18
49	18
51	18
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, nickname) FROM stdin;
1	inbalSTAM@gmail.com	stamstam	InbStam
2	nirSTAM@gmail.com	mstam	NirStam
17	inbalG@gmail.com	$2b$10$/Q5DPDubFns6w1Ztyp6/WeH98UlJzoWVffkMj.Q0APo7CXYa9g.VG	inb
18	nirHALAY@gmail.com	$2b$10$vKLKhR8MrcFaSal27YSAbOpTF1CTQw6zxUfmxSYYcm.DhtV8JTIta	nirHAHAMUD
20	fafafasd@yahoo.com	$2b$10$dAx1S4QyAwUlxbgPh3GaYe2i65vRDVqyojodBtabCeCY61sGzL0om	hhgfhgf
22	adaa@gmail.com	$2b$10$upsDlTt.rk8JFWSzsJSSQexyR4qwr.ggDMq1K3O/eHPD/kCf4/I9K	dsgdfghdfh
23	inbalgam@gmail.com	$2b$10$5X0JYUzxE9OeN6KVK/HhueEfliyrk7rdu6lhU5K1giMn3AiGYag.a	bcbc
24	inbalgam@yahoo.com	$2b$10$wHUACfzL.Jz3aL47.42NmeoEBAwmmcEupJNJnJuNiIQlv6ubr8FD.	bdgfhgfj
25	fsfsd@gmail.com	$2b$10$yeBGJ.5mPepLiW10Iqi/V.h4B8hxkWsH0uIqOF5DXH/JqQSuBctmu	dfhdfhgf
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 50, true);


--
-- Name: activity_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_comments_id_seq', 36, true);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trips_id_seq', 60, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 25, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_comments activity_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments
    ADD CONSTRAINT activity_comments_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: activities activities_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: activity_comments activity_comments_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments
    ADD CONSTRAINT activity_comments_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: activity_comments activity_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments
    ADD CONSTRAINT activity_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trips trips_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trips_shared trips_shared_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips_shared
    ADD CONSTRAINT trips_shared_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trips_shared trips_shared_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips_shared
    ADD CONSTRAINT trips_shared_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

