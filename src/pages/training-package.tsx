import { useState, useEffect } from "react"
import api from "../services/api"
import Sidebar from "../components/dashboard/Sidebar"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table"
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
} from "../components/ui/alert-dialog"
import { parse } from "path"

export interface TrainingPackage {
  id: number;
  name: string;
  description: string;
  price: number;
}

const TrainingPackage = () => {
  const [packages, setPackages] = useState<TrainingPackage[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<TrainingPackage>>({
    name: '',
    description: '',
    price: 0,
  });
  const [editPackage, setEditPackage] = useState<Partial<TrainingPackage>>({
    id: 0,
    name: '',
    description: '',
    price: 0,
  });
  const [packageToDelete, setPackageToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchPackages().then(setPackages)
  }, [])

  const fetchPackages = async () => {
    const response = await api.get<TrainingPackage[]>(`/membership/api/trainingpackages/`)
    return response.data
  }

  const handleAdd = async () => {
    try {
      const response = await api.post<TrainingPackage>(`/membership/api/trainingpackages/`, newPackage);
      setPackages([...packages, response.data]); // Add the new package to the list
      setNewPackage({ // Reset the form
        name: "",
        description: "",
        price: 0,
      });
      setIsAddDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add package:", error);
      alert("Failed to add package");
    }
  };

  const handleEditClick = (trainingPackage: TrainingPackage) => {
    setEditPackage(trainingPackage);
    setIsEditDialogOpen(true);
  }

  const handleEdit = async () => {
    try {
      const response = await api.put<TrainingPackage>(`/membership/api/trainingpackages/${editPackage.id}/`, editPackage);
      setPackages(packages.map(p => p.id === editPackage.id ? response.data : p)); // Update the package in the list
      setEditPackage({ // Reset the form
        id: 0,
        name: "",
        description: "",
        price: 0,
      });
      setIsEditDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to edit package:", error);
      alert("Failed to edit package");
    }
  }

  const handleDeleteClick = (id: number) => {
    setPackageToDelete(id);
  }

  const handleConfirmDelete = async () => {
    if (packageToDelete) {
      await api.delete(`/membership/api/trainingpackages/${packageToDelete}/`);
      setPackages(packages.filter(p => p.id !== packageToDelete)); // Remove the package from the list
      setPackageToDelete(null); // Close the dialog
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Package Management</CardTitle>
              <CardDescription>Manage your gym's packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AlertDialog open={isAddDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Training Package</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Training Package</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Input
                          placeholder="Name"
                          value={newPackage.name || ''}
                          onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                        />
                        <Label>Description</Label>
                        <Input
                          placeholder="Description"
                          value={newPackage.description || ''}
                          onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        />
                        <Label>Price</Label>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={newPackage.price.toString() || ''}
                          onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleAdd}>
                        Add Package
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isEditDialogOpen}>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Package</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Input
                          placeholder="Name"
                          value={editPackage.name || ''}
                          onChange={(e) => setEditPackage({ ...editPackage, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleEdit}>
                        Edit Package
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
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={packageToDelete === item.id}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)}>
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the package.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setPackageToDelete(null)}>
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

export default TrainingPackage;