import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

interface Usage {
  id: number;
  time: string;
  membership: number;
  room: number;
}

interface Room {
  id: number;
  name: string;
}

interface Membership {
  id: number;
  user: number;
}

interface User {
  id: number;
  username: string;
}

const Usage = () => {
  const [usages, setUsages] = useState<Usage[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newUsage, setNewUsage] = useState<Partial<Usage>>({
    time: '',
    membership: 0,
    room: 0,
  });
  const [editUsage, setEditUsage] = useState<Partial<Usage>>({
    id: 0,
    time: '',
    membership: 0,
    room: 0,
  });
  const [usageToDelete, setUsageToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsages();
    fetchRooms();
    fetchMemberships();
    fetchUsers();
  }, []);

  const fetchUsages = async () => {
    try {
      const response = await api.get<Usage[]>("/membership/api/usages/");
      setUsages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get<Room[]>("/room/api/rooms/");
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await api.get<Membership[]>("/membership/api/memberships/");
      setMemberships(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>("/user/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<Usage>("/membership/api/usages/", newUsage);
      setUsages([...usages, response.data]);
      setNewUsage({
        time: '',
        membership: 0,
        room: 0,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add usage:", error);
    }
  };

  const handleEditClick = (usage: Usage) => {
    setEditUsage(usage);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    try {
      const response = await api.put<Usage>(`/membership/api/usages/${editUsage.id}/`, editUsage);
      setUsages(usages.map(u => u.id === editUsage.id ? response.data : u));
      setEditUsage({
        id: 0,
        time: '',
        membership: 0,
        room: 0,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to edit usage:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUsageToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (usageToDelete) {
      await api.delete(`/membership/api/usages/${usageToDelete}/`);
      setUsages(usages.filter((item) => item.id !== usageToDelete));
      setUsageToDelete(null);
    }
  };

  const getRoomName = (roomId: number) => {
    const room = rooms.find(room => room.id === roomId);
    return room ? room.name : 'Unknown';
  };

  const getUserName = (membershipId: number) => {
    const membership = memberships.find(membership => membership.id === membershipId);
    const user = users.find(user => user.id === membership?.user);
    return user ? user.username : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Management</CardTitle>
              <CardDescription>Manage gym room usage records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AlertDialog open={isAddDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Usage</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Usage</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Membership</Label>
                        <Select
                          value={newUsage.membership?.toString() || ''}
                          onValueChange={(value) => setNewUsage({ ...newUsage, membership: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Membership" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberships.map((membership) => (
                              <SelectItem key={membership.id} value={membership.id.toString()}>
                                {getUserName(membership.id)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Label>Room</Label>
                        <Select
                          value={newUsage.room?.toString() || ''}
                          onValueChange={(value) => setNewUsage({ ...newUsage, room: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Room" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Label>Time</Label>
                        <Input
                          type="datetime-local"
                          value={newUsage.time || ''}
                          onChange={(e) => setNewUsage({ ...newUsage, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleAdd}>
                        Add Usage
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isEditDialogOpen}>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Usage</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Membership</Label>
                        <Select
                          value={editUsage.membership?.toString() || ''}
                          onValueChange={(value) => setEditUsage({ ...editUsage, membership: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Membership" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberships.map((membership) => (
                              <SelectItem key={membership.id} value={membership.id.toString()}>
                                {getUserName(membership.id)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Label>Room</Label>
                        <Select
                          value={editUsage.room?.toString() || ''}
                          onValueChange={(value) => setEditUsage({ ...editUsage, room: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Room" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Label>Time</Label>
                        <Input
                          type="datetime-local"
                          value={editUsage.time || ''}
                          onChange={(e) => setEditUsage({ ...editUsage, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleEdit}>
                        Edit Usage
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usages.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>{getUserName(usage.membership)}</TableCell>
                      <TableCell>{getRoomName(usage.room)}</TableCell>
                      <TableCell>{new Date(usage.time).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(usage)}>
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={usageToDelete === usage.id}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(usage.id!)}>
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the usage record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setUsageToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FilePenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
  </svg>
);

const Trash2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export default Usage;