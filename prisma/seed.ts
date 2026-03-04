/*
classes terapeuticas
                  id                  |          name           |       created_at        |       updated_at        | description
--------------------------------------+-------------------------+-------------------------+-------------------------+-------------
 96b51c16-c09b-42d7-ba39-8ccb63612ba3 | Analgésicos             | 2026-03-02 13:44:57.616 | 2026-03-02 13:44:57.616 |
 724c1a02-08e9-490d-b6f4-66bb9b89d1a4 | Anti-inflamatórios      | 2026-03-02 13:44:57.618 | 2026-03-02 13:44:57.618 |
 18bf651a-c11b-4da1-82cc-78f424ea8d2c | Antibióticos            | 2026-03-02 13:44:57.619 | 2026-03-02 13:44:57.619 |
 77968239-2dc2-49d4-8fdf-4ff18f8e802d | Antivirais              | 2026-03-02 13:44:57.62  | 2026-03-02 13:44:57.62  |
 a8d059a1-58d3-4147-8fd2-f1d4a513be68 | Anti-hipertensivos      | 2026-03-02 13:44:57.621 | 2026-03-02 13:44:57.621 |
 27373ae5-06a0-42cd-8d60-0310367a5df0 | Hipoglicemiantes        | 2026-03-02 13:44:57.622 | 2026-03-02 13:44:57.622 |
 9a9f0bcb-1165-4dfb-b69f-c649c2bad430 | Anticoagulantes         | 2026-03-02 13:44:57.622 | 2026-03-02 13:44:57.622 |
 ac1a7016-8101-4354-8bbd-a0b197dddb5c | Ansiolíticos            | 2026-03-02 13:44:57.623 | 2026-03-02 13:44:57.623 |
 12f9e18a-236c-4c8c-babe-6f9cf55bf2d2 | Antidepressivos         | 2026-03-02 13:44:57.624 | 2026-03-02 13:44:57.624 |
25:21.276 | 2026-03-03 19:25:21.276 | | Analgésicos             | 2026-03-03 19:--More--
 54c83943-ceb8-43b2-95f3-42142f800ece | Antialérgicos           | 2026-03-03 19:26:10.439 | 2026-03-03 19:26:10.439 |
 bb020d0d-bec0-44ad-aa41-972f24b8b109 | Antifúngicos            | 2026-03-03 19:27:15.609 | 2026-03-03 19:27:15.609 |
 677d5155-c03c-4f9d-93f8-354f559702bd | Antigases               | 2026-03-03 19:27:27.01  | 2026-03-03 19:27:27.01  |
 60ae4124-f371-4801-aaad-12f32f893828 | Antidiarréicos          | 2026-03-03 19:26:51.156 | 2026-03-03 19:27:35.088 |
 04e9dbc8-60a5-461d-84e6-12ee5a8348c5 | Anticoncepcionais       | 2026-03-03 19:26:29.874 | 2026-03-03 19:27:45.971 |
 bf9b664e-035b-46b3-83fe-afdb58a8acd4 | Antigripais             | 2026-03-03 19:27:53.097 | 2026-03-03 19:27:53.097 |
 3df13077-417d-410b-acd4-07921e201ee7 | Antimicóticos           | 2026-03-03 19:28:08.833 | 2026-03-03 19:28:08.833 |
 20b0dab4-ae21-47c8-9ade-376296bd7f0b | Antimicrobianos         | 2026-03-03 19:28:17.572 | 2026-03-03 19:28:17.572 |
 a7611d7c-2d1f-4d29-9f0a-b1b81a1b75fd | Antitérmicos            | 2026-03-03 19:28:27.146 | 2026-03-03 19:28:27.146 |
 4b001bad-8f38-4fb0-a214-9fee137a9253 | Antitussígenos          | 2026-03-03 19:28:40.311 | 2026-03-03 19:28:40.311 |
 c4be4a90-70e1-4021-8b82-9a50df1e8581 | Broncodilatadores       | 2026-03-03 19:29:03.845 | 2026-03-03 19:29:03.845 |
 c6fde89c-2aca-4e20-8b1a-3c74b8fff6a6 | Vitaminas               | 2026-03-03 19:29:20.69  | 2026-03-03 19:29:20.69  |
 83a511d7-13ff-4073-a4b2-07150235ceb3 | Corticoides             | 2026-03-03 19:29:30.384 | 2026-03-03 19:29:30.384 |
 b41f714d-75fd-40d1-9c4d-4b1928eba2cf | Descongestionantes      | 2026-03-03 19:29:40.735 | 2026-03-03 19:29:40.735 |
 68526fa9-e466-47ae-bed8-68280af36d4c | Estimulantes do apetite | 2026-03-03 19:29:55.593 | 2026-03-03 19:29:55.593 |
 300a27f8-056f-4859-a9f3-b3ea7c88af4d | Expectorantes           | 2026-03-03 19:30:05.823 | 2026-03-03 19:30:05.823 |
 97741643-4323-4636-af76-b33d4b7f1ec2 | Fitoterápicos           | 2026-03-03 19:30:15.2   | 2026-03-03 19:30:15.2   |
 3b72361d-6ca4-43e2-aa6e-3024ff63e5b3 | Hepatoprotetores        | 2026-03-03 19:30:26.066 | 2026-03-03 19:30:26.066 |
 249850b2-0461-4aeb-90f1-054e8566257d | Homeopáticos            | 2026-03-03 19:30:34.621 | 2026-03-03 19:30:34.621 |
 9e43dc51-2f68-4bff-a6b0-b589375058e8 | Hormonais               | 2026-03-03 19:30:42.497 | 2026-03-03 19:30:42.497 |
 679a4e4b-db74-4f77-a03d-9b86bb4fe32e | Inibidores do apetite   | 2026-03-03 19:30:54.4   | 2026-03-03 19:30:54.4   |
 472e89cb-62ea-4bcf-9cd4-c4f28f921a2e | Laxantes                | 2026-03-03 19:31:06.415 | 2026-03-03 19:31:06.415 |
 e297998f-5d51-4664-aad7-e7a55cd452be | Suplementos             | 2026-03-03 19:31:27.43  | 2026-03-03 19:31:27.43  |
 747bb19c-3706-4cc0-bc46-b6c17f70020b | Relaxantes musculares   | 2026-03-03 19:31:35.95  | 2026-03-03 19:31:35.95  |
 26becb0a-42bb-4418-aa41-a5cb324f8770 | Soluções oftálmicas     | 2026-03-03 19:31:49.255 | 2026-03-03 19:31:49.255 |
 bdc1dd6f-aaf6-4feb-9e8f-cb60af8e31e7 | Vasoconstritores        | 2026-03-03 19:31:56.793 | 2026-03-03 19:31:56.793 |
 b9475bf0-c2c7-41b1-91ac-e77f1a047b82 | Vasodilatadores         | 2026-03-03 19:32:04.51  | 2026-03-03 19:32:04.51  |
 dcf3b215-172b-46c6-b3a9-4279cf34eba5 | Antieméticos            | 2026-03-03 19:33:28.787 | 2026-03-03 19:33:28.787 |
 9bde1328-72ff-4b59-a690-5eff6e3c3e07 | Xaropes                 | 2026-03-03 19:48:28.311 | 2026-03-03 19:48:28.311 |
 e6ca75e6-18ab-4614-aaeb-5906ccd0ad83 | Cápsulas para inalação  | 2026-03-03 19:49:43.34  | 2026-03-03 19:49:43.34  |
 bb5f27a6-f826-4d67-91d8-3a21a5e6847c | Glicocorticóides        | 2026-03-03 19:53:18.938 | 2026-03-03 19:53:18.938 |
 0780025a-0a4d-4a1c-84db-b74cbc93c7ce | Broncodilatadores       | 2026-03-03 19:54:47.768 | 2026-03-03 19:54:47.768 |
 ff74b99e-2206-4a51-8b3d-23f1599bfbb1 | Mucolíticos             | 2026-03-03 19:54:59.138 | 2026-03-03 19:54:59.138 |
 0ba15d97-dfde-40bf-9f33-39cbbbcadc0c | Expectorantes           | 2026-03-03 19:55:55.475 | 2026-03-03 19:55:55.475 |
 3af71bb8-b378-477a-94df-df9f34941fc1 | Antagonista de H2       | 2026-03-04 16:58:41.513 | 2026-03-04 16:58:41.513 |
 a0358c48-d6d9-4b2a-8cbc-6519604f31f5 | Antidiabéicos           | 2026-03-04 17:09:33.342 | 2026-03-04 17:09:33.342 |
(46 rows)

formas farmacêuticas
                  id                  |              name               |       created_at        |       updated_at
--------------------------------------+---------------------------------+-------------------------+-------------------------
 dc7dc604-f420-4e62-9e31-6449427718c3 | Creme                           | 2026-03-02 13:44:57.613 | 2026-03-02 13:44:57.613
 07b0819b-a02a-43cd-b471-959b6a85a977 | Comprimido                      | 2026-03-02 13:44:57.614 | 2026-03-02 13:44:57.614
 fcebbb50-a211-4477-ad3a-4c953c7838e5 | Cápsula                         | 2026-03-02 13:44:57.615 | 2026-03-02 13:44:57.615
 6ee034db-dfeb-456f-852e-5625c32af527 | Adesivo                         | 2026-03-03 19:33:55.254 | 2026-03-03 19:33:55.256
 420e0045-f4e1-46a5-9501-92808965ce4f | Cápsula dura                    | 2026-03-03 19:34:13.893 | 2026-03-03 19:34:13.896
 238c0aae-a7ac-4756-aa75-d0ec660119d8 | Cápsula de liberação prolongada | 2026-03-03 19:34:26.769 | 2026-03-03 19:34:26.771
 ed232484-a474-4704-9d58-393049178cd5 | Cápsula de liberação retardada  | 2026-03-03 19:34:37.182 | 2026-03-03 19:34:37.184
 f4133d4b-3bb5-4293-b779-9159a07b0d02 | Cápsula mole                    | 2026-03-03 19:34:43.626 | 2026-03-03 19:34:43.628
 dd265385-fd08-4423-8b42-0bccd9ba478c | Comprimido efervescente         | 2026-03-03 19:35:07.37  | 2026-03-03 19:35:07.372
3-03 19:35:16.938 | 2026-03-03 19:35:16.94mprimido mastigável           | 2026-0--More--
3-03 19:35:35.401 | 2026-03-03 19:35:35.404primido orodisspersível      | 2026-0--More--
3-03 19:35:53.615 | 2026-03-03 19:35:53.617utório                       | 2026-0--More--
3-03 19:36:20.132 | 2026-03-03 19:36:20.136me                           | 2026-0--More--
3-03 19:36:28.633 | 2026-03-03 19:36:28.635a de mascar                  | 2026-0--More--
3-03 19:36:35.522 | 2026-03-03 19:36:35.525nulado                       | 2026-0--More--
3-03 19:37:00.399 | 2026-03-03 19:37:00.402tilha                        | 2026-0--More--
3-03 19:37:15.55  | 2026-03-03 19:37:15.553                             | 2026-0--More--
3-03 19:37:29.271 | 2026-03-03 19:37:29.273efervescente                 | 2026-0--More--
3-03 19:37:55.516 | 2026-03-03 19:37:55.518para solução                 | 2026-0--More--
3-03 19:38:14.577 | 2026-03-03 19:38:14.59 para suspensão               | 2026-0--More--
3-03 19:38:32.534 | 2026-03-03 19:38:32.536onete                        | 2026-0--More--
3-03 19:38:43.215 | 2026-03-03 19:38:43.217ositório                     | 2026-0--More--
3-03 19:38:53.491 | 2026-03-03 19:38:53.493ução oral                    | 2026-0--More--
3-03 19:39:00.83  | 2026-03-03 19:39:00.833pensão oral                  | 2026-0--More--
3-03 19:39:10.893 | 2026-03-03 19:39:10.895lo                           | 2026-0--More--
3-03 19:39:16.617 | 2026-03-03 19:39:16.619me vaginal                   | 2026-0--More--
3-03 19:39:27.479 | 2026-03-03 19:39:27.481ope                          | 2026-0--More--
3-03 19:39:35.077 | 2026-03-03 19:39:35.079lete                         | 2026-0--More--
3-03 19:39:51.117 | 2026-03-03 19:39:51.12l                             | 2026-0--More--
3-03 19:39:55.573 | 2026-03-03 19:39:55.575ada                          | 2026-0--More--
3-03 19:40:03.441 | 2026-03-03 19:40:03.443lsão                         | 2026-0--More--
3-03 19:40:44.107 | 2026-03-03 19:40:44.11lução gotas                   | 2026-0--More--
3-03 19:51:44.577 | 2026-03-03 19:51:44.58mprimidos                     | 2026-0--More--
3-04 17:23:09.904 | 2026-03-04 17:23:09.906ay                           | 2026-0--More--
3-04 17:36:08.659 | 2026-03-04 17:36:08.661sula inalatória              | 2026-0--More--
(35 rows)

unidades de medidas
                  id                  | acronym |          name           |       created_at        |       updated_at
--------------------------------------+---------+-------------------------+-------------------------+-------------------------
 f80ea37a-4733-4bf4-b3a4-30735fe68fc3 | mg      | miligrama               | 2026-03-02 13:44:57.611 | 2026-03-02 13:44:57.611
 8ac4f18a-93a1-41d9-b64c-fec57857ad4d | mg/ml   | miligrama por mililitro | 2026-03-02 13:44:57.612 | 2026-03-02 13:44:57.612
 eb12d765-abc4-453c-b197-1c0df5648eae | g       | gramas                  | 2026-03-03 19:41:38.783 | 2026-03-03 19:41:38.787
 734d0bb0-e2ab-4559-9d76-f1577ea0cf29 | mcg     | microgramas             | 2026-03-03 19:41:56.099 | 2026-03-03 19:41:56.102
 4f97cf09-c107-45c4-88d9-6df366b0a4b1 | gts     | gotas                   | 2026-03-03 19:45:02.581 | 2026-03-03 19:45:02.585
 56571b31-de20-4b57-bee9-ffec5a2f8941 | g/g     | gramas por grama        | 2026-03-04 17:16:49.777 | 2026-03-04 17:16:49.781
 69002815-7315-4dd0-9fbe-98a8db4ddf04 | mg/g    | miligramas por grama    | 2026-03-04 17:22:16.94  | 2026-03-04 17:22:16.943
 aa711a52-7599-43d2-b72d-b78fa0169b13 | UI      | unidades internacionais | 2026-03-04 17:34:38.981 | 2026-03-04 17:34:38.984
(8 rows)

tipos de movimentação

                  id                  |       name        | direction |       created_at        |       updated_at
--------------------------------------+-------------------+-----------+-------------------------+-------------------------
 ec25471c-f9a6-4c04-958f-0190acf83c34 | DOAÇÃO            | ENTRY     | 2026-03-02 13:44:57.617 | 2026-03-02 13:44:57.617
 bc5031e9-25f3-4e6d-ba15-1500b77adab6 | PERDA/ROUBO/FURTO | EXIT      | 2026-03-02 13:44:57.617 | 2026-03-02 13:44:57.617
 a62ac206-22a9-41bb-a074-fd9366dd6201 | AJUSTE DE ESTOQUE | EXIT      | 2026-03-03 19:45:46.189 | 2026-03-03 19:45:46.191
 b0b31541-8b42-4abf-9cd3-9e687235af4e | DOAÇÃO EXTERNA    | EXIT      | 2026-03-03 19:46:05.303 | 2026-03-03 19:46:05.305
 bcebc538-d1a7-4b51-b113-fd82e28b27c2 | VENCIMENTO        | EXIT      | 2026-03-03 19:46:20.084 | 2026-03-03 19:46:20.086
(5 rows)

medicines

                  id                  |         name         |    description     |       created_at        |       updated_at
--------------------------------------+----------------------+--------------------+-------------------------+-------------------------
 423de87b-04f0-425e-9e0e-5f46e78440fc | BROMOPRIDA           | GOTAS              | 2026-03-03 19:47:24.024 | 2026-03-03 19:47:24.027
 3bbd0da0-8cb5-4f15-91a8-e87a26d0caef | BUSONID CAPS         | CÁPSULA INALATÓRIA | 2026-03-03 19:49:58.312 | 2026-03-04 16:56:51.337
 b13e6bdb-40f5-474f-b967-94ee75c9be0f | FAMOX                | COMPRIMIDO         | 2026-03-04 16:58:56.844 | 2026-03-04 17:00:25.278
 0626eae9-3e49-45fc-a327-f05adf8fdb0a | COLPÍSTATIN          | CREME VAGINAL      | 2026-03-04 16:57:44.809 | 2026-03-04 17:07:09.144
 c03c19d0-125a-4312-8f38-c1e1487632ec | FLAGASS              | GOTAS              | 2026-03-04 17:00:03.012 | 2026-03-04 17:07:20.61
 cdb179c3-7721-4917-96cd-25cd3a37c348 | ACETILCISTEINA       | XAROPE             | 2026-03-04 17:08:04.772 | 2026-03-04 17:08:04.775
 d03bdc98-cf93-41af-921e-c0fe88ab94bf | DIPIRONA             | SOLUÇÃO ORAL       | 2026-03-04 17:08:31.697 | 2026-03-04 17:08:31.7
 5b218419-772b-438d-8956-72af35ff1417 | MERITOR              | COMPRIMIDO         | 2026-03-04 17:09:52.133 | 2026-03-04 17:09:52.135
 19e79126-29e9-456e-8900-d155673f1217 | ACHEFLAN             | AEROSSOL           | 2026-03-04 17:11:15.088 | 2026-03-04 17:11:15.09
  | 2026-03-04 17:11:51.872 | 2026-03-04 17:11:51.874        | CREME            --More--
  | 2026-03-04 17:12:15.192 | 2026-03-04 17:12:15.196        | COMPRIMIDO       --More--
  | 2026-03-04 17:12:47.76  | 2026-03-04 17:12:47.763        | CREME VAGINAL    --More--
  | 2026-03-04 17:13:17.889 | 2026-03-04 17:13:17.891        | COMPRIMIDO       --More--
  | 2026-03-03 18:23:53.358 | 2026-03-04 17:29:24.66ULTO     | XAROPE           --More--
  | 2026-03-04 17:28:58.974 | 2026-03-04 18:13:14.014IATRICO | XAROPE           --More--
  | 2026-03-04 17:07:03.301 | 2026-03-04 18:13:47.977RICO    | XAROPE           --More--
(16 rows)

                 id                  |             medicine_id              |         dosage         |        pharmaceutical_form_id        |           unit_measure_id            |       created_at        |       updated_at        |                               complement
--------------------------------------+--------------------------------------+------------------------+--------------------------------------+--------------------------------------+-------------------------+-------------------------+------------------------------------------------------------------------
 58208d7e-7baf-407a-a03b-e73ce32366ce | 423de87b-04f0-425e-9e0e-5f46e78440fc | 4                      | 5c392ec2-0840-42b9-8cb7-a1847e4af8e4 | 8ac4f18a-93a1-41d9-b64c-fec57857ad4d | 2026-03-03 20:04:03.597 | 2026-03-03 20:04:03.599 | Frasco 20ml
 1d9eb07b-02a3-49a6-8b81-19ac0a11cab1 | 81ba3adc-13fd-4c1f-b885-097a54ff688e | 0,02                   | cae8e934-38cb-426a-b0f0-a04a10471f17 | 56571b31-de20-4b57-bee9-ffec5a2f8941 | 2026-03-04 17:17:38.221 | 2026-03-04 17:18:29.064 | Nitrato de Fenticonazol Bisnaga 40g
 1373627d-2125-4a40-9f29-6c6f56424065 | 47ceecaa-31eb-49f2-ae7c-46a898532e14 | 60                     | 4f84b12f-dd4a-419b-9a4e-301480f5ee25 | f80ea37a-4733-4bf4-b3a4-30735fe68fc3 | 2026-03-04 17:14:59.811 | 2026-03-04 17:18:45.326 | Loxoprofeno sódico 30 comprimidos
 4d91be30-c52d-4734-8680-fa9af8ad2d76 | 8682dffb-c96b-48b7-9874-7da499621563 | 50/5                   | 2345eb7b-bc30-48ff-a8fa-a9e1f197f716 |filina Frasco 120ml-b64c-fec57857ad4d | 2026-03-03 19:15:02.758 | 2026-03-04 17:19:30.984 | Acebro--More--
tasona 10 comprimidos 2026-03-04 17:21:34.427 | 2026-03-04 17:21:34.43  | Dexame--More--
nazol + Betametasona bisnaga 10g 17:22:38.732 | 2026-03-04 17:22:38.735 | Cetoco--More--
 Verbenecae Frasco 75ml026-03-04 17:23:45.618 | 2026-03-04 17:23:45.62  | Cordia--More--
irida + Metformina 30 comprimidos17:25:20.886 | 2026-03-04 17:25:20.888 | Glimep--More--
na Frasco 100mldf04 | 2026-03-04 17:25:54.327 | 2026-03-04 17:25:54.329 | Dipiro--More--
cisteina 120ml7ad4d | 2026-03-04 17:27:09.638 | 2026-03-04 17:27:09.64  | Acetil--More--
pizina Frasco 120ml | 2026-03-04 17:28:08.629 | 2026-03-04 17:28:08.631 | Dropro--More--
cona Frasco 10mld4d | 2026-03-04 17:31:06.93  | 2026-03-04 17:31:06.933 | Simeti--More--
dina    0735fe68fc3 | 2026-03-04 17:32:13.899 | 2026-03-04 17:32:13.901 | Famoti--More--
nida 200mcg 60 cápsulas + inalador7:37:43.261 | 2026-03-04 17:37:43.264 | Budeso--More--
nida 400mcg 60 cápsulas refil-04 17:38:24.998 | 2026-03-04 17:38:25.001 | Budeso--More--
etronidazol 65,5mg/g + Nistatina 25.000UI + 1,25mg,g Bisnaga 40g:57.504 | Benzom--More--
(16 rows)

operadores

                 id                  |         name         |               email               |    role     |       created_at        |                        password_hash                         |       updated_at        | active
--------------------------------------+----------------------+-----------------------------------+-------------+-------------------------+--------------------------------------------------------------+-------------------------+--------
 04c3887a-48d4-4135-a23f-58353b55b2b7 | Instituto Flora Vida | administracao@floravida.org.br    | MANAGER     | 2026-03-02 13:44:56.911 | $2a$08$YiEsWKOu.mZwXzo2wWJgGOSc1zyon1K73pyaIA9IXvi24mmPen1sK | 2026-03-02 13:44:56.911 | t
 2fe6defa-c92e-45bc-b2e7-25a044cdd008 | Master               | sandyeleconsultorafarma@gmail.com | SUPER_ADMIN | 2026-03-02 13:44:56.889 | $2a$08$RO0nJiVNWZMsj73NS.w.yeP8uEVhuVV1Bm8GcmzIs5LgwYtP1oZwu | 2026-03-02 13:47:33.418 | t
 fc0b6c62-0ecb-4813-9b86-d997fa385028 | Farmacia UBS         | farmaciaubs@gmail.com             | COMMON      | 2026-03-02 13:44:56.933 | $2a$08$gADYXedGcu/C7AVkGQQSMOOGSGj5wQiFanbDO5mVaRTDKPRPVSPgm | 2026-03-03 18:13:55.84  | t
 5c16c0da-a168-4e14-b64a-a97b0d6688b6 | Rykelme Veras        | rykelme@estagiofloravida.com      | COMMON      | 2026-03-03 18:12:45.273 | $2a$08$3KcKRNY8aqlzepCcXtK1teM8VfPFTw1OMusMG0lPkHpAYMLBhLC62 | 2026-03-03 18:15:35.335 | t
(4 rows)

(END)

instituições

                  id                  |        name         |      cnpj      | description |       created_at        |       updated_at        | control_stock | responsible |  type
--------------------------------------+---------------------+----------------+-------------+-------------------------+-------------------------+---------------+-------------+--------
 7d2e63b4-0da6-4bd0-8ea7-c89c42ea766d | UBS Módulo-32       | 00000000000000 |             | 2026-03-03 17:18:05.511 | 2026-03-03 17:18:05.519 | t             | UBS         | PUBLIC
 ad0926d0-cc60-4a05-a44b-1fefb49ad8fe | Instituto Floravida | 01234567000189 |             | 2026-03-02 13:44:56.854 | 2026-03-03 18:16:36.409 | t             | Sandyele    | ONG
(2 rows)

estoques

                  id                  |       name       | status |       created_at        |       updated_at        |            institution_id
--------------------------------------+------------------+--------+-------------------------+-------------------------+--------------------------------------
 2279f65d-93d9-45f4-9022-5f828932204c | Estoque Sala     | t      | 2026-03-02 13:44:56.936 | 2026-03-03 18:09:39.801 | ad0926d0-cc60-4a05-a44b-1fefb49ad8fe
 2b633cb3-6dad-44e4-b2b1-910031ae9dff | Estoque Farmácia | t      | 2026-03-03 18:07:58.104 | 2026-03-03 18:09:52.817 | 7d2e63b4-0da6-4bd0-8ea7-c89c42ea766d
(2 rows)
*/

import { hash } from 'bcryptjs';
import { InstitutionType, OperatorRole, PrismaClient } from './generated';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing database...');
  await prisma.transfer.deleteMany();
  await prisma.address.deleteMany();
  await prisma.movimentation.deleteMany();
  await prisma.useMedicine.deleteMany();
  await prisma.exit.deleteMany();
  await prisma.dispensation.deleteMany();
  await prisma.medicineEntry.deleteMany();
  await prisma.batcheStock.deleteMany();
  await prisma.medicineStock.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.medicineVariant.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.therapeuticClass.deleteMany();
  await prisma.pharmaceuticalForm.deleteMany();
  await prisma.unitMeasure.deleteMany();
  await prisma.pathology.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.stockSettings.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.movementType.deleteMany();
  await prisma.patient.deleteMany();
  console.log('Database cleared!');
}

async function seedPathologiesFromCSV() {
  const csvPath = path.resolve(__dirname, '../../prisma/CSV/tabela-cid.csv');
  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  let batch: { code: string; name: string }[] = [];
  const BATCH_SIZE = 500;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const cols = line.split(';');
    const code = cols[0]?.trim();
    const name = cols[4]?.trim();

    if (!code || !name) continue;

    batch.push({ code, name });

    if (batch.length >= BATCH_SIZE) {
      await prisma.pathology.createMany({ data: batch, skipDuplicates: true });
      batch = [];
    }
  }

  if (batch.length > 0) {
    await prisma.pathology.createMany({ data: batch, skipDuplicates: true });
  }

  console.log('Pathologies seeded from CSV.');
}

async function main() {
  await clearDatabase();

  console.log('Seeding institutions...');
  const institutionFloraVida = await prisma.institution.create({
    data: {
      name: 'Instituto Floravida',
      cnpj: '01234567000189',
      controlStock: true,
      responsible: 'Sandyele',
      type: InstitutionType.ONG,
      description: '',
    },
  });

  const institutionUBS = await prisma.institution.create({
    data: {
      name: 'UBS Módulo-32',
      cnpj: '00000000000000',
      controlStock: true,
      responsible: 'UBS',
      type: InstitutionType.PUBLIC,
      description: '',
    },
  });

  console.log('Seeding operators...');
  await prisma.operator.create({
    data: {
      name: 'Master',
      email: 'sandyeleconsultorafarma@gmail.com',
      passwordHash: await hash('Master2026!', 8),
      role: OperatorRole.SUPER_ADMIN,
      active: true,
      institutions: {
        connect: [{ id: institutionFloraVida.id }],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Instituto Flora Vida',
      email: 'administracao@floravida.org.br',
      passwordHash: await hash('FloraVida2026!', 8),
      role: OperatorRole.MANAGER,
      active: true,
      institutions: {
        connect: [{ id: institutionFloraVida.id }],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Farmacia UBS',
      email: 'farmaciaubs@gmail.com',
      passwordHash: await hash('FarmaciaUBS2026!', 8),
      role: OperatorRole.COMMON,
      active: true,
      institutions: {
        connect: [{ id: institutionUBS.id }],
      },
    },
  });

  await prisma.operator.create({
    data: {
      name: 'Rykelme Veras',
      email: 'rykelme@estagiofloravida.com',
      passwordHash: await hash('Rykelme2026!', 8),
      role: OperatorRole.COMMON,
      active: true,
      institutions: {
        connect: [{ id: institutionFloraVida.id }],
      },
    },
  });

  console.log('Seeding stocks...');
  await prisma.stock.create({
    data: {
      name: 'Estoque Sala',
      status: true,
      institutionId: institutionFloraVida.id,
    },
  });

  await prisma.stock.create({
    data: {
      name: 'Estoque Farmácia',
      status: true,
      institutionId: institutionUBS.id,
    },
  });

  console.log('Seeding unit measures...');
  await prisma.unitMeasure.createMany({
    data: [
      { acronym: 'mg', name: 'miligrama' },
      { acronym: 'mg/ml', name: 'miligrama por mililitro' },
      { acronym: 'g', name: 'gramas' },
      { acronym: 'mcg', name: 'microgramas' },
      { acronym: 'gts', name: 'gotas' },
      { acronym: 'g/g', name: 'gramas por grama' },
      { acronym: 'mg/g', name: 'miligramas por grama' },
      { acronym: 'UI', name: 'unidades internacionais' },
    ],
  });

  console.log('Seeding pharmaceutical forms...');
  await prisma.pharmaceuticalForm.createMany({
    data: [
      { name: 'Creme' },
      { name: 'Comprimido' },
      { name: 'Cápsula' },
      { name: 'Adesivo' },
      { name: 'Cápsula dura' },
      { name: 'Cápsula de liberação prolongada' },
      { name: 'Cápsula de liberação retardada' },
      { name: 'Cápsula mole' },
      { name: 'Comprimido efervescente' },
      { name: 'Comprimido mastigável' },
      { name: 'Comprimido orodisspersível' },
      { name: 'Elixir' },
      { name: 'Emulsão' },
      { name: 'Goma de mascar' },
      { name: 'Granulado' },
      { name: 'Pastilha' },
      { name: 'Pó' },
      { name: 'Pó efervescente' },
      { name: 'Pó para solução' },
      { name: 'Pó para suspensão' },
      { name: 'Sabonete' },
      { name: 'Supositório' },
      { name: 'Solução oral' },
      { name: 'Suspensão oral' },
      { name: 'Gel' },
      { name: 'Creme vaginal' },
      { name: 'Xarope' },
      { name: 'Aerossol' },
      { name: 'Pomada' },
      { name: 'Solução gotas' },
      { name: 'Comprimidos' },
      { name: 'Spray' },
      { name: 'Cápsula inalatória' },
    ],
  });

  console.log('Seeding therapeutic classes...');
  await prisma.therapeuticClass.createMany({
    data: [
      { name: 'Analgésicos' },
      { name: 'Anti-inflamatórios' },
      { name: 'Antibióticos' },
      { name: 'Antivirais' },
      { name: 'Anti-hipertensivos' },
      { name: 'Hipoglicemiantes' },
      { name: 'Anticoagulantes' },
      { name: 'Ansiolíticos' },
      { name: 'Antidepressivos' },
      { name: 'Antialérgicos' },
      { name: 'Antifúngicos' },
      { name: 'Antigases' },
      { name: 'Antidiarréicos' },
      { name: 'Anticoncepcionais' },
      { name: 'Antigripais' },
      { name: 'Antimicóticos' },
      { name: 'Antimicrobianos' },
      { name: 'Antitérmicos' },
      { name: 'Antitussígenos' },
      { name: 'Broncodilatadores' },
      { name: 'Vitaminas' },
      { name: 'Corticoides' },
      { name: 'Descongestionantes' },
      { name: 'Estimulantes do apetite' },
      { name: 'Expectorantes' },
      { name: 'Fitoterápicos' },
      { name: 'Hepatoprotetores' },
      { name: 'Homeopáticos' },
      { name: 'Hormonais' },
      { name: 'Inibidores do apetite' },
      { name: 'Laxantes' },
      { name: 'Suplementos' },
      { name: 'Relaxantes musculares' },
      { name: 'Soluções oftálmicas' },
      { name: 'Vasoconstritores' },
      { name: 'Vasodilatadores' },
      { name: 'Antieméticos' },
      { name: 'Xaropes' },
      { name: 'Cápsulas para inalação' },
      { name: 'Glicocorticóides' },
      { name: 'Broncodilatadores' },
      { name: 'Mucolíticos' },
      { name: 'Expectorantes' },
      { name: 'Antagonista de H2' },
      { name: 'Antidiabéicos' },
    ],
  });

  console.log('Seeding movement types...');
  await prisma.movementType.createMany({
    data: [
      { name: 'DOAÇÃO', direction: 'ENTRY' },
      { name: 'PERDA/ROUBO/FURTO', direction: 'EXIT' },
      { name: 'AJUSTE DE ESTOQUE', direction: 'EXIT' },
      { name: 'DOAÇÃO EXTERNA', direction: 'EXIT' },
      { name: 'VENCIMENTO', direction: 'EXIT' },
    ],
  });

  console.log('Seeding pathologies from CSV...');
  await seedPathologiesFromCSV();

  console.log('Seeding medicines...');
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: { name: 'BROMOPRIDA', description: 'GOTAS' },
    }),
    prisma.medicine.create({
      data: { name: 'BUSONID CAPS', description: 'CÁPSULA INALATÓRIA' },
    }),
    prisma.medicine.create({
      data: { name: 'FAMOX', description: 'COMPRIMIDO' },
    }),
    prisma.medicine.create({
      data: { name: 'COLPÍSTATIN', description: 'CREME VAGINAL' },
    }),
    prisma.medicine.create({
      data: { name: 'FLAGASS', description: 'GOTAS' },
    }),
    prisma.medicine.create({
      data: { name: 'ACETILCISTEINA', description: 'XAROPE' },
    }),
    prisma.medicine.create({
      data: { name: 'DIPIRONA', description: 'SOLUÇÃO ORAL' },
    }),
    prisma.medicine.create({
      data: { name: 'MERITOR', description: 'COMPRIMIDO' },
    }),
    prisma.medicine.create({
      data: { name: 'ACHEFLAN', description: 'AEROSSOL' },
    }),
    prisma.medicine.create({
      data: { name: 'FLOGORAL', description: 'CREME' },
    }),
    prisma.medicine.create({
      data: { name: 'CETOCONAZOL', description: 'COMPRIMIDO' },
    }),
    prisma.medicine.create({
      data: { name: 'MICOZEN', description: 'CREME VAGINAL' },
    }),
    prisma.medicine.create({
      data: { name: 'CEFALEXINA', description: 'COMPRIMIDO' },
    }),
    prisma.medicine.create({
      data: { name: 'XAROPE ADULTO', description: 'XAROPE' },
    }),
    prisma.medicine.create({
      data: { name: 'XAROPE PEDIÁTRICO', description: 'XAROPE' },
    }),
    prisma.medicine.create({
      data: { name: 'XAROPE GENÉRICO', description: 'XAROPE' },
    }),
  ]);

  console.log('Seeding medicine variants...');
  const unitMeasureMgMl = await prisma.unitMeasure.findFirst({
    where: { acronym: 'mg/ml' },
  });
  const unitMeasureGG = await prisma.unitMeasure.findFirst({
    where: { acronym: 'g/g' },
  });
  const unitMeasureMg = await prisma.unitMeasure.findFirst({
    where: { acronym: 'mg' },
  });
  const unitMeasureMgG = await prisma.unitMeasure.findFirst({
    where: { acronym: 'mg/g' },
  });
  const unitMeasureUI = await prisma.unitMeasure.findFirst({
    where: { acronym: 'UI' },
  });

  const formGotas = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Solução gotas' },
  });
  const formCreme = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Creme' },
  });
  const formComprimido = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Comprimido' },
  });
  const formCremeVaginal = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Creme vaginal' },
  });
  const formXarope = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Xarope' },
  });
  const formSolucaoOral = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Solução oral' },
  });
  const formAerossol = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Aerossol' },
  });
  const formSpray = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Spray' },
  });
  const formCapsulaInalatoria = await prisma.pharmaceuticalForm.findFirst({
    where: { name: 'Cápsula inalatória' },
  });

  const medicineBromoprida = medicines.find((m) => m.name === 'BROMOPRIDA');
  const medicineBusonid = medicines.find((m) => m.name === 'BUSONID CAPS');
  const medicineFamox = medicines.find((m) => m.name === 'FAMOX');
  const medicineColpistatin = medicines.find((m) => m.name === 'COLPÍSTATIN');
  const medicineFlagass = medicines.find((m) => m.name === 'FLAGASS');
  const medicineAcetilcisteina = medicines.find(
    (m) => m.name === 'ACETILCISTEINA',
  );
  const medicineDipirona = medicines.find((m) => m.name === 'DIPIRONA');
  const medicineMeritor = medicines.find((m) => m.name === 'MERITOR');
  const medicineAcheflan = medicines.find((m) => m.name === 'ACHEFLAN');
  const medicineFlogoral = medicines.find((m) => m.name === 'FLOGORAL');
  const medicineCetoconazol = medicines.find((m) => m.name === 'CETOCONAZOL');
  const medicineMicozen = medicines.find((m) => m.name === 'MICOZEN');
  const medicineCefalexina = medicines.find((m) => m.name === 'CEFALEXINA');
  const medicineXaropeAdulto = medicines.find(
    (m) => m.name === 'XAROPE ADULTO',
  );
  const medicineXaropePediatrico = medicines.find(
    (m) => m.name === 'XAROPE PEDIÁTRICO',
  );
  const medicineXaropeGenerico = medicines.find(
    (m) => m.name === 'XAROPE GENÉRICO',
  );

  if (medicineBromoprida && formGotas && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineBromoprida.id,
        dosage: '4',
        pharmaceuticalFormId: formGotas.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Frasco 20ml',
      },
    });
  }

  if (medicineFlogoral && formCreme && unitMeasureGG) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineFlogoral.id,
        dosage: '0,02',
        pharmaceuticalFormId: formCreme.id,
        unitMeasureId: unitMeasureGG.id,
        complement: 'Nitrato de Fenticonazol Bisnaga 40g',
      },
    });
  }

  if (medicineAcheflan && formComprimido && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineAcheflan.id,
        dosage: '60',
        pharmaceuticalFormId: formComprimido.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Loxoprofeno sódico 30 comprimidos',
      },
    });
  }

  if (medicineXaropeAdulto && formXarope && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineXaropeAdulto.id,
        dosage: '50/5',
        pharmaceuticalFormId: formXarope.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Acebrofilina Frasco 120ml',
      },
    });
  }

  if (medicineCetoconazol && formComprimido && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineCetoconazol.id,
        dosage: '10',
        pharmaceuticalFormId: formComprimido.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Dexametasona 10 comprimidos',
      },
    });
  }

  if (medicineFlogoral && formCreme && unitMeasureMgG) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineFlogoral.id,
        dosage: '10/0,5',
        pharmaceuticalFormId: formCreme.id,
        unitMeasureId: unitMeasureMgG.id,
        complement: 'Cetoconazol + Betametasona bisnaga 10g',
      },
    });
  }

  if (medicineXaropePediatrico && formSpray && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineXaropePediatrico.id,
        dosage: '75',
        pharmaceuticalFormId: formSpray.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Cordia Verbenecae Frasco 75ml',
      },
    });
  }

  if (medicineMeritor && formComprimido && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineMeritor.id,
        dosage: '2/500',
        pharmaceuticalFormId: formComprimido.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Glimepirida + Metformina 30 comprimidos',
      },
    });
  }

  if (medicineDipirona && formSolucaoOral && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineDipirona.id,
        dosage: '500',
        pharmaceuticalFormId: formSolucaoOral.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Dipirona Frasco 100ml',
      },
    });
  }

  if (medicineAcetilcisteina && formXarope && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineAcetilcisteina.id,
        dosage: '120',
        pharmaceuticalFormId: formXarope.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Acetilcisteina 120ml',
      },
    });
  }

  if (medicineXaropeGenerico && formXarope && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineXaropeGenerico.id,
        dosage: '120',
        pharmaceuticalFormId: formXarope.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Dropropizina Frasco 120ml',
      },
    });
  }

  if (medicineFlagass && formGotas && unitMeasureMgMl) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineFlagass.id,
        dosage: '10',
        pharmaceuticalFormId: formGotas.id,
        unitMeasureId: unitMeasureMgMl.id,
        complement: 'Simeticona Frasco 10ml',
      },
    });
  }

  if (medicineFamox && formComprimido && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineFamox.id,
        dosage: '40',
        pharmaceuticalFormId: formComprimido.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Famotidina',
      },
    });
  }

  if (medicineBusonid && formCapsulaInalatoria && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineBusonid.id,
        dosage: '200',
        pharmaceuticalFormId: formCapsulaInalatoria.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Budesonida 200mcg 60 cápsulas + inalador',
      },
    });
  }

  if (medicineBusonid && formCapsulaInalatoria && unitMeasureMg) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineBusonid.id,
        dosage: '400',
        pharmaceuticalFormId: formCapsulaInalatoria.id,
        unitMeasureId: unitMeasureMg.id,
        complement: 'Budesonida 400mcg 60 cápsulas refil',
      },
    });
  }

  if (
    medicineColpistatin &&
    formCremeVaginal &&
    unitMeasureMgG &&
    unitMeasureUI
  ) {
    await prisma.medicineVariant.create({
      data: {
        medicineId: medicineColpistatin.id,
        dosage: '65,5/25.000/1,25',
        pharmaceuticalFormId: formCremeVaginal.id,
        unitMeasureId: unitMeasureMgG.id,
        complement:
          'Benzometronidazol 65,5mg/g + Nistatina 25.000UI + 1,25mg/g Bisnaga 40g',
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
