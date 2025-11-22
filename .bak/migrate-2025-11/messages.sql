--
-- PostgreSQL database dump
--

\restrict lKuBsfA2F88EpvZi9kdsUakIDniygUuTYbjK2dqASQjkWCPEOsQsz00iTM8pApW

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
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, member_id, created_at, method, subject, message) FROM stdin;
6	3534	2025-02-06 00:54:59.795684	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
7	3484	2025-03-02 00:55:03.260225	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
8	3534	2025-03-07 00:55:03.95205	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
9	3503	2025-03-09 00:55:04.211088	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
10	3894	2025-03-09 00:55:04.527831	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
11	4432	2025-03-09 00:55:04.590972	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
12	4436	2025-03-11 00:55:02.485026	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
13	4249	2025-03-15 00:55:02.116947	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
14	4445	2025-03-16 00:55:03.543069	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
15	3897	2025-03-16 00:55:03.569667	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
16	4446	2025-03-16 00:55:03.578469	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
17	4441	2025-03-16 00:55:03.596636	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
18	4442	2025-03-16 00:55:03.607908	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
19	4447	2025-03-16 00:55:03.612486	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
20	4440	2025-03-16 00:55:03.622138	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
21	4449	2025-03-16 00:55:03.624251	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
22	4444	2025-03-16 00:55:03.631725	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
23	4448	2025-03-16 00:55:03.633897	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
24	4443	2025-03-16 00:55:03.779333	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
25	4438	2025-03-16 00:55:03.864604	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
26	4249	2025-03-21 00:55:01.673853	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
27	4457	2025-03-22 00:55:01.762722	email	Obaveštenje	Vaš paket "Dečiji Treninzi 2x" ističe za tri dana. Molimo vas da kontaktirate klub.
28	4458	2025-03-24 00:10:50.237347	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
29	3931	2025-03-25 00:10:51.012413	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
30	4460	2025-03-31 00:05:35.318363	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
31	4459	2025-03-31 00:05:35.62281	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
32	3326	2025-03-31 00:05:35.675762	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
33	3484	2025-04-02 00:05:35.058988	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
34	3477	2025-04-02 00:05:35.212038	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
35	3556	2025-04-02 00:05:35.416156	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
36	4463	2025-04-06 00:05:35.292169	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
37	3257	2025-04-07 00:05:35.532528	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
38	3066	2025-04-09 00:05:35.467878	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
39	4436	2025-04-11 00:05:33.652292	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
40	3213	2025-04-11 00:05:33.667811	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
41	3894	2025-04-11 00:05:33.919785	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
42	4259	2025-04-13 00:05:36.241162	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
43	3326	2025-04-14 00:05:36.032599	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
44	4465	2025-04-15 00:05:35.99602	email	Obaveštenje	Vaš paket "Dečiji Treninzi 2x" ističe za tri dana. Molimo vas da kontaktirate klub.
45	3223	2025-04-15 00:05:36.2145	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
46	4146	2025-04-15 00:05:36.267205	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
47	3897	2025-04-16 00:05:36.43703	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
48	4023	2025-04-16 00:05:36.471977	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
49	4444	2025-04-16 00:05:36.501957	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
50	4440	2025-04-16 00:05:36.478381	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
51	4448	2025-04-16 00:05:36.701434	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
52	3535	2025-04-16 00:05:36.723725	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
53	4437	2025-04-17 00:05:34.915629	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
54	3537	2025-04-20 00:05:35.836071	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
55	3347	2025-04-21 00:05:36.971886	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
56	4249	2025-04-22 00:05:35.238217	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
57	3511	2025-04-22 00:05:35.287454	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
58	3863	2025-04-23 00:05:34.78226	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
59	4454	2025-04-28 00:05:35.407838	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
60	3503	2025-04-28 00:05:35.600822	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
61	4471	2025-04-28 00:05:35.638801	email	Obaveštenje	Vaš paket "Dečiji Treninzi 2x" ističe za tri dana. Molimo vas da kontaktirate klub.
62	4473	2025-04-30 00:05:34.687455	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
63	4458	2025-04-30 00:05:34.951835	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
64	4460	2025-05-01 00:05:36.01778	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
65	4459	2025-05-01 00:05:36.116648	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
66	3955	2025-05-01 00:05:36.269687	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
67	3556	2025-05-04 00:05:34.685239	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
68	3484	2025-05-04 00:05:34.71669	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
69	3308	2025-05-05 00:05:35.102166	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
70	3272	2025-05-07 00:05:35.302432	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
71	4462	2025-05-11 00:05:35.732257	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
72	3320	2025-05-11 00:05:35.764186	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
73	3894	2025-05-13 00:05:34.32073	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
74	3374	2025-05-14 00:05:34.282376	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
75	4146	2025-05-18 00:05:35.411879	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
76	3864	2025-05-19 00:05:35.027599	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
77	4491	2025-05-20 00:05:35.519855	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
78	4492	2025-05-20 00:05:35.575571	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
79	3897	2025-05-20 00:05:35.581872	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
80	4259	2025-05-21 00:05:35.093186	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
81	4470	2025-05-21 00:05:35.298801	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
82	3347	2025-05-21 00:05:35.313415	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
83	3477	2025-05-22 00:05:35.397509	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
84	3357	2025-05-24 00:05:35.648753	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
85	3931	2025-05-25 00:05:35.416549	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
86	3863	2025-05-25 00:05:35.462453	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
87	3173	2025-05-26 00:05:35.506717	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
88	4493	2025-05-26 00:05:35.565177	email	Obaveštenje	Vaš paket "Dečiji Treninzi 2x" ističe za tri dana. Molimo vas da kontaktirate klub.
89	3111	2025-05-28 00:05:35.089636	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
90	4458	2025-06-02 00:05:36.234222	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
91	3503	2025-06-02 00:05:36.531549	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
92	4023	2025-06-04 00:05:35.15958	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
93	4494	2025-06-05 00:05:36.131328	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
94	3465	2025-06-10 00:05:35.49797	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
95	4500	2025-06-11 00:05:34.699613	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
96	4501	2025-06-11 00:05:34.729109	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
97	4495	2025-06-16 00:05:35.64606	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
98	4462	2025-06-16 00:05:35.677847	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
99	4444	2025-06-16 00:05:35.709614	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
100	3320	2025-06-16 00:05:35.718718	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
101	4445	2025-06-16 00:05:35.728554	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
102	4103	2025-06-16 00:05:35.83666	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
103	3894	2025-06-16 00:05:35.893033	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
104	3308	2025-06-17 00:05:35.335894	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
105	4496	2025-06-18 00:05:34.34817	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
106	4146	2025-06-19 00:05:34.8248	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
107	4441	2025-06-20 00:05:34.925376	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
108	4308	2025-06-20 00:05:35.12589	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
109	3347	2025-06-21 00:05:34.805251	email	Obaveštenje	Vaš paket "Grupni Kurs" ističe za tri dana. Molimo vas da kontaktirate klub.
110	3223	2025-06-24 00:05:34.664687	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
111	4470	2025-06-24 00:05:34.796536	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
112	4497	2025-06-25 00:05:34.189053	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
113	4493	2025-06-26 00:05:34.729467	email	Obaveštenje	Vaš paket "Dečiji Treninzi 2x" ističe za tri dana. Molimo vas da kontaktirate klub.
114	4498	2025-06-26 00:05:34.755786	email	Obaveštenje	Vaš paket "Rekreativni Treninzi" ističe za tri dana. Molimo vas da kontaktirate klub.
115	3246	2025-06-27 00:05:33.186175	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
116	4020	2025-06-27 00:05:33.533518	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
117	3863	2025-06-29 00:05:33.899834	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
118	4499	2025-06-30 00:05:33.529057	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
119	3511	2025-06-30 00:05:33.674314	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
120	3357	2025-06-30 00:05:33.752805	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
121	3173	2025-07-03 00:05:34.192446	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
122	4023	2025-07-04 00:05:33.944317	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
123	4458	2025-07-06 00:05:33.774216	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
124	3955	2025-07-07 00:05:33.800111	email	Obaveštenje	Vaš paket "Svaki Radni Dan <" ističe za tri dana. Molimo vas da kontaktirate klub.
125	3465	2025-07-13 00:05:32.855737	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
126	4308	2025-09-26 00:05:34.767774	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
127	4146	2025-09-29 00:05:35.14712	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
128	3308	2025-09-29 00:05:35.33832	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
129	3257	2025-09-29 00:05:35.381939	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
130	3863	2025-09-29 00:05:35.424459	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
131	4530	2025-10-01 00:05:35.226704	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
132	4436	2025-10-05 00:05:35.451763	email	Obaveštenje	Vaš paket "Dečiji Treninzi 3x" ističe za tri dana. Molimo vas da kontaktirate klub.
133	3931	2025-10-08 00:05:34.987368	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
134	3213	2025-10-09 00:05:34.978	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
135	3894	2025-10-26 00:05:34.301565	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
136	3863	2025-10-26 00:05:34.53598	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
137	3535	2025-10-27 00:05:34.672546	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
138	4490	2025-10-30 00:05:35.343961	email	Obaveštenje	Vaš paket "Svaki Radni Dan <>" ističe za tri dana. Molimo vas da kontaktirate klub.
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 138, true);


--
-- PostgreSQL database dump complete
--

\unrestrict lKuBsfA2F88EpvZi9kdsUakIDniygUuTYbjK2dqASQjkWCPEOsQsz00iTM8pApW

