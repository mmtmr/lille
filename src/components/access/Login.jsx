import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify";

export const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    user_email: "",
    user_password: "",
    remember_login: false
  });

  const { user_email, user_password, remember_login } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { user_email, user_password };
      const response = await fetch(
        "/auth/jwt/login",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const parseRes = await response.json();
      if (parseRes.jwtToken && parseRes.rtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        localStorage.setItem("user_id",parseRes.user_id)
        if(remember_login){
          localStorage.setItem("refreshToken", parseRes.rtToken);
        }
        setAuth(true);
        toast.success("Login Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="Login">
        <Container className="full-height">
          <Form onSubmit={onSubmitForm}>

            <Form.Group controlId="user_email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                value={user_email}
                onChange={e => onChange(e)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="user_password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="user_password"
                value={user_password}
                onChange={e => onChange(e)}
              />
            </Form.Group>
            <br />
            <Form.Check
              type="checkbox"
              name="remember_login"
              label="Keep me log in for 3 months"
              onChange={e => onChange(e)}
              />
              <br />
            <Button type="submit" variant="success">Login</Button>
          </Form>
          
        </Container>
      </div>
    </>
  );
};
