import React from 'react';
import { AttendanceLogs } from '../librarian/AttendanceLogs';

// Admin attendance logs uses the same component as librarian
// but could have additional analytics or export options
export function AdminAttendanceLogs() {
  return <AttendanceLogs />;
}