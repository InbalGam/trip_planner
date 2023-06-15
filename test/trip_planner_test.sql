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
    date date,
    trip_id integer,
    activity_name character varying,
    address character varying,
    url character varying,
    start_time time without time zone,
    end_time time without time zone,
    user_id integer,
    user_notes text
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
    end_date date
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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    password character varying,
    nickname character varying
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

COPY public.activities (id, date, trip_id, activity_name, address, url, start_time, end_time, user_id, user_notes) FROM stdin;
1	2023-06-08	1	Eiffel Tower	sfsfsf	sfsffs	10:00:00	12:00:00	2	stam for play
6	2023-06-09	3	just check	nowhere	www	11:00:00	12:00:00	14	\N
7	2023-06-09	3	just check	nowhere	www	11:00:00	12:00:00	14	\N
2	2023-06-09	2	just check	nowhere	www	11:00:00	12:00:00	14	\N
\.


--
-- Data for Name: activity_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_comments (id, activity_id, user_id, comment, "timestamp") FROM stdin;
1	1	2	fffff	2023-06-25 14:20:12+03
3	1	14	just checking	2023-06-14 12:57:34.283+03
4	1	14	just checking	2023-06-14 13:10:31.031+03
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (id, country, city, start_date, end_date) FROM stdin;
1	FranceDummy	Paris	2023-06-07	2023-06-23
2	GermanyShtut	Berlin	2023-05-19	2023-05-22
4	GermanyDummy	Berlin	2023-07-16	2023-07-22
3	GermanyDummy	Berlin	2023-07-16	2023-07-22
5	ItalCheck	Romecheck	2023-05-01	2023-05-09
6	ItalCheck	Romecheck	2023-05-01	2023-05-09
7	ItalCheck	Romecheck	2023-05-01	2023-05-09
8	ItalCheck	Romecheck	2023-05-01	2023-05-09
10	ItalCheck	Romecheck	2023-05-01	2023-05-09
11	ItalCheck	Romecheck	2023-05-01	2023-05-09
12	ItalCheck	Romecheck	2023-05-01	2023-05-09
9	Italcheck	Romecheck	2023-05-01	2023-05-09
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, nickname) FROM stdin;
1	inbalSTAM@gmail.com	stamstam	InbStam
2	nirSTAM@gmail.com	mstam	NirStam
7	Inbal Dummy	blublibla23	shtut
8	\N	\N	\N
9	dumdum Dummy	blublibla23	ttut
10	Shtut Dummy	$2b$10$4xlbqt8adz/SKlW8DhXlV.Mq0d7qhe45atSzm72tUfikrein2qEnu	bluey
11	Shtut Dummy 234	{}	ddd
12	Shtut adaszd 234	$2b$10$OQL6JUrWA9PTbzP.mNVkVOl6zxwcymEUFNp9V0qWEYLPNgeb4yDXa	ddddfffd
13	Shtutdasda34	$2b$10$rBeGlVOZ2uTqXUZwDbaHGOxamwxg39uz49yYpDKlFadALgO/tFsci	dafafas
14	Srasda34	$2b$10$aw7JMRlEQ6UvZEuVuQn3R.YclumfusT6v7Ksj3KzCmn0G3rVqzMYi	ddrt
15	userCHECK	$2b$10$/bPo8QGriCYUkKEmjEL2ROpEeYrX45yRYQ8s8U6q91XQ.1XssqE52	userNickname
16	userCHECK1	$2b$10$wvUMl8AlpSUAiVvOfBSrg.kQKtStjdDI93HmOTyKCD1Re7ylRp/9S	userNickname1
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 7, true);


--
-- Name: activity_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_comments_id_seq', 5, true);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trips_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


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
    ADD CONSTRAINT activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: activity_comments activity_comments_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments
    ADD CONSTRAINT activity_comments_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id);


--
-- Name: activity_comments activity_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_comments
    ADD CONSTRAINT activity_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

