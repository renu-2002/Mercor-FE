import React, { useState } from "react";
import CandidateTable from "./CandidateTable";
import { classifyCandidates, pickTopFive } from "./utils/roleClassifier";
import { setGlobalMaxSalary } from "./utils/scoring";

export default function App() {
    const [rawCandidates, setRawCandidates] = useState([]);
    const [finalFive, setFinalFive] = useState([]);
    const [error, setError] = useState("");

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);

                if (!Array.isArray(parsed)) {
                    setError("Invalid file: Expected an array of candidates.");
                    return;
                }

                setError("");
                setRawCandidates(parsed);

                // --------------------------------------------------------
                // STEP 0 — Set max salary BEFORE any scoring happens
                // --------------------------------------------------------
                setGlobalMaxSalary(parsed);

                // --------------------------------------------------------
                // STEP 1 — Classify candidates into best-fit roles
                // --------------------------------------------------------
                const buckets = classifyCandidates(parsed);

                // --------------------------------------------------------
                // STEP 2 — Select top 5 candidates (1 per major role)
                // --------------------------------------------------------
                const selected = pickTopFive(buckets);

                setFinalFive(selected);

            } catch (err) {
                setError("Invalid JSON file format.");
            }
        };

        reader.readAsText(file);
    };

    return (
        <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
            <h2>100B Jobs — Candidate Selection Dashboard</h2>
            <p>
                Upload <strong>form-submissions.json</strong> to begin evaluating and selecting the best candidates.
            </p>

            <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ marginBottom: 20 }}
            />

            {error && (
                <div style={{ color: "red", marginTop: 10 }}>
                    {error}
                </div>
            )}

            {rawCandidates.length > 0 && (
                <p style={{ marginTop: 20 }}>
                    Loaded <strong>{rawCandidates.length}</strong> candidate records.
                </p>
            )}

            <CandidateTable finalFive={finalFive} />
        </div>
    );
}
