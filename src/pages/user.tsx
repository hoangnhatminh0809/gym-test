import { useState, useEffect } from "react";
import api from "../services/api";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
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

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
}

const User = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({
        email: '',
        first_name: '',
        last_name: '',
        username: '',
    });
    const [editUser, setEditUser] = useState<Partial<User>>({
        id: 0,
        email: '',
        first_name: '',
        last_name: '',
        username: '',
    });
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);

    const fetchUsers = async () => {
        const response = await api.get<User[]>('/user/api/users/');
        return response.data;
    };

    const handleAdd = async () => {
        try {
            const response = await api.post<User>('/user/api/users/', newUser);
            setUsers([...users, response.data]); // Add the new user to the list
            setNewUser({ // Reset the form
                email: '',
                first_name: '',
                last_name: '',
                username: '',
            });
            setIsAddDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error("Failed to add user:", error);
            alert("Failed to add user");
        }
    };

    const handleEditClick = (user: User) => {
        setEditUser(user);
        setIsEditDialogOpen(true);
    };

    const handleEdit = async () => {
        try {
            const response = await api.put<User>(`/user/api/users/${editUser.id}/`, editUser);
            setUsers(users.map(u => u.id === editUser.id ? response.data : u)); // Update the user in the list
            setEditUser({ // Reset the form
                id: 0,
                email: '',
                first_name: '',
                last_name: '',
                username: '',
            });
            setIsEditDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error("Failed to edit user:", error);
            alert("Failed to edit user");
        }
    };

    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            await api.delete(`/user/api/users/${userToDelete}/`);
            setUsers(users.filter(u => u.id !== userToDelete)); // Remove the user from the list
            setUserToDelete(null); // Close the dialog
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User management</CardTitle>
                            <CardDescription>Manage your gym's user</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                {/* <AlertDialog open={isAddDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button onClick={() => setIsAddDialogOpen(true)}>Add User</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="sm:max-w-[425px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Add New User</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 items-center gap-4">
                                                <Label>Email</Label>
                                                <Input
                                                    placeholder="Email"
                                                    value={newUser.email || ''}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                />
                                                <Label>First Name</Label>
                                                <Input
                                                    placeholder="First Name"
                                                    value={newUser.first_name || ''}
                                                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                                />
                                                <Label>Last Name</Label>
                                                <Input
                                                    placeholder="Last Name"
                                                    value={newUser.last_name || ''}
                                                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={handleAdd}>
                                                Add User
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog> */}

                                <AlertDialog open={isEditDialogOpen}>
                                    <AlertDialogContent className="sm:max-w-[425px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Edit User Information</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 items-center gap-4">
                                                <Label>Email</Label>
                                                <Input
                                                    placeholder="Name"
                                                    value={editUser.email || ''}
                                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                                />
                                                <Label>First Name</Label>
                                                <Input
                                                    placeholder="First Name"
                                                    value={editUser.first_name || ''}
                                                    onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                                                />
                                                <Label>Last Name</Label>
                                                <Input
                                                    placeholder="Last Name"
                                                    value={editUser.last_name || ''}
                                                    onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                                                />
                                                <Label>Username</Label>
                                                <Input
                                                    placeholder="Username"
                                                    value={editUser.username || ''}
                                                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={handleEdit}>
                                                Edit User
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>First Name</TableHead>
                                        <TableHead>Last Name</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.first_name}</TableCell>
                                            <TableCell>{item.last_name}</TableCell>
                                            <TableCell>{item.username}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                                                        <FilePenIcon className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog open={userToDelete === item.id}>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)}>
                                                                <Trash2Icon className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the user.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setUserToDelete(null)}>
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
        </div>)
}

const FilePenIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
)

const Trash2Icon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
)


export default User;