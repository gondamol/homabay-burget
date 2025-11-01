import React from 'react';
import type { ProjectIdea, OfficialProject } from '../types';
import { DocumentChartBarIcon } from './icons';

const convertToCSV = (data: any[], headers: string[]): string => {
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const key = header.toLowerCase().replace(/\s/g, ''); // Simple key conversion
            const escaped = ('' + row[key]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};

const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const DataExport: React.FC<{ projectIdeas: ProjectIdea[], officialProjects: OfficialProject[] }> = ({ projectIdeas, officialProjects }) => {
    const exportIdeas = () => {
        const headers = ['ID', 'Title', 'Description', 'Location', 'SubCounty', 'Ward', 'Category', 'Votes', 'Status'];
        const data = projectIdeas.map(idea => ({
            id: idea.id,
            title: idea.title,
            description: idea.description.replace(/\n/g, ' '),
            location: idea.location,
            subcounty: idea.subCounty,
            ward: idea.ward,
            category: idea.category,
            votes: idea.votes,
            status: idea.status
        }));
        const csvString = convertToCSV(data, headers);
        downloadCSV(csvString, 'project_ideas.csv');
    };

    const exportProjects = () => {
        const headers = ['ID', 'Name', 'Description', 'Location', 'SubCounty', 'Ward', 'Budget', 'Status', 'Start Date', 'End Date'];
        const data = officialProjects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description.replace(/\n/g, ' '),
            location: project.location,
            subcounty: project.subCounty || 'N/A',
            ward: project.ward || 'N/A',
            budget: project.budget,
            status: project.status,
            startdate: project.timeline.start,
            enddate: project.timeline.end
        }));
        const csvString = convertToCSV(data, headers);
        downloadCSV(csvString, 'official_projects.csv');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <DocumentChartBarIcon className="h-6 w-6 mr-2 text-green-700"/>
                Data Management
            </h2>
            <div className="flex flex-wrap gap-4">
                <button onClick={exportIdeas} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Export Ideas (CSV)</button>
                <button onClick={exportProjects} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Export Projects (CSV)</button>
            </div>
        </div>
    );
};
