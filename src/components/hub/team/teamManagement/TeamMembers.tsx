"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TeamMember } from "../types";

interface TeamMembersProps {
  members: TeamMember[];
  onEdit?: (member: TeamMember) => void;
  onRemove?: (member: TeamMember) => void;
}

export function TeamMembers({ members, onEdit, onRemove }: TeamMembersProps) {
  return (
    <div className="space-y-8">
      {members.map((member) => (
        <div key={member.memberId} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          <div className="ml-auto font-medium flex flex-col items-end gap-1">
            <Badge
              variant={member.status === "active" ? "default" : "secondary"}
            >
              {member.role.name}
            </Badge>

          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(member)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onRemove(member)}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
