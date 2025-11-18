---

# 100B Jobs — Candidate Selection Dashboard

This application processes thousands of job applicants and automatically selects the **top 5 candidates**, ensuring strong **role-based fit**, **balanced skills**, and **team diversity**.

The system evaluates every candidate across six roles:

* **Backend**
* **Frontend**
* **Fullstack**
* **Data / ML**
* **DevOps**
* **Product**

Each candidate is scored for every role using a **linear 14 → 1 weighted skill scoring system**, and then assigned to the role where they score the highest.

---

## How Candidate Scoring Works

Each candidate receives a score for **each role**.
The final score is calculated using **four components**, weighted to match what real companies value most.

### **1️⃣ Skill Weightage (≈ 70% impact)**

Each role has a list of skills ranked from **14 → 1**, where:

* **14** = most important skill for that role
* **1** = least important but still relevant

Example (Backend weights):

```
python = 14
java = 13
node = 12
go = 11
django = 10
flask = 9
rest = 8
graphql = 7
microservices = 6
postgres = 5
mysql = 4
mongodb = 3
docker = 2
kubernetes = 1
```

This ensures fair, predictable scoring across all roles.

---

### **2️⃣ Experience Bonus (≈ 20% impact)**

Each work experience entry adds:

```
+4 points per job
```

More experience → higher score.

---

### **3️⃣ Education Bonus (≈ 5–8% impact)**

Top universities add extra points:

* Top 50 → +6 points
* Top 25 → +4 additional points

---

Dynamic Salary Normalization (≈ 2–5%)

Instead of hardcoding a salary ceiling, the app dynamically finds the highest expected salary in the dataset and uses it for normalization.

bonus = (MAX_SALARY_IN_DATASET − candidateSalary) / 10000

---

## Final Score Formula

```
TotalScore(role) = SkillScore(role) + ExperienceBonus + EducationBonus + SalaryBonus
```

The role with the **highest score** becomes the candidate’s **best-fit role**.

---

## How the Final 5 Candidates Are Selected

1. Every candidate is classified into the role where they score highest.
2. Each role bucket is sorted by score.
3. The system selects one top candidate from each role:

    * 1 Backend
    * 1 Frontend
    * 1 Fullstack
    * 1 Data / ML
    * 1 DevOps
4. Duplicate emails are not allowed.
5. If a role has no strong candidates, a fallback **general** bucket is used.

This ensures the final output is a **balanced 5-person team**, each representing a different role.

---

## 🗂 Project Structure

```
src/
│
├── App.js                # File upload + end-to-end candidate selection
├── utils/
│   ├── scoring.js            # Role-based linear 14→1 scoring logic
│   ├── roleClassifier.js
├── CandidateTable.js     # Displays final selected candidates
```

---

## 🛠 Running the Project

```
npm install
npm start
```

Upload `form-submissions.json` in the app to see results.

---
