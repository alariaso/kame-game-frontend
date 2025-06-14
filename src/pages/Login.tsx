import { Navigate, useLocation, useNavigate } from "react-router";
import { useUser } from "@/context/UserContext"
import { useState, type FormEvent } from "react";

export const Login: React.FC = () => {
    const { user, loading, login } = useUser();
    const [username, setUsername] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit: React.EventHandler<FormEvent> = async (event) => {
        event.preventDefault()
        await login({ username, password: "" })
        await navigate(location.state?.prevLocation || "/")
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (user !== null) {
        return <Navigate to={location.state?.prevLocation || "/"} />
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="border-1" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </form>
    )
}
