import React from "react";

export default function CandidateTable({ finalFive = [] }) {
    return (
        <div style={{ padding: 20 }}>
            <h3>Final 5 Selected Candidates</h3>

            {finalFive.length === 0 ? (
                <p>No candidates selected yet.</p>
            ) : (
                <table
                    border="1"
                    cellPadding="8"
                    style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}
                >
                    <thead style={{ background: "#f0f0f0" }}>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Skills</th>
                        <th>Experience Count</th>
                        <th>Salary</th>
                        <th>Role</th>
                    </tr>
                    </thead>

                    <tbody>
                    {finalFive.map((c) => (
                        <tr key={c.email}>
                            <td>{c.name || "Unknown"}</td>
                            <td>{c.email}</td>
                            <td>{c.skills?.join(", ")}</td>
                            <td>{c.work_experiences?.length}</td>
                            <td>{c.annual_salary_expectation?.["full-time"]}</td>
                            <td style={{ fontWeight: "bold" }}>
                                {c.role?.toUpperCase()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
