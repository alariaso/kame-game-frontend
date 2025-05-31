import { useNavigate } from "react-router";
import { useUser } from "../UserContext"
import { useState, type FormEvent } from "react";

export const Login: React.FC = () => {
    const { user, login } = useUser();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const handleSubmit: React.EventHandler<FormEvent> = (event) => {
        event.preventDefault()
        login({ username, isAdmin: false, yugiPesos: 10000 })
    }

    if (user !== null) {
        navigate("/")
        return <></>
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="border-1" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </form>
    )
}
