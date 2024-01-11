import React, { Fragment, useState } from 'react';
import { useAuthContext } from '/context/AuthContext';
import { API } from '/components/Tools/constant';
import { setToken } from '/components/Tools/strapitoken';

const SignUp = () => {
    const { setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onFinish = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const values = Object.fromEntries(formData.entries());

        setIsLoading(true);
        try {
            const response = await fetch(`${API}/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            } else {
                setToken(data.jwt);
                setUser(data.user);
                alert(`Welcome to Social Cards ${data.user.username}!`);
            }
        } catch (error) {
            console.error(error);
            setError(error?.message ?? 'Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>SignUp</h2>
                {error && (
                    <div style={{ color: 'red' }}>
                        {error}
                        <button onClick={() => setError('')}>X</button>
                    </div>
                )}
                <form onSubmit={onFinish}>
                    <div>
                        <label>Username</label>
                        <input name="username" required placeholder="Username" />
                    </div>
                    <div>
                        <label>Email</label>
                        <input name="email" required type="email" placeholder="Email address" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input name="password" required type="password" placeholder="Password" />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading}>
                            Submit {isLoading && 'Loading...'}
                        </button>
                    </div>
                </form>
                <p>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </Fragment>
    );
};

export default SignUp;
