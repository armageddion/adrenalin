--
-- PostgreSQL database dump
--

\restrict cD6tZTVG6cQyX1MBhrNVDEooqHengIJgQFrWmptfsGTDuwtwhGeJAWLXk4W34qe

-- Dumped from database version 15.6
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, name, description, "position") FROM stdin;
53	Individualni Kurs	**35.000** po osobi, za 2 osobe minimum\n\n**45.000** individualni kurs za jednu osobu\n\n30 radnih sati po dogovoru sa instruktorom	0
52	Grupni Kurs	**24.000** (8,000 /mesec)\n\n3 x nedeljno (ponedeljak, sreda, petak) u trajanju od 3 meseca	1
54	Svaki Radni Dan <>	**6.000** /mesec (20% popust za 6 meseci)\n\nCeo dan 10:00 - 22:00	2
57	Svaki Radni Dan <	**3.500** /mesec\n\nPrva smena 10:00 - 16:00	3
55	Dečiji Treninzi 2x	**5.000** /mesec\n\n2 x nedeljno (utorak, cetvrtak)	4
59	Dečiji Treninzi 3x	**6.000** /mesec\n\n3 x nedeljno	5
56	Rekreativni Treninzi	**5.500** /mesec (800 /trening)\n\n2 x nedeljno (utorak, cetvrtak)	6
58	Dnevni trening	**800** /trening	7
\.


--
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.packages_id_seq', 88, true);


--
-- PostgreSQL database dump complete
--

\unrestrict cD6tZTVG6cQyX1MBhrNVDEooqHengIJgQFrWmptfsGTDuwtwhGeJAWLXk4W34qe

