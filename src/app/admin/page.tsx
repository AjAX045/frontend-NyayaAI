"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Officer {
  id: number
  username: string
}

export default function AdminPage() {
  const router = useRouter()
  const [officers, setOfficers] = useState<Officer[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [station, setStation] = useState("")
  const [role, setRole] = useState("ROLE_POLICE") // default role

  const getToken = () => localStorage.getItem("token")

  // 🔐 Protect page
  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (storedRole !== "ROLE_ADMIN") {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      const res = await fetch(
        "http://localhost:8081/api/admin/officers",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setOfficers(data)

    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  const createOfficer = async () => {
    if (!username || !password || !station || !role) {
      alert("Please fill all fields")
      return
    }

    try {
      const res = await fetch(
        "http://localhost:8081/api/admin/officers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            username,
            password,
            policeStation: station,
            role
          })
        }
      )

      if (!res.ok) {
        alert("Failed to create officer")
        return
      }

      setUsername("")
      setPassword("")
      setStation("")
      setRole("ROLE_POLICE")
      fetchOfficers()

    } catch (err) {
      console.error("Create error:", err)
    }
  }

  const deleteOfficer = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to deactivate this officer?")
    if (!confirmDelete) return

    try {
      const res = await fetch(
        `http://localhost:8081/api/admin/officers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      )

      if (!res.ok) {
        alert("Failed to deactivate officer")
        return
      }

      fetchOfficers()

    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    router.push("/police/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </div>

      {/* Create Officer */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Officer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            placeholder="Police Station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          />

          {/* Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="ROLE_POLICE">Police</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>

          <button
            onClick={createOfficer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Officer
          </button>

        </CardContent>
      </Card>

      {/* Officers List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Officers</CardTitle>
        </CardHeader>
        <CardContent>
          {officers.length === 0 && (
            <p className="text-gray-500">No officers found</p>
          )}

          {officers.map((officer) => (
            <div
              key={officer.id}
              className="flex justify-between items-center border-b py-3"
            >
              <span className="font-medium">{officer.username}</span>

              {officer.username !== "admin" && (
                <button
                  onClick={() => deleteOfficer(officer.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
