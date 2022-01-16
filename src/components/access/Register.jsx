import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify";

export const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    user_email: "",
    user_password: "",
    user_name: ""
  });

  const { user_email, user_password, user_name } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { user_email, user_password, user_name };
      const response = await fetch(
        "/auth/jwt/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        localStorage.setItem("userId",parseRes.user_id)

        setAuth(true);
        toast.success("Register Successfully");
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
          <Form.Group controlId="user_name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                value={user_name}
                onChange={e => onChange(e)}
                placeholder="Your Name"
              />
            </Form.Group>
            <br />
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

            <Button type="submit" variant="success">Sign Up</Button>
          </Form>
        </Container>
      </div>
    </>
  );
};