import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();

  const schema = yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
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
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        reset();
        router.replace("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="box">
      <h1 align="center">SignUp Form</h1>
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
            type="password"
            {...register("password")}
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <input type="submit" className="register-btn" value="Sign Up" />
      </form>
    </div>
  );
}

export default Index;
