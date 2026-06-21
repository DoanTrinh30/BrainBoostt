--
-- PostgreSQL database dump
--

\restrict yI8H50e4hYvecjg8qDGRyvpFi6Ln440F90cvGZ9Md7XXCBbtB95qDadCuF9C2IA

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: decks_visibility_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.decks_visibility_enum AS ENUM (
    'private',
    'public'
);


ALTER TYPE public.decks_visibility_enum OWNER TO postgres;

--
-- Name: folders_visibility_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.folders_visibility_enum AS ENUM (
    'private',
    'public'
);


ALTER TYPE public.folders_visibility_enum OWNER TO postgres;

--
-- Name: review_logs_difficulty_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.review_logs_difficulty_enum AS ENUM (
    'easy',
    'medium',
    'hard'
);


ALTER TYPE public.review_logs_difficulty_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    student_quantity integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    author_id integer
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: decks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.decks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    visibility public.decks_visibility_enum DEFAULT 'private'::public.decks_visibility_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    author_id integer
);


ALTER TABLE public.decks OWNER TO postgres;

--
-- Name: flashcards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flashcards (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    front_text text NOT NULL,
    back_text text NOT NULL,
    image_url text,
    audio_url text,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deck_id uuid
);


ALTER TABLE public.flashcards OWNER TO postgres;

--
-- Name: folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    visibility public.folders_visibility_enum DEFAULT 'private'::public.folders_visibility_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    author_id integer
);


ALTER TABLE public.folders OWNER TO postgres;

--
-- Name: review_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    review_count integer DEFAULT 0 NOT NULL,
    days_since_last_review double precision DEFAULT '0'::double precision NOT NULL,
    previous_accuracy double precision DEFAULT '0.5'::double precision NOT NULL,
    response_time_ms integer NOT NULL,
    difficulty public.review_logs_difficulty_enum DEFAULT 'medium'::public.review_logs_difficulty_enum NOT NULL,
    hour_of_day integer NOT NULL,
    is_correct boolean NOT NULL,
    predicted_probability double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    flashcard_id uuid
);


ALTER TABLE public.review_logs OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password text NOT NULL,
    username character varying,
    dob date,
    avatar_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
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
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, name, student_quantity, created_at, updated_at, author_id) FROM stdin;
\.


--
-- Data for Name: decks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.decks (id, name, description, visibility, created_at, updated_at, author_id) FROM stdin;
054b9878-99cc-4fed-9a5d-99bbda0874ca	Office	Văn phòng	private	2026-06-20 14:15:47.415256	2026-06-20 14:15:47.415256	1
\.


--
-- Data for Name: flashcards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flashcards (id, front_text, back_text, image_url, audio_url, description, created_at, updated_at, deck_id) FROM stdin;
2eb3533a-0f51-4e04-a524-a90691f8a2fa	employee	nhân viên	\N	\N	\N	2026-06-20 14:15:47.562782	2026-06-20 14:15:47.562782	054b9878-99cc-4fed-9a5d-99bbda0874ca
acf07020-c8f8-4d55-b246-ed5121c31c7c	manager	quản lý	\N	\N	\N	2026-06-20 14:15:47.562782	2026-06-20 14:15:47.562782	054b9878-99cc-4fed-9a5d-99bbda0874ca
70dd9cb8-d163-45fb-961e-eb149c72acef	colleague	đồng nghiệp	\N	\N	\N	2026-06-20 14:15:47.562782	2026-06-20 14:15:47.562782	054b9878-99cc-4fed-9a5d-99bbda0874ca
90b6f120-552f-4849-9d2f-1e67ad140655	department	phòng ban	\N	\N	\N	2026-06-20 14:15:47.562782	2026-06-20 14:15:47.562782	054b9878-99cc-4fed-9a5d-99bbda0874ca
dedf6771-6790-49d8-9bc1-cdbc03812d94	schedule	lịch trình	\N	\N	\N	2026-06-20 14:15:47.562782	2026-06-20 14:15:47.562782	054b9878-99cc-4fed-9a5d-99bbda0874ca
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.folders (id, name, visibility, created_at, updated_at, author_id) FROM stdin;
\.


--
-- Data for Name: review_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_logs (id, review_count, days_since_last_review, previous_accuracy, response_time_ms, difficulty, hour_of_day, is_correct, predicted_probability, created_at, user_id, flashcard_id) FROM stdin;
d8ae2048-dbcc-4a01-b4b0-7f40ff3a9367	0	0	0.5	3770	medium	21	t	0.98	2026-06-20 14:16:03.056071	1	2eb3533a-0f51-4e04-a524-a90691f8a2fa
fbaba406-d46b-46f0-826e-9d640b755baa	0	0	0.5	8888	medium	21	t	0.98	2026-06-20 14:16:11.96585	1	acf07020-c8f8-4d55-b246-ed5121c31c7c
2f0d8069-04c5-416c-bb22-d19551221dea	0	0	0.5	1387	medium	21	t	0.98	2026-06-20 14:16:13.294064	1	70dd9cb8-d163-45fb-961e-eb149c72acef
aea0170a-420c-478c-a7f6-5689c193d862	0	0	0.5	3947	medium	21	f	0.98	2026-06-20 14:16:17.285341	1	90b6f120-552f-4849-9d2f-1e67ad140655
440f5a22-bf2d-4bff-b4ba-00665af7bf68	0	0	0.5	4708	medium	21	t	0.98	2026-06-20 14:16:22.099109	1	dedf6771-6790-49d8-9bc1-cdbc03812d94
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, username, dob, avatar_url, created_at, updated_at) FROM stdin;
1	trinh@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ksqMIlmQpOm/ycrRc8x+Wg$yftj7VmDVCrndYX9ChPe46w460EcPcnX3Bj8zAUzpLw	Trinh	\N	\N	2026-06-20 14:10:34.553345	2026-06-20 14:10:34.553345
2	teacher@example.com	$argon2id$v=19$m=65536,t=3,p=4$ksqMIlmQpOm/ycrRc8x+Wg$yftj7VmDVCrndYX9ChPe46w460EcPcnX3Bj8zAUzpLw	Teacher	\N	\N	2026-06-20 14:10:34.572102	2026-06-20 14:10:34.572102
3	admin@example.com	$argon2id$v=19$m=65536,t=3,p=4$ksqMIlmQpOm/ycrRc8x+Wg$yftj7VmDVCrndYX9ChPe46w460EcPcnX3Bj8zAUzpLw	Admin	\N	\N	2026-06-20 14:10:34.583964	2026-06-20 14:10:34.583964
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: review_logs PK_50f4c1ba68709ee9db5e55caace; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_logs
    ADD CONSTRAINT "PK_50f4c1ba68709ee9db5e55caace" PRIMARY KEY (id);


--
-- Name: folders PK_8578bd31b0e7f6d6c2480dbbca8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY (id);


--
-- Name: decks PK_981894e3f8dbe5049ac59cb1af1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT "PK_981894e3f8dbe5049ac59cb1af1" PRIMARY KEY (id);


--
-- Name: flashcards PK_9acf891ec7aaa7ca05c264ea94d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT "PK_9acf891ec7aaa7ca05c264ea94d" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: classes PK_e207aa15404e9b2ce35910f9f7f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: review_logs FK_540d258ef2e6d98e6b7a177d6b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_logs
    ADD CONSTRAINT "FK_540d258ef2e6d98e6b7a177d6b3" FOREIGN KEY (flashcard_id) REFERENCES public.flashcards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: decks FK_b6237502f1d3754362550daf0b7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT "FK_b6237502f1d3754362550daf0b7" FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_logs FK_b8b0075cc11fddb64e84a987026; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_logs
    ADD CONSTRAINT "FK_b8b0075cc11fddb64e84a987026" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: folders FK_dbc4e79223904e78272db766ceb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT "FK_dbc4e79223904e78272db766ceb" FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: classes FK_edc956b2b1d6f8947dd43ade1d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "FK_edc956b2b1d6f8947dd43ade1d5" FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flashcards FK_f5cfe514e6b44fc2779e34a059a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT "FK_f5cfe514e6b44fc2779e34a059a" FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict yI8H50e4hYvecjg8qDGRyvpFi6Ln440F90cvGZ9Md7XXCBbtB95qDadCuF9C2IA

