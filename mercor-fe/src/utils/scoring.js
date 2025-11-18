// scoring.js

// ==========================================================
//  LINEAR SKILL WEIGHTS FOR ALL ROLES (14 → 1)
// ==========================================================
export const SKILL_MAPS = {
    backend: {
        "python": 14, "java": 13, "node": 12, "go": 11,
        "django": 10, "flask": 9, "rest": 8, "graphql": 7,
        "microservices": 6, "postgres": 5, "mysql": 4,
        "mongodb": 3, "docker": 2, "kubernetes": 1
    },

    frontend: {
        "react": 14, "next": 13,
        "javascript": 12, "typescript": 11,
        "vue": 10, "angular": 9,
        "redux": 8, "html": 7, "css": 6,
        "tailwind": 5, "jest": 4, "cypress": 3,
        "webpack": 2, "storybook": 1
    },

    fullstack: {
        "react": 14, "node": 13,
        "javascript": 12, "python": 11, "java": 10,
        "next": 9, "django": 8, "rest": 7,
        "mongodb": 6, "postgres": 5,
        "docker": 4, "graphql": 3,
        "html": 2, "css": 1
    },

    data: {
        "tensorflow": 14, "pytorch": 13,
        "machine learning": 12, "deep learning": 11,
        "pandas": 10, "numpy": 9,
        "python": 8, "statistics": 7, "sql": 6,
        "analysis": 5, "data": 4,
        "matlab": 3, "spss": 2, "excel": 1
    },

    devops: {
        "kubernetes": 14, "terraform": 13,
        "aws": 12, "docker": 11,
        "jenkins": 10, "ci": 9, "cd": 8,
        "helm": 7, "linux": 6,
        "prometheus": 5, "grafana": 4,
        "ansible": 3, "bash": 2, "gitlab": 1
    },

    product: {
        "product": 14, "roadmap": 13,
        "strategy": 12, "project": 11,
        "agile": 10, "scrum": 9,
        "management": 8, "leadership": 7,
        "stakeholder": 6, "communication": 5,
        "ux": 4, "numbers": 3,
        "documentation": 2, "excel": 1
    }
};


// ==========================================================
//  DYNAMIC SALARY NORMALIZATION STORAGE
// ==========================================================
export let MAX_SALARY = 0;

// Compute the highest salary from dataset
export function setGlobalMaxSalary(candidates) {
    let max = 0;

    candidates.forEach(c => {
        const sal = c.annual_salary_expectation?.["full-time"];
        if (sal) {
            const num = Number(sal.replace(/\D/g, ""));
            if (!isNaN(num)) max = Math.max(max, num);
        }
    });

    MAX_SALARY = max;
}



// ==========================================================
//  SKILL SCORING BASED ON ROLE MAP
// ==========================================================
export function scoreBySkills(candidateSkills, roleMap) {
    let score = 0;

    candidateSkills.forEach(skill => {
        const s = skill.toLowerCase();
        for (let key in roleMap) {
            if (s.includes(key)) {
                score += roleMap[key];
            }
        }
    });

    return score;
}



// ==========================================================
//  EXPERIENCE, EDUCATION, SALARY BONUS
// ==========================================================
export function addCommonBonuses(candidate, score) {
    let updated = score;

    // Experience bonus (4 pts per job)
    updated += (candidate.work_experiences?.length || 0) * 4;

    // Education bonus
    const degrees = candidate.education?.degrees || [];
    degrees.forEach((d) => {
        if (d.isTop50) updated += 6;
        if (d.isTop25) updated += 4;
    });

    // Salary bonus (dynamic normalization: lower salary = better)
    const sal = candidate.annual_salary_expectation?.["full-time"];
    if (sal && MAX_SALARY > 0) {
        const num = Number(sal.replace(/\D/g, ""));
        if (!isNaN(num)) {
            const diff = MAX_SALARY - num;
            updated += Math.max(0, diff) / 10000;
        }
    }

    return Math.floor(updated);
}



// ==========================================================
//  MAIN ROLE SCORING FUNCTION
// ==========================================================
export function scoreCandidatePerRole(candidate) {
    const skills = candidate.skills || [];
    let roleScores = {};

    for (let role of Object.keys(SKILL_MAPS)) {
        const skillScore = scoreBySkills(skills, SKILL_MAPS[role]);
        const totalScore = addCommonBonuses(candidate, skillScore);
        roleScores[role] = totalScore;
    }

    return roleScores;
}
