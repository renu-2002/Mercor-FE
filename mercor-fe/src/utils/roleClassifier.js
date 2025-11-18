// roleClassifier.js

import { scoreCandidatePerRole } from "./scoring";

export function classifyCandidates(candidates) {
    const buckets = {
        backend: [],
        frontend: [],
        fullstack: [],
        data: [],
        devops: [],
        product: [],
        general: []
    };

    candidates.forEach(candidate => {
        if (!candidate.email) return;

        // Get role scores using the new linear weights
        const roleScores = scoreCandidatePerRole(candidate);

        // Pick highest scoring role
        let bestRole = "general";
        let bestScore = -1;

        for (let role in roleScores) {
            if (roleScores[role] > bestScore) {
                bestRole = role;
                bestScore = roleScores[role];
            }
        }

        buckets[bestRole].push({ ...candidate, score: bestScore });
    });

    // Sort each bucket by score desc
    for (let role in buckets) {
        buckets[role].sort((a, b) => b.score - a.score);
    }

    return buckets;
}


// ------------------------------------------------------
// PICK TOP 5 — one from each role (backend → product)
// ------------------------------------------------------
export function pickTopFive(buckets) {
    const final = [];
    const used = new Set();

    // Order of priority roles
    const priority = [
        "backend",
        "frontend",
        "fullstack",
        "data",
        "devops",
        "product"
    ];

    // Pick 1 from each role bucket
    for (let role of priority) {
        for (let c of buckets[role]) {
            if (!used.has(c.email)) {
                used.add(c.email);
                final.push({ ...c, role });
                break;
            }
        }
        if (final.length >= 5) return final;
    }

    // Fill remaining slots from general
    for (let c of buckets.general) {
        if (!used.has(c.email)) {
            final.push({ ...c, role: "general" });
            used.add(c.email);
        }
        if (final.length === 5) break;
    }

    return final;
}
