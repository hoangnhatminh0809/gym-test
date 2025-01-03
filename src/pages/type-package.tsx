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

export interface TypePackage {
    id: number;
    name: string;
    duration: string;
    rate: number;
}

const TypePackage = () => {
    const [types, setTypes] = useState<TypePackage[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newType, setNewType] = useState<Partial<TypePackage>>({
        duration: '',
        rate: 0,
    });
    const [editType, setEditType] = useState<Partial<TypePackage>>({
        id: 0,
        duration: '',
        rate: 0,
    });
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchTypes().then(setTypes);
    }, []);

    const fetchTypes = async () => {
        const response = await api.get<TypePackage[]>(`/membership/api/typepackages/`);
        return response.data;
    };

    const handleAdd = async () => {
        try {
            const response = await api.post<TypePackage>(`/membership/api/typepackages/`, newType);
            setTypes([...types, response.data]); // Add the new type to the list
            setNewType({ // Reset the form
                duration: '',
                rate: 0,
            });
            setIsAddDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error("Failed to add type package:", error);
            alert("Failed to add type package");
        }
    };

    const handleEditClick = (typePackage: TypePackage) => {
        setEditType(typePackage);
        setIsEditDialogOpen(true);
    };

    const handleEdit = async () => {
        try {
            const response = await api.put<TypePackage>(`/membership/api/typepackages/${editType.id}/`, editType);
            setTypes(types.map(t => t.id === editType.id ? response.data : t)); // Update the type in the list
            setEditType({ // Reset the form
                id: 0,
                duration: '',
                rate: 0,
            });
            setIsEditDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error("Failed to edit type package:", error);
            alert("Failed to edit type package");
        }
    };

    const handleDeleteClick = (id: number) => {
        setTypeToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (typeToDelete) {
            await api.delete(`/membership/api/typepackages/${typeToDelete}/`);
            setTypes(types.filter(t => t.id !== typeToDelete)); // Remove the type from the list
            setTypeToDelete(null); // Close the dialog
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
                            <CardTitle>Type Package Management</CardTitle>
                            <CardDescription>Manage your gym's type packages</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertDialog open={isAddDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button onClick={() => setIsAddDialogOpen(true)}>Add Type Package</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="sm:max-w-[425px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Add New Type Package</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 items-center gap-4">
                                                <Label>Name</Label>
                                                <Input
                                                    placeholder="Name"
                                                    value={newType.name || ''}
                                                    onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                                                />
                                                <Label>Duration</Label>
                                                <Input
                                                    placeholder="Duration"
                                                    value={newType.duration || ''}
                                                    onChange={(e) => setNewType({ ...newType, duration: e.target.value })}
                                                />
                                                <Label>Rate</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Rate"
                                                    value={newType.rate.toString() || ''}
                                                    onChange={(e) => setNewType({ ...newType, rate: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={handleAdd}>
                                                Add Type Package
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog open={isEditDialogOpen}>
                                    <AlertDialogContent className="sm:max-w-[425px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Edit Type Package</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-2 items-center gap-4">
                                                <Label>Name</Label>
                                                <Input
                                                    placeholder="Name"
                                                    value={editType.name || ''}
                                                    onChange={(e) => setEditType({ ...editType, name: e.target.value })}
                                                />
                                                <Label>Duration</Label>
                                                <Input
                                                    placeholder="Duration"
                                                    value={editType.duration || ''}
                                                    onChange={(e) => setEditType({ ...editType, duration: e.target.value })}
                                                />
                                                <Label>Rate</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Rate"
                                                    value={editType.rate.toString() || ''}
                                                    onChange={(e) => setEditType({ ...editType, rate: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={handleEdit}>
                                                Edit
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Rate</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {types.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell>{item.rate}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                                                        <FilePenIcon className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog open={typeToDelete === item.id}>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)}>
                                                                <Trash2Icon className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the type package.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setTypeToDelete(null)}>
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

export default TypePackage;