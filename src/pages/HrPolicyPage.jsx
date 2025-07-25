import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Star, BadgePercent, Shield } from "lucide-react";

// This data represents the policy and is kept separate for easy updates.
const incrementPolicyData = [
  { rating: 5, level: "Outstanding", percentage: "15.0%" },
  { rating: 4, level: "Exceeds Expectations", percentage: "10.0%" },
  { rating: 3, level: "Meets Expectations", percentage: "5.0%" },
  { rating: 2, level: "Needs Improvement", percentage: "3.0%" },
  { rating: 1, level: "Unsatisfactory", percentage: "1.0%" },
  { rating: 0, level: "No Rating", percentage: "0.0%" },
];

const PolicyPage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="mr-3 h-8 w-8 text-primary" />
          Company Increment Policy
        </h1>
        <p className="text-muted-foreground">
          Our policy for calculating annual salary increments is based on performance and tenure.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Eligibility Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To be eligible for an annual increment, an employee must have completed a minimum of <strong className="text-primary">180 days of service</strong> with the company. Employees with less than 180 days of service are not eligible for the increment cycle.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Performance Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The increment percentage is directly tied to the employee's performance, which is measured by their <strong className="text-primary">average completion rating</strong> from all completed tasks. The final average is rounded to the nearest whole number to determine the performance level.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgePercent className="mr-2 h-5 w-5" />
            Increment Percentage Table
          </CardTitle>
          <CardDescription>
            The following table outlines the increment percentage awarded for each performance level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Average Rating (Rounded)</TableHead>
                <TableHead>Performance Level</TableHead>
                <TableHead className="text-right">Increment Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incrementPolicyData.map((item) => (
                <TableRow key={item.rating}>
                  <TableCell className="font-medium flex items-center">
                    {item.rating} <Star className="ml-1 h-4 w-4 text-amber-400" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.level}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{item.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyPage;