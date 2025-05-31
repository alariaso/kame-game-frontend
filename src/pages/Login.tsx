import { Navigate } from "react-router";
import { useUser } from "../UserContext"
import { useState, type FormEvent } from "react";

export const Login: React.FC = () => {
    const { user, login } = useUser();
    const [username, setUsername] = useState("");

    const handleSubmit: React.EventHandler<FormEvent> = async (event) => {
        event.preventDefault()
        await login({ username, password: "" })
    }

    if (user !== null) {
        return <Navigate to="/" />
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="border-1" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </form>
    )
}
