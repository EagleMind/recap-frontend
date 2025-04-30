export type Recap = {
    _id: string;
    title: string;
    description?: string;
    assignedTo: string;
    createdBy: string;
    team: { _id: string; name: string } | string;
    createdAt: string;
    updatedAt?: string;
    date: string; // Grouping date (YYYY-MM-DD)
};