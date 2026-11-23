# Auto Campus — Dummy Test Data

Copy values from these tables into the admin forms to exercise the app. IDs (`section_id`, `vehicle_id`, `class_id`) are chosen in the UI by label after you create the matching records.

**Shared teacher password:** `TestPass123`  
**Academic year for fees:** `2025-26`

**Counts in this file:** 10 vehicles · 14 tuition rows · 12 support staff · 1 principal · 28 teachers · 105 students

## Entry order

1. **Vehicles** (Admin → Vehicles) — so students can be assigned transport  
2. **Tuition fee structures** (Admin → Fees) — one tuition amount per class  
3. **Support staff / principal** (Admin → Support staff)  
4. **Teachers** (Admin → Teachers) — creates login accounts  
5. **Students** (Admin → Students) — pick section + optional vehicle by name  
6. **Generate fees** (Fees → Generate) — academic year `2025-26`, any month/year/due date  

Notes:

- Transport fees live on **vehicles**, not on fee structures.  
- Create at least one **section** per class you will use (e.g. Class 5 — Section A) under Classes if it does not exist yet.  
- Suggested sections below assume labels like `5 — A` (class name — section name).  
- Create sections used by students first: Nursery A; Prep A/B; classes 1–8 A/B; 9–12 A.

---

## 1. Vehicles (transport across Pakistan)

| Name | Registration | Capacity | Monthly fee (PKR) | Active |
| ---- | ------------ | --------:| -----------------:| ------ |
| Karachi Route — Clifton | KHI-2024-1101 | 40 | 4500 | yes |
| Lahore Route — DHA | LHR-2023-2202 | 35 | 4200 | yes |
| Islamabad Route — F-10 | ISB-2024-3303 | 30 | 5000 | yes |
| Rawalpindi Route — Saddar | RWP-2022-4404 | 32 | 3800 | yes |
| Faisalabad Route — Madina Town | FSD-2023-5505 | 36 | 3500 | yes |
| Multan Route — Gulgasht | MUL-2024-6606 | 28 | 3200 | yes |
| Peshawar Route — University Town | PEW-2023-7707 | 34 | 3600 | yes |
| Quetta Route — Jinnah Town | QTA-2022-8808 | 26 | 4000 | yes |
| Hyderabad Route — Latifabad | HYD-2024-9909 | 30 | 3100 | yes |
| Sialkot Route — Cantt | SKT-2023-1010 | 28 | 3400 | yes |

---

## 2. Tuition fee structures

Use **type: tuition** only. Academic year: `2025-26`. Pick the class by name in the form.

| Class | Amount (PKR / month) |
| ----- | -------------------: |
| Nursery | 4000 |
| Prep | 4500 |
| 1 | 5000 |
| 2 | 5500 |
| 3 | 6000 |
| 4 | 6500 |
| 5 | 7000 |
| 6 | 7500 |
| 7 | 8000 |
| 8 | 8500 |
| 9 | 9000 |
| 10 | 9500 |
| 11 | 10000 |
| 12 | 10500 |

---

## 3. Support staff

| Full name | Phone | Designation | Salary (PKR) |
| --------- | ----- | ----------- | -----------: |
| Ghulam Abbas | 0300-1112233 | Security Guard | 22000 |
| Parveen Bibi | 0301-1112234 | Cleaner | 23500 |
| Imran Shah | 0302-1112235 | Peon | 25000 |
| Naila Riaz | 0303-1112236 | Lab Assistant | 26500 |
| Tariq Mehmood | 0304-1112237 | Bus Helper | 28000 |
| Shabbir Hussain | 0305-1112238 | Clerk | 29500 |
| Asma Bibi | 0306-1112239 | Accountant | 31000 |
| Rashid Ali | 0307-1112240 | Librarian | 32500 |
| Naeem Akhtar | 0308-1112241 | Electrician | 34000 |
| Bushra Kanwal | 0309-1112242 | Gardener | 35500 |
| Waqar Younis | 03010-1112243 | Receptionist | 37000 |
| Sajid Hussain | 03011-1112244 | Store Keeper | 38500 |

### Principal

| Full name | Phone | Email | Qualification | Salary (PKR) |
| --------- | ----- | ----- | ------------- | -----------: |
| Dr. Saima Qureshi | 0305-6667788 | principal@school.test | PhD Education | 120000 |

---

## 4. Teachers

Password for all: `TestPass123` (28 teachers)

| Full name | Email | Password | Employee ID | Phone | Qualification | Salary (PKR) |
| --------- | ----- | -------- | ----------- | ----- | ------------- | -----------: |
| Ayesha Khan | ayesha.khan@school.test | TestPass123 | T-1001 | 0311-1001001 | M.Ed Mathematics | 55000 |
| Bilal Zahra | bilal.zahra@school.test | TestPass123 | T-1002 | 0311-1001002 | M.A English | 56500 |
| Fatima Malik | fatima.malik@school.test | TestPass123 | T-1003 | 0311-1001003 | M.Sc Physics | 58000 |
| Hassan Noor | hassan.noor@school.test | TestPass123 | T-1004 | 0311-1001004 | M.Sc Chemistry | 59500 |
| Iqra Hussain | iqra.hussain@school.test | TestPass123 | T-1005 | 0311-1001005 | B.Ed Primary | 61000 |
| Junaid Qureshi | junaid.qureshi@school.test | TestPass123 | T-1006 | 0311-1001006 | M.A Urdu | 62500 |
| Komal Ansari | komal.ansari@school.test | TestPass123 | T-1007 | 0311-1001007 | M.Sc Biology | 64000 |
| Usman Javed | usman.javed@school.test | TestPass123 | T-1008 | 0311-1001008 | M.Ed Computer Science | 65500 |
| Saba Farooq | saba.farooq@school.test | TestPass123 | T-1009 | 0311-1001009 | M.A Islamiyat | 67000 |
| Nida Shah | nida.shah@school.test | TestPass123 | T-1010 | 0311-1001010 | M.Sc Statistics | 68500 |
| Zeeshan Akhtar | zeeshan.akhtar@school.test | TestPass123 | T-1011 | 0311-1001011 | B.Ed Early Years | 55000 |
| Rabia Chaudhry | rabia.chaudhry@school.test | TestPass123 | T-1012 | 0311-1001012 | M.Phil Education | 56500 |
| Adnan Gill | adnan.gill@school.test | TestPass123 | T-1013 | 0311-1001013 | M.A History | 58000 |
| Saima Khan | saima.khan@school.test | TestPass123 | T-1014 | 0311-1001014 | M.Sc Geography | 59500 |
| Faisal Zahra | faisal.zahra@school.test | TestPass123 | T-1015 | 0311-1001015 | M.Ed Special Education | 61000 |
| Hina Malik | hina.malik@school.test | TestPass123 | T-1016 | 0311-1001016 | M.Ed Mathematics | 62500 |
| Kamran Noor | kamran.noor@school.test | TestPass123 | T-1017 | 0311-1001017 | M.A English | 64000 |
| Mehwish Hussain | mehwish.hussain@school.test | TestPass123 | T-1018 | 0311-1001018 | M.Sc Physics | 65500 |
| Owais Qureshi | owais.qureshi@school.test | TestPass123 | T-1019 | 0311-1001019 | M.Sc Chemistry | 67000 |
| Pervez Ansari | pervez.ansari@school.test | TestPass123 | T-1020 | 0311-1001020 | B.Ed Primary | 68500 |
| Qurat Javed | qurat.javed@school.test | TestPass123 | T-1021 | 0311-1001021 | M.A Urdu | 55000 |
| Rizwan Farooq | rizwan.farooq@school.test | TestPass123 | T-1022 | 0311-1001022 | M.Sc Biology | 56500 |
| Sadia Shah | sadia.shah@school.test | TestPass123 | T-1023 | 0311-1001023 | M.Ed Computer Science | 58000 |
| Talha Akhtar | talha.akhtar@school.test | TestPass123 | T-1024 | 0311-1001024 | M.A Islamiyat | 59500 |
| Uzma Chaudhry | uzma.chaudhry@school.test | TestPass123 | T-1025 | 0311-1001025 | M.Sc Statistics | 61000 |
| Waqas Gill | waqas.gill@school.test | TestPass123 | T-1026 | 0311-1001026 | B.Ed Early Years | 62500 |
| Yasir Khan | yasir.khan@school.test | TestPass123 | T-1027 | 0311-1001027 | M.Phil Education | 64000 |
| Zubair Zahra | zubair.zahra@school.test | TestPass123 | T-1028 | 0311-1001028 | M.A History | 65500 |

After creating teachers, assign them to sections/subjects under **Classes → Manage section** if you need tests, exams, or head-teacher flows.

---

## 5. Students

Status: `active` for all (105 students).  
**Section** and **Transport vehicle** columns are UI labels to select (not pasted IDs). Create sections first if missing.

| Full name | Email | Roll | Father | Mother | DOB | Gender | Address | Phone | Section (class — section) | Transport vehicle |
| --------- | ----- | ---- | ------ | ------ | --- | ------ | ------- | ----- | ------------------------- | ----------------- |
| Ahmed Ahmed | ahmed.ahmed001@student.test | 1A-01 | Muhammad Ahmed | Sana Ahmed | 2013-01-01 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001000 | 1 — A | None |
| Ali Malik | ali.malik002@student.test | 2A-02 | Imran Malik | Nadia Malik | 2012-02-02 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001001 | 2 — A | Lahore Route — DHA |
| Hassan Iqbal | hassan.iqbal003@student.test | 3A-03 | Asif Iqbal | Rabia Iqbal | 2011-03-03 | Male | 45-C Model Town, Lahore | 0322-7001002 | 3 — A | Islamabad Route — F-10 |
| Omar Qureshi | omar.qureshi004@student.test | 4A-04 | Naveed Qureshi | Mehwish Qureshi | 2010-04-04 | Female | 18 Canal Road, Lahore | 0322-7001003 | 4 — A | None |
| Usman Mehmood | usman.mehmood005@student.test | 5A-05 | Shahid Mehmood | Farah Mehmood | 2009-05-05 | Male | House 9, F-10/2, Islamabad | 051-7001004 | 5 — A | Faisalabad Route — Madina Town |
| Bilal Javed | bilal.javed006@student.test | 6A-06 | Farooq Javed | Amina Javed | 2008-06-06 | Female | Street 15, G-9/4, Islamabad | 051-7001005 | 6 — A | Multan Route — Gulgasht |
| Hamza Rashid | hamza.rashid007@student.test | 7A-07 | Iqbal Rashid | Shazia Rashid | 2007-07-07 | Male | 22 Saddar Road, Rawalpindi | 051-7001006 | 7 — A | None |
| Saad Ali | saad.ali008@student.test | 8A-08 | Raza Ali | Saba Ali | 2006-08-08 | Female | Satellite Town, Rawalpindi | 051-7001007 | 8 — A | Quetta Route — Jinnah Town |
| Zain Shah | zain.shah009@student.test | 1B-09 | Abdul Shah | Lubna Shah | 2013-09-09 | Male | Madina Town Block C, Faisalabad | 041-7001008 | 1 — B | Hyderabad Route — Latifabad |
| Rayyan Butt | rayyan.butt010@student.test | 2B-10 | Nadeem Butt | Yasmin Butt | 2012-10-10 | Female | Gulgasht Colony, Multan | 061-7001009 | 2 — B | None |
| Arham Siddiqui | arham.siddiqui011@student.test | 3B-11 | Javed Siddiqui | Hina Siddiqui | 2011-11-11 | Male | University Town, Peshawar | 091-7001010 | 3 — B | Karachi Route — Clifton |
| Daniyal Rehman | daniyal.rehman012@student.test | 4B-12 | Tariq Rehman | Rubina Rehman | 2010-12-12 | Female | Jinnah Town, Quetta | 081-7001011 | 4 — B | Lahore Route — DHA |
| Kashif Noor | kashif.noor013@student.test | 5B-13 | Saeed Noor | Fouzia Noor | 2009-01-13 | Male | Latifabad Unit 7, Hyderabad | 022-7001012 | 5 — B | None |
| Imran Khan | imran.khan014@student.test | 6B-14 | Khalid Khan | Samina Khan | 2008-02-14 | Female | Cantt Area, Sialkot | 052-7001013 | 6 — B | Rawalpindi Route — Saddar |
| Fahad Raza | fahad.raza015@student.test | 7B-15 | Waseem Raza | Uzma Raza | 2007-03-15 | Male | Peoples Colony, Faisalabad | 041-7001014 | 7 — B | Faisalabad Route — Madina Town |
| Noman Hussain | noman.hussain016@student.test | 8B-16 | Muhammad Hussain | Saima Hussain | 2006-04-16 | Female | Askari Housing, Lahore | 0322-7001015 | 8 — B | None |
| Taha Sheikh | taha.sheikh017@student.test | PrepA-17 | Imran Sheikh | Sana Sheikh | 2018-05-17 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001016 | Prep — A | Peshawar Route — University Town |
| Yousuf Ansari | yousuf.ansari018@student.test | PrepB-18 | Asif Ansari | Nadia Ansari | 2018-06-18 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001017 | Prep — B | Quetta Route — Jinnah Town |
| Sami Farooq | sami.farooq019@student.test | NurseryA-19 | Naveed Farooq | Rabia Farooq | 2019-07-19 | Male | 45-C Model Town, Lahore | 0322-7001018 | Nursery — A | None |
| Ayaan Tariq | ayaan.tariq020@student.test | 9A-20 | Shahid Tariq | Mehwish Tariq | 2005-08-20 | Female | 18 Canal Road, Lahore | 0322-7001019 | 9 — A | Sialkot Route — Cantt |
| Zainab Ahmed | zainab.ahmed021@student.test | 10A-01 | Farooq Ahmed | Farah Ahmed | 2004-09-21 | Male | House 9, F-10/2, Islamabad | 051-7001020 | 10 — A | Karachi Route — Clifton |
| Fatima Malik | fatima.malik022@student.test | 11A-02 | Iqbal Malik | Amina Malik | 2003-10-22 | Female | Street 15, G-9/4, Islamabad | 051-7001021 | 11 — A | None |
| Ayesha Iqbal | ayesha.iqbal023@student.test | 12A-03 | Raza Iqbal | Shazia Iqbal | 2002-11-23 | Male | 22 Saddar Road, Rawalpindi | 051-7001022 | 12 — A | Islamabad Route — F-10 |
| Hira Qureshi | hira.qureshi024@student.test | 1A-04 | Abdul Qureshi | Saba Qureshi | 2013-12-24 | Female | Satellite Town, Rawalpindi | 051-7001023 | 1 — A | Rawalpindi Route — Saddar |
| Maryam Mehmood | maryam.mehmood025@student.test | 2A-05 | Nadeem Mehmood | Lubna Mehmood | 2012-01-25 | Male | Madina Town Block C, Faisalabad | 041-7001024 | 2 — A | None |
| Areeba Javed | areeba.javed026@student.test | 3A-06 | Javed Javed | Yasmin Javed | 2011-02-26 | Female | Gulgasht Colony, Multan | 061-7001025 | 3 — A | Multan Route — Gulgasht |
| Esha Rashid | esha.rashid027@student.test | 4A-07 | Tariq Rashid | Hina Rashid | 2010-03-27 | Male | University Town, Peshawar | 091-7001026 | 4 — A | Peshawar Route — University Town |
| Laiba Ali | laiba.ali028@student.test | 5A-08 | Saeed Ali | Rubina Ali | 2009-04-01 | Female | Jinnah Town, Quetta | 081-7001027 | 5 — A | None |
| Minahil Shah | minahil.shah029@student.test | 6A-09 | Khalid Shah | Fouzia Shah | 2008-05-02 | Male | Latifabad Unit 7, Hyderabad | 022-7001028 | 6 — A | Hyderabad Route — Latifabad |
| Sana Butt | sana.butt030@student.test | 7A-10 | Waseem Butt | Samina Butt | 2007-06-03 | Female | Cantt Area, Sialkot | 052-7001029 | 7 — A | Sialkot Route — Cantt |
| Noor Siddiqui | noor.siddiqui031@student.test | 8A-11 | Muhammad Siddiqui | Uzma Siddiqui | 2006-07-04 | Male | Peoples Colony, Faisalabad | 041-7001030 | 8 — A | None |
| Iqra Rehman | iqra.rehman032@student.test | 1B-12 | Imran Rehman | Saima Rehman | 2013-08-05 | Female | Askari Housing, Lahore | 0322-7001031 | 1 — B | Lahore Route — DHA |
| Komal Noor | komal.noor033@student.test | 2B-13 | Asif Noor | Sana Noor | 2012-09-06 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001032 | 2 — B | Islamabad Route — F-10 |
| Nimra Khan | nimra.khan034@student.test | 3B-14 | Naveed Khan | Nadia Khan | 2011-10-07 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001033 | 3 — B | None |
| Mahnoor Raza | mahnoor.raza035@student.test | 4B-15 | Shahid Raza | Rabia Raza | 2010-11-08 | Male | 45-C Model Town, Lahore | 0322-7001034 | 4 — B | Faisalabad Route — Madina Town |
| Hafsa Hussain | hafsa.hussain036@student.test | 5B-16 | Farooq Hussain | Mehwish Hussain | 2009-12-09 | Female | 18 Canal Road, Lahore | 0322-7001035 | 5 — B | Multan Route — Gulgasht |
| Aiman Sheikh | aiman.sheikh037@student.test | 6B-17 | Iqbal Sheikh | Farah Sheikh | 2008-01-10 | Male | House 9, F-10/2, Islamabad | 051-7001036 | 6 — B | None |
| Rida Ansari | rida.ansari038@student.test | 7B-18 | Raza Ansari | Amina Ansari | 2007-02-11 | Female | Street 15, G-9/4, Islamabad | 051-7001037 | 7 — B | Quetta Route — Jinnah Town |
| Sundas Farooq | sundas.farooq039@student.test | 8B-19 | Abdul Farooq | Shazia Farooq | 2006-03-12 | Male | 22 Saddar Road, Rawalpindi | 051-7001038 | 8 — B | Hyderabad Route — Latifabad |
| Mariam Tariq | mariam.tariq040@student.test | PrepA-20 | Nadeem Tariq | Saba Tariq | 2018-04-13 | Female | Satellite Town, Rawalpindi | 051-7001039 | Prep — A | None |
| Ahmed Ahmed | ahmed.ahmed041@student.test | PrepB-01 | Javed Ahmed | Lubna Ahmed | 2018-05-14 | Male | Madina Town Block C, Faisalabad | 041-7001040 | Prep — B | Karachi Route — Clifton |
| Ali Malik | ali.malik042@student.test | NurseryA-02 | Tariq Malik | Yasmin Malik | 2019-06-15 | Female | Gulgasht Colony, Multan | 061-7001041 | Nursery — A | Lahore Route — DHA |
| Hassan Iqbal | hassan.iqbal043@student.test | 9A-03 | Saeed Iqbal | Hina Iqbal | 2005-07-16 | Male | University Town, Peshawar | 091-7001042 | 9 — A | None |
| Omar Qureshi | omar.qureshi044@student.test | 10A-04 | Khalid Qureshi | Rubina Qureshi | 2004-08-17 | Female | Jinnah Town, Quetta | 081-7001043 | 10 — A | Rawalpindi Route — Saddar |
| Usman Mehmood | usman.mehmood045@student.test | 11A-05 | Waseem Mehmood | Fouzia Mehmood | 2003-09-18 | Male | Latifabad Unit 7, Hyderabad | 022-7001044 | 11 — A | Faisalabad Route — Madina Town |
| Bilal Javed | bilal.javed046@student.test | 12A-06 | Muhammad Javed | Samina Javed | 2002-10-19 | Female | Cantt Area, Sialkot | 052-7001045 | 12 — A | None |
| Hamza Rashid | hamza.rashid047@student.test | 1A-07 | Imran Rashid | Uzma Rashid | 2013-11-20 | Male | Peoples Colony, Faisalabad | 041-7001046 | 1 — A | Peshawar Route — University Town |
| Saad Ali | saad.ali048@student.test | 2A-08 | Asif Ali | Saima Ali | 2012-12-21 | Female | Askari Housing, Lahore | 0322-7001047 | 2 — A | Quetta Route — Jinnah Town |
| Zain Shah | zain.shah049@student.test | 3A-09 | Naveed Shah | Sana Shah | 2011-01-22 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001048 | 3 — A | None |
| Rayyan Butt | rayyan.butt050@student.test | 4A-10 | Shahid Butt | Nadia Butt | 2010-02-23 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001049 | 4 — A | Sialkot Route — Cantt |
| Arham Siddiqui | arham.siddiqui051@student.test | 5A-11 | Farooq Siddiqui | Rabia Siddiqui | 2009-03-24 | Male | 45-C Model Town, Lahore | 0322-7001050 | 5 — A | Karachi Route — Clifton |
| Daniyal Rehman | daniyal.rehman052@student.test | 6A-12 | Iqbal Rehman | Mehwish Rehman | 2008-04-25 | Female | 18 Canal Road, Lahore | 0322-7001051 | 6 — A | None |
| Kashif Noor | kashif.noor053@student.test | 7A-13 | Raza Noor | Farah Noor | 2007-05-26 | Male | House 9, F-10/2, Islamabad | 051-7001052 | 7 — A | Islamabad Route — F-10 |
| Imran Khan | imran.khan054@student.test | 8A-14 | Abdul Khan | Amina Khan | 2006-06-27 | Female | Street 15, G-9/4, Islamabad | 051-7001053 | 8 — A | Rawalpindi Route — Saddar |
| Fahad Raza | fahad.raza055@student.test | 1B-15 | Nadeem Raza | Shazia Raza | 2013-07-01 | Male | 22 Saddar Road, Rawalpindi | 051-7001054 | 1 — B | None |
| Noman Hussain | noman.hussain056@student.test | 2B-16 | Javed Hussain | Saba Hussain | 2012-08-02 | Female | Satellite Town, Rawalpindi | 051-7001055 | 2 — B | Multan Route — Gulgasht |
| Taha Sheikh | taha.sheikh057@student.test | 3B-17 | Tariq Sheikh | Lubna Sheikh | 2011-09-03 | Male | Madina Town Block C, Faisalabad | 041-7001056 | 3 — B | Peshawar Route — University Town |
| Yousuf Ansari | yousuf.ansari058@student.test | 4B-18 | Saeed Ansari | Yasmin Ansari | 2010-10-04 | Female | Gulgasht Colony, Multan | 061-7001057 | 4 — B | None |
| Sami Farooq | sami.farooq059@student.test | 5B-19 | Khalid Farooq | Hina Farooq | 2009-11-05 | Male | University Town, Peshawar | 091-7001058 | 5 — B | Hyderabad Route — Latifabad |
| Ayaan Tariq | ayaan.tariq060@student.test | 6B-20 | Waseem Tariq | Rubina Tariq | 2008-12-06 | Female | Jinnah Town, Quetta | 081-7001059 | 6 — B | Sialkot Route — Cantt |
| Zainab Ahmed | zainab.ahmed061@student.test | 7B-01 | Muhammad Ahmed | Fouzia Ahmed | 2007-01-07 | Male | Latifabad Unit 7, Hyderabad | 022-7001060 | 7 — B | None |
| Fatima Malik | fatima.malik062@student.test | 8B-02 | Imran Malik | Samina Malik | 2006-02-08 | Female | Cantt Area, Sialkot | 052-7001061 | 8 — B | Lahore Route — DHA |
| Ayesha Iqbal | ayesha.iqbal063@student.test | PrepA-03 | Asif Iqbal | Uzma Iqbal | 2018-03-09 | Male | Peoples Colony, Faisalabad | 041-7001062 | Prep — A | Islamabad Route — F-10 |
| Hira Qureshi | hira.qureshi064@student.test | PrepB-04 | Naveed Qureshi | Saima Qureshi | 2018-04-10 | Female | Askari Housing, Lahore | 0322-7001063 | Prep — B | None |
| Maryam Mehmood | maryam.mehmood065@student.test | NurseryA-05 | Shahid Mehmood | Sana Mehmood | 2019-05-11 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001064 | Nursery — A | Faisalabad Route — Madina Town |
| Areeba Javed | areeba.javed066@student.test | 9A-06 | Farooq Javed | Nadia Javed | 2005-06-12 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001065 | 9 — A | Multan Route — Gulgasht |
| Esha Rashid | esha.rashid067@student.test | 10A-07 | Iqbal Rashid | Rabia Rashid | 2004-07-13 | Male | 45-C Model Town, Lahore | 0322-7001066 | 10 — A | None |
| Laiba Ali | laiba.ali068@student.test | 11A-08 | Raza Ali | Mehwish Ali | 2003-08-14 | Female | 18 Canal Road, Lahore | 0322-7001067 | 11 — A | Quetta Route — Jinnah Town |
| Minahil Shah | minahil.shah069@student.test | 12A-09 | Abdul Shah | Farah Shah | 2002-09-15 | Male | House 9, F-10/2, Islamabad | 051-7001068 | 12 — A | Hyderabad Route — Latifabad |
| Sana Butt | sana.butt070@student.test | 1A-10 | Nadeem Butt | Amina Butt | 2013-10-16 | Female | Street 15, G-9/4, Islamabad | 051-7001069 | 1 — A | None |
| Noor Siddiqui | noor.siddiqui071@student.test | 2A-11 | Javed Siddiqui | Shazia Siddiqui | 2012-11-17 | Male | 22 Saddar Road, Rawalpindi | 051-7001070 | 2 — A | Karachi Route — Clifton |
| Iqra Rehman | iqra.rehman072@student.test | 3A-12 | Tariq Rehman | Saba Rehman | 2011-12-18 | Female | Satellite Town, Rawalpindi | 051-7001071 | 3 — A | Lahore Route — DHA |
| Komal Noor | komal.noor073@student.test | 4A-13 | Saeed Noor | Lubna Noor | 2010-01-19 | Male | Madina Town Block C, Faisalabad | 041-7001072 | 4 — A | None |
| Nimra Khan | nimra.khan074@student.test | 5A-14 | Khalid Khan | Yasmin Khan | 2009-02-20 | Female | Gulgasht Colony, Multan | 061-7001073 | 5 — A | Rawalpindi Route — Saddar |
| Mahnoor Raza | mahnoor.raza075@student.test | 6A-15 | Waseem Raza | Hina Raza | 2008-03-21 | Male | University Town, Peshawar | 091-7001074 | 6 — A | Faisalabad Route — Madina Town |
| Hafsa Hussain | hafsa.hussain076@student.test | 7A-16 | Muhammad Hussain | Rubina Hussain | 2007-04-22 | Female | Jinnah Town, Quetta | 081-7001075 | 7 — A | None |
| Aiman Sheikh | aiman.sheikh077@student.test | 8A-17 | Imran Sheikh | Fouzia Sheikh | 2006-05-23 | Male | Latifabad Unit 7, Hyderabad | 022-7001076 | 8 — A | Peshawar Route — University Town |
| Rida Ansari | rida.ansari078@student.test | 1B-18 | Asif Ansari | Samina Ansari | 2013-06-24 | Female | Cantt Area, Sialkot | 052-7001077 | 1 — B | Quetta Route — Jinnah Town |
| Sundas Farooq | sundas.farooq079@student.test | 2B-19 | Naveed Farooq | Uzma Farooq | 2012-07-25 | Male | Peoples Colony, Faisalabad | 041-7001078 | 2 — B | None |
| Mariam Tariq | mariam.tariq080@student.test | 3B-20 | Shahid Tariq | Saima Tariq | 2011-08-26 | Female | Askari Housing, Lahore | 0322-7001079 | 3 — B | Sialkot Route — Cantt |
| Ahmed Ahmed | ahmed.ahmed081@student.test | 4B-01 | Farooq Ahmed | Sana Ahmed | 2010-09-27 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001080 | 4 — B | Karachi Route — Clifton |
| Ali Malik | ali.malik082@student.test | 5B-02 | Iqbal Malik | Nadia Malik | 2009-10-01 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001081 | 5 — B | None |
| Hassan Iqbal | hassan.iqbal083@student.test | 6B-03 | Raza Iqbal | Rabia Iqbal | 2008-11-02 | Male | 45-C Model Town, Lahore | 0322-7001082 | 6 — B | Islamabad Route — F-10 |
| Omar Qureshi | omar.qureshi084@student.test | 7B-04 | Abdul Qureshi | Mehwish Qureshi | 2007-12-03 | Female | 18 Canal Road, Lahore | 0322-7001083 | 7 — B | Rawalpindi Route — Saddar |
| Usman Mehmood | usman.mehmood085@student.test | 8B-05 | Nadeem Mehmood | Farah Mehmood | 2006-01-04 | Male | House 9, F-10/2, Islamabad | 051-7001084 | 8 — B | None |
| Bilal Javed | bilal.javed086@student.test | PrepA-06 | Javed Javed | Amina Javed | 2018-02-05 | Female | Street 15, G-9/4, Islamabad | 051-7001085 | Prep — A | Multan Route — Gulgasht |
| Hamza Rashid | hamza.rashid087@student.test | PrepB-07 | Tariq Rashid | Shazia Rashid | 2018-03-06 | Male | 22 Saddar Road, Rawalpindi | 051-7001086 | Prep — B | Peshawar Route — University Town |
| Saad Ali | saad.ali088@student.test | NurseryA-08 | Saeed Ali | Saba Ali | 2019-04-07 | Female | Satellite Town, Rawalpindi | 051-7001087 | Nursery — A | None |
| Zain Shah | zain.shah089@student.test | 9A-09 | Khalid Shah | Lubna Shah | 2005-05-08 | Male | Madina Town Block C, Faisalabad | 041-7001088 | 9 — A | Hyderabad Route — Latifabad |
| Rayyan Butt | rayyan.butt090@student.test | 10A-10 | Waseem Butt | Yasmin Butt | 2004-06-09 | Female | Gulgasht Colony, Multan | 061-7001089 | 10 — A | Sialkot Route — Cantt |
| Arham Siddiqui | arham.siddiqui091@student.test | 11A-11 | Muhammad Siddiqui | Hina Siddiqui | 2003-07-10 | Male | University Town, Peshawar | 091-7001090 | 11 — A | None |
| Daniyal Rehman | daniyal.rehman092@student.test | 12A-12 | Imran Rehman | Rubina Rehman | 2002-08-11 | Female | Jinnah Town, Quetta | 081-7001091 | 12 — A | Lahore Route — DHA |
| Kashif Noor | kashif.noor093@student.test | 1A-13 | Asif Noor | Fouzia Noor | 2013-09-12 | Male | Latifabad Unit 7, Hyderabad | 022-7001092 | 1 — A | Islamabad Route — F-10 |
| Imran Khan | imran.khan094@student.test | 2A-14 | Naveed Khan | Samina Khan | 2012-10-13 | Female | Cantt Area, Sialkot | 052-7001093 | 2 — A | None |
| Fahad Raza | fahad.raza095@student.test | 3A-15 | Shahid Raza | Uzma Raza | 2011-11-14 | Male | Peoples Colony, Faisalabad | 041-7001094 | 3 — A | Faisalabad Route — Madina Town |
| Noman Hussain | noman.hussain096@student.test | 4A-16 | Farooq Hussain | Saima Hussain | 2010-12-15 | Female | Askari Housing, Lahore | 0322-7001095 | 4 — A | Multan Route — Gulgasht |
| Taha Sheikh | taha.sheikh097@student.test | 5A-17 | Iqbal Sheikh | Sana Sheikh | 2009-01-16 | Male | House 12, Street 4, Gulshan-e-Iqbal, Karachi | 0321-7001096 | 5 — A | None |
| Yousuf Ansari | yousuf.ansari098@student.test | 6A-18 | Raza Ansari | Nadia Ansari | 2008-02-17 | Female | Flat 3B, Block 7, Clifton, Karachi | 0321-7001097 | 6 — A | Quetta Route — Jinnah Town |
| Sami Farooq | sami.farooq099@student.test | 7A-19 | Abdul Farooq | Rabia Farooq | 2007-03-18 | Male | 45-C Model Town, Lahore | 0322-7001098 | 7 — A | Hyderabad Route — Latifabad |
| Ayaan Tariq | ayaan.tariq100@student.test | 8A-20 | Nadeem Tariq | Mehwish Tariq | 2006-04-19 | Female | 18 Canal Road, Lahore | 0322-7001099 | 8 — A | None |
| Zainab Ahmed | zainab.ahmed101@student.test | 1B-01 | Javed Ahmed | Farah Ahmed | 2013-05-20 | Male | House 9, F-10/2, Islamabad | 051-7001100 | 1 — B | Karachi Route — Clifton |
| Fatima Malik | fatima.malik102@student.test | 2B-02 | Tariq Malik | Amina Malik | 2012-06-21 | Female | Street 15, G-9/4, Islamabad | 051-7001101 | 2 — B | Lahore Route — DHA |
| Ayesha Iqbal | ayesha.iqbal103@student.test | 3B-03 | Saeed Iqbal | Shazia Iqbal | 2011-07-22 | Male | 22 Saddar Road, Rawalpindi | 051-7001102 | 3 — B | None |
| Hira Qureshi | hira.qureshi104@student.test | 4B-04 | Khalid Qureshi | Saba Qureshi | 2010-08-23 | Female | Satellite Town, Rawalpindi | 051-7001103 | 4 — B | Rawalpindi Route — Saddar |
| Maryam Mehmood | maryam.mehmood105@student.test | 5B-05 | Waseem Mehmood | Lubna Mehmood | 2009-09-24 | Male | Madina Town Block C, Faisalabad | 041-7001104 | 5 — B | Faisalabad Route — Madina Town |

---

## 6. After students exist

1. Open **Fees → Generate**.  
2. Academic year: `2025-26`.  
3. Choose month / year / due date.  
4. Confirm fee collection shows **tuition** lines plus **transport (Vehicle name)** for students with a vehicle.

Optional login checks:

- Teacher: `ayesha.khan@school.test` / `TestPass123`  
- (Admin uses your existing admin account.)
