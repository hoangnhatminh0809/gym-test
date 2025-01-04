import { useState, useEffect } from "react"
import api from "../services/api"
import Sidebar from "../components/dashboard/Sidebar"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select"
import { Button } from "../components/ui/button"
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

export interface Membership {
  id: number;
  user: number;
  package: number;
  type: number;
  registration_time: string;
  expiration_time: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface TrainingPackage {
  id?: number;
  name: string;
  description: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

interface TypePackage {
  id?: number;
  name: string;
  duration: string;
  rate: number;
  created_at: Date;
  updated_at: Date;
}
// export interface TypePackage {
//   id: number;
//   name: string;
//   duration: string;
// }

const Member = () => {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [packages, setPackages] = useState<TrainingPackage[]>([])
  const [types, setTypes] = useState<TypePackage[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newMembership, setNewMembership] = useState<Membership>({
    id: 0,
    user: 0,
    package: 0,
    type: 0,
    registration_time: "",
    expiration_time: "",
  });
  const [editMembership, setEditMembership] = useState<Membership>({
    id: 0,
    user: 0,
    package: 0,
    type: 0,
    registration_time: "",
    expiration_time: "",
  });
  const [membershipToDelete, setMembershipToDelete] = useState<number | null>(null)

  const fetchMemberships = async () => {
    const response = await api.get<Membership[]>(`/membership/api/memberships/`)
    return response.data
  }

  const fetchTrainingPackages = async () => {
    const response = await api.get<TrainingPackage[]>(`/membership/api/trainingpackages/`)
    return response.data
  }

  const fetchTypes = async () => {
    const response = await api.get<TypePackage[]>(`/membership/api/typepackages/`)
    return response.data
  }

  const fetchUsers = async () => {
    const response = await api.get<User[]>(`/user/api/users/`)
    return response.data
  }

  useEffect(() => {
    fetchMemberships().then((data) => setMemberships(data))
    fetchTrainingPackages().then((data) => setPackages(data))
    fetchTypes().then((data) => setTypes(data))
    fetchUsers().then((data) => setUsers(data))
  }, [])

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertMembershipData = (membership) => {

    return {
      ...membership,
      package: membership.package.id,
      type: membership.type.id,
      registration_time: convertDateToDDMMYYYY(membership.registration_time),
      expiration_time: convertDateToDDMMYYYY(membership.expiration_time),
    };
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<Membership>(`/membership/api/memberships/`, newMembership);
      setMemberships([...memberships, response.data]); // Add the new membership to the list
      setNewMembership({ // Reset the form
        id: 0,
        user: 0,
        package: 0,
        type: 0,
        registration_time: '',
        expiration_time: '',
      });
      setIsAddDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add membership:", error);
    }
  };

  const handleEditClick = (membership: Membership) => {
    setEditMembership(membership);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    try {
      const response = await api.put<Membership>(`/membership/api/memberships/${editMembership.id}/`, editMembership);
      setMemberships(memberships.map(m => m.id === editMembership.id ? response.data : m)); // Update the membership in the list
      setEditMembership({ // Reset the form
        id: 0,
        user: 0,
        package: 0,
        type: 0,
        registration_time: '',
        expiration_time: '',
      });
      setIsEditDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to edit membership:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setMembershipToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (membershipToDelete) {
      await api.delete(`/membership/api/memberships/${membershipToDelete}/`);
      setMemberships(memberships.filter((item) => item.id !== membershipToDelete));
      setMembershipToDelete(null);
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(user => user.id === userId)
    return user ? user.username : 'Unknown'
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Members Management</CardTitle>
              <CardDescription>Manage members and their memberships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AlertDialog open={isAddDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Member</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Member</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Select
                          value={newMembership.user.toString()}
                          onValueChange={(value) => {
                          const selectedUser = users.find(u => u.id === parseInt(value));
                          setNewMembership({ ...newMembership, user: selectedUser?.id || 0 });
                          }}
                        >
                          <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                          </SelectTrigger>
                          <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>{user.username}</SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        <Label>Training Package</Label>
                        <Select
                          value={newMembership.package.toString()}
                          onValueChange={(value) => {
                            const selectedPackage = packages.find(p => p.id === parseInt(value));
                            setNewMembership({ ...newMembership, package: selectedPackage?.id || 0 });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Training Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packages.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Type Package</Label>
                        <Select
                          value={newMembership.type.toString()}
                          onValueChange={(value) => {
                            const selectedType = types.find(p => p.id === parseInt(value));
                            setNewMembership({ ...newMembership, type: selectedType?.id || 0 });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Registration Time</Label>
                        <Input
                          type="date"
                          placeholder="Registration Time"
                          value={newMembership.registration_time || ''}
                          onChange={(e) => setNewMembership({ ...newMembership, registration_time: e.target.value })}
                        />
                        <Label>Expired Time</Label>
                        <Input
                          type="date"
                          placeholder="Expired Time"
                          value={newMembership.expiration_time || ''}
                          onChange={(e) => setNewMembership({ ...newMembership, expiration_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleAdd}>
                        Add Member
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isEditDialogOpen}>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Member</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Select
                          value={editMembership.user.toString()}
                          onValueChange={(value) => {
                          const selectedUser = users.find(u => u.id === parseInt(value));
                          setEditMembership({ ...editMembership, user: selectedUser?.id || 0 });
                          }}
                        >
                          <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                          </SelectTrigger>
                          <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>{user.username}</SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        <Label>Training Package</Label>
                        <Select
                          value={editMembership.package.toString()}
                          onValueChange={(value) => {
                            const selectedPackage = packages.find(p => p.id === parseInt(value));
                            setEditMembership({ ...editMembership, package: parseInt(value) });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Training Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packages.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Type Package</Label>
                        <Select
                          value={editMembership.type.toString()}
                          onValueChange={(value) => {
                            const selectedType = types.find(p => p.id === parseInt(value));
                            setEditMembership({ ...editMembership, type: parseInt(value) });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Registration Time</Label>
                        <Input
                          type="date"
                          placeholder="Registration Time"
                          value={editMembership.registration_time || ''}
                          onChange={(e) => setEditMembership({ ...editMembership, registration_time: e.target.value })}
                        />
                        <Label>Expired Time</Label>
                        <Input
                          type="date"
                          placeholder="Expired Time"
                          value={editMembership.expiration_time || ''}
                          onChange={(e) => setEditMembership({ ...editMembership, expiration_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleEdit}>
                        Edit Member
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Training Package</TableHead>
                    <TableHead>Type Package</TableHead>
                    <TableHead>Registration Time</TableHead>
                    <TableHead>Expired Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((membership) => (
                    <TableRow key={membership.id}>
                      <TableCell>{getUserName(membership.user)}</TableCell>
                      <TableCell>
                        {packages.find(p => p.id === membership.package)?.name || 'Unknown Package'}
                      </TableCell>
                      {/* <TableCell>{membership.type}</TableCell> */}
                      <TableCell>
                        {types.find(p => p.id === membership.type)?.name || 'Unknown Type'}
                      </TableCell>
                      <TableCell>{convertDateToDDMMYYYY(membership.registration_time)}</TableCell>
                      <TableCell>{convertDateToDDMMYYYY(membership.expiration_time)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(membership)} ><FilePenIcon className="h-4 w-4" /></Button>
                          <AlertDialog open={membershipToDelete === membership.id}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(membership.id)}>
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the equipment.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setMembershipToDelete(null)}>
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
  )
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

export default Member