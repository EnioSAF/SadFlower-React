import React, { useState } from "react";
import { useAuthContext } from '/context/AuthContext';
import { API } from '/components/Tools/constant';
import { setToken } from '/components/Tools/strapitoken';

const SignIn = () => {
    const { setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        setIsLoading(true);
        try {
            const value = { identifier: email, password: password };
            const response = await fetch(`${API}/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(value),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            } else {
                setToken(data.jwt);
                setUser(data.user);
                alert(`Welcome back ${data.user.username}!`);
            }
        } catch (error) {
            console.error(error);
            setError(error?.message ?? "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h1>SignIn</h1>
                {error && (
                    <div className="alert alert-error">
                        {error}
                        <button onClick={() => setError("")}>X</button>
                    </div>
                )}
                <form onSubmit={onFinish}>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" required placeholder="Email address" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" required placeholder="Password" />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        Login {isLoading && "Loading..."}
                    </button>
                </form>
                <p>
                    New to Social Cards? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
