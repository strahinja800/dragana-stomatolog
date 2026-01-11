'use client';

import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { MoreHorizontal } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Svi korisnici</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Korisnik</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Uloga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum registracije</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nema registrovanih korisnika.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    'group transition-colors',
                    'animate-auth-fade-in'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {user.image && <AvatarImage src={user.image} />}
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className={cn(
                        user.role === 'admin' &&
                          'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Korisnik'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.banned ? 'destructive' : 'outline'}
                      className={cn(
                        !user.banned &&
                          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      )}
                    >
                      {user.banned ? 'Banovan' : 'Aktivan'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), 'd. MMM yyyy.', {
                      locale: sr,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Pogledaj detalje</DropdownMenuItem>
                        <DropdownMenuItem>Promeni ulogu</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {user.banned ? 'Ukloni ban' : 'Banuj korisnika'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
