import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Calendar, TrendingUp, GraduationCap } from 'lucide-react';

export function TopVisitors() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Course data for charts - removed hours field
  const monthlyCourseData = [
    { name: 'Computer Science', visits: 145 },
    { name: 'Engineering', visits: 128 },
    { name: 'Mathematics', visits: 98 },
    { name: 'Chemistry', visits: 87 },
    { name: 'Physics', visits: 76 },
    { name: 'Literature', visits: 65 },
    { name: 'Business', visits: 54 },
    { name: 'Art History', visits: 43 },
  ];

  const semesterCourseData = [
    { name: 'Computer Science', visits: 520 },
    { name: 'Engineering', visits: 445 },
    { name: 'Mathematics', visits: 398 },
    { name: 'Chemistry', visits: 365 },
    { name: 'Physics', visits: 298 },
    { name: 'Literature', visits: 245 },
    { name: 'Business', visits: 187 },
    { name: 'Art History', visits: 156 },
  ];

  // Individual student data for detailed rankings - removed hours field
  const monthlyStudentData = [
    { name: 'Alex Johnson', course: 'Computer Science', visits: 24, studentId: 'ST001' },
    { name: 'Maria Garcia', course: 'Engineering', visits: 22, studentId: 'ST002' },
    { name: 'David Wilson', course: 'Mathematics', visits: 20, studentId: 'ST003' },
    { name: 'Emma Davis', course: 'Chemistry', visits: 18, studentId: 'ST004' },
    { name: 'Michael Brown', course: 'Physics', visits: 16, studentId: 'ST005' },
    { name: 'Sophie Wilson', course: 'Computer Science', visits: 15, studentId: 'ST006' },
    { name: 'James Taylor', course: 'Engineering', visits: 14, studentId: 'ST007' },
    { name: 'Lisa Anderson', course: 'Literature', visits: 12, studentId: 'ST008' },
    { name: 'Chen Wei', course: 'Mathematics', visits: 11, studentId: 'ST009' },
    { name: 'Anna Rodriguez', course: 'Business', visits: 10, studentId: 'ST010' },
  ];

  const semesterStudentData = [
    { name: 'Alex Johnson', course: 'Computer Science', visits: 85, studentId: 'ST001' },
    { name: 'Maria Garcia', course: 'Engineering', visits: 78, studentId: 'ST002' },
    { name: 'David Wilson', course: 'Mathematics', visits: 72, studentId: 'ST003' },
    { name: 'Emma Davis', course: 'Chemistry', visits: 68, studentId: 'ST004' },
    { name: 'Michael Brown', course: 'Physics', visits: 65, studentId: 'ST005' },
    { name: 'Sophie Wilson', course: 'Computer Science', visits: 62, studentId: 'ST006' },
    { name: 'James Taylor', course: 'Engineering', visits: 58, studentId: 'ST007' },
    { name: 'Lisa Anderson', course: 'Literature', visits: 54, studentId: 'ST008' },
    { name: 'Chen Wei', course: 'Mathematics', visits: 51, studentId: 'ST009' },
    { name: 'Anna Rodriguez', course: 'Business', visits: 47, studentId: 'ST010' },
  ];

  const courseData = selectedPeriod === 'month' ? monthlyCourseData : semesterCourseData;
  const studentData = selectedPeriod === 'month' ? monthlyStudentData : semesterStudentData;

  const getCourseColor = (courseName: string) => {
    const colors = {
      'Computer Science': '#3b82f6',
      'Engineering': '#10b981',
      'Mathematics': '#f59e0b',
      'Chemistry': '#ef4444',
      'Physics': '#8b5cf6',
      'Literature': '#06b6d4',
      'Business': '#f97316',
      'Art History': '#ec4899',
    };
    return colors[courseName as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Top Visitors Analytics
          </h1>
          <p className="text-muted-foreground">Track most frequent library visitors and usage patterns by course and individual students.</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats - Removed Total Hours card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Top Course</span>
            </div>
            <p className="text-lg">{courseData[0]?.name}</p>
            <p className="text-xs text-muted-foreground">{courseData[0]?.visits} visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Top Student</span>
            </div>
            <p className="text-lg">{studentData[0]?.name}</p>
            <p className="text-xs text-muted-foreground">{studentData[0]?.visits} visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Avg Visits</span>
            </div>
            <p className="text-xl">{Math.round(studentData.reduce((sum, d) => sum + d.visits, 0) / studentData.length)}</p>
            <p className="text-xs text-muted-foreground">per student</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart - Now showing courses */}
      <Card>
        <CardHeader>
          <CardTitle>Visits by Course</CardTitle>
          <CardDescription>Number of library visits by academic course {selectedPeriod === 'month' ? 'this month' : 'this semester'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="visits" 
                  fill={(entry) => getCourseColor(entry?.name)}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Student Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Rankings - Individual Students</CardTitle>
          <CardDescription>Top visiting students with their course information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.map((student, index) => (
              <div key={student.studentId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">({student.studentId})</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <GraduationCap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{student.course}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{student.visits} visits</p>
                  <p className="text-muted-foreground">This {selectedPeriod}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Summary - Removed study time references */}
      <Card>
        <CardHeader>
          <CardTitle>Course Summary</CardTitle>
          <CardDescription>Library usage breakdown by academic departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {courseData.slice(0, 8).map((course, index) => (
              <div key={course.name} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{course.name}</span>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getCourseColor(course.name) }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>{course.visits} visits</p>
                  <p>Rank #{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}