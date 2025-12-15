"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getMemberOverdue, MemberOverdue } from "@/services/member";

export default function MemberOverdueManagement() {
  const [members, setMembers] = useState<MemberOverdue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await getMemberOverdue(1, 20);
      setMembers(res.data.data);
    };
    load();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl flex items-center gap-2">
          <Users className="h-6 w-6" />
          Overdue Members
        </h1>
        <p className="text-muted-foreground">
          Danh sách thành viên có sách trả trễ hoặc chưa trả
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Thành viên ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 text-sm">Thành viên</th>
                  <th className="p-4 text-sm">Email</th>
                  <th className="p-4 text-sm">Đã mượn</th>
                  <th className="p-4 text-sm">Trả trễ</th>
                  <th className="p-4 text-sm">Chưa trả (trễ)</th>
                  <th className="p-4 text-sm">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.userId} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{m.fullName}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {m.email}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{m.borrowCount}</Badge>
                    </td>
                    <td className="p-4">
                      {m.lateReturnsCount > 0 ? (
                        <Badge variant="secondary">{m.lateReturnsCount}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">0</span>
                      )}
                    </td>
                    <td className="p-4">
                      {m.lateNotReturnedCount > 0 ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {m.lateNotReturnedCount}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">0</span>
                      )}
                    </td>
                    <td className="p-4">
                      {m.isActive ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          Inactive
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            Không có thành viên phù hợp
          </CardContent>
        </Card>
      )}
    </div>
  );
}
