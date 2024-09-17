import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VolunteerHistory = () => {
  // Mock data for demonstration purposes
  const [volunteerHistory, setVolunteerHistory] = useState([
    {
      id: 1,
      eventName: 'Dog Walking Day',
      eventDescription: 'A day dedicated to walking shelter dogs',
      location: 'Central Park',
      requiredSkills: ['Dog walking', 'Pet care'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '09:00',
      endTime: '17:00',
      participationStatus: 'Completed'
    },
    {
      id: 2,
      eventName: 'Shelter Clean-up',
      eventDescription: 'Deep cleaning of the animal shelter',
      location: 'City Animal Shelter',
      requiredSkills: ['Cleaning', 'Organizing'],
      urgency: 'High',
      eventDate: '2024-11-01',
      startTime: '08:00',
      endTime: '16:00',
      participationStatus: 'Signed Up'
    },
    // Add more mock data as needed
  ]);

  return (
    <div className="volunteer-history">
      <h2 className="text-2xl font-bold mb-4">Volunteer Participation History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Required Skills</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteerHistory.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.eventName}</TableCell>
              <TableCell>{event.eventDescription}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.requiredSkills.join(', ')}</TableCell>
              <TableCell>{event.urgency}</TableCell>
              <TableCell>{event.eventDate}</TableCell>
              <TableCell>{event.startTime}</TableCell>
              <TableCell>{event.endTime}</TableCell>
              <TableCell>{event.participationStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VolunteerHistory;