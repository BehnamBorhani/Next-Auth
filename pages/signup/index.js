import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import swal from "sweetalert";

function Index() {
  const router = useRouter();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const schema = yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string().required(),
    password: yup.string().required(),
  });

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const signUp = (data) => {
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 201) {
        setIsCodeSent(true);
        reset({ phone: getValues("phone") });
        return res.json();
      }
    });
  };

  const verifyCode = async (event) => {
    event.preventDefault();

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: getValues("phone"), code }),
    });

    if (res.status === 409) {
      swal({
        title: "Code is not correct !!",
        icon: "error",
        buttons: "Try Again",
      });
    } else if (res.status === 410) {
      swal({
        title: "Code is expired !!",
        icon: "error",
        buttons: "Try Another Time",
      });
    } else if (res.status === 201) {
      swal({
        title: "Code is correct :))",
        icon: "success",
        buttons: "Go to dashboard",
      }).then(() => {
        router.replace("/todos");
      });
    }
  };

  return (
    <div className="box">
      <h1 align="center">SignUp Form</h1>
      {isCodeSent ? (
        <form role="form" method="post">
          <div className="inputBox">
            <input
              type="text"
              autoComplete="off"
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <label>Code</label>
          </div>
          <input
            type="submit"
            className="register-btn"
            value="Verify Code"
            onClick={verifyCode}
          />
        </form>
      ) : (
        <form role="form" method="post" onSubmit={handleSubmit(signUp)}>
          <div className="inputBox">
            <input
              type="text"
              {...register("firstname")}
              autoComplete="off"
              required
            />
            <label>Firstname</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              {...register("lastname")}
              autoComplete="off"
              required
            />
            <label>Lastname</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              {...register("username")}
              autoComplete="off"
              required
            />
            <label>Username</label>
          </div>
          <div className="inputBox">
            <input
              type="email"
              {...register("email")}
              autoComplete="off"
              required
            />
            <label>Email</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              {...register("phone")}
              autoComplete="off"
              required
            />
            <label>Phone Number</label>
          </div>
          <div className="inputBox">
            <input
              type="password"
              {...register("password")}
              autoComplete="off"
              required
            />
            <label>Password</label>
          </div>

          <input type="submit" className="register-btn" value="Sign Up" />
        </form>
      )}
    </div>
  );
}

export default Index;
