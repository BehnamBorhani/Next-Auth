import React, { useEffect } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import swal from "sweetalert";

function Index() {
  const router = useRouter();
  const schema = yup.object({
    identifier: yup.string().required(),
    password: yup.string().required(),
  });

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 200) {
        router.replace("/");
      }
    });
  }, []);

  const signIn = async (data) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      reset();
      swal({
        title: "Logged In Successfully :))",
        icon: "success",
        buttons: "ok",
        timer: 2000,
      });
      router.replace("/");
    } else if (res.status === 404) {
      alert("User Not Found :))");
    } else if (res.status === 422) {
      alert("username or password is not correct :((");
    } else if (res.status === 500) {
      alert("...");
    }
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form role="form" method="post" onSubmit={handleSubmit(signIn)}>
        <div className="inputBox">
          <input
            type="text"
            {...register("identifier")}
            autoComplete="off"
            required
          />
          <label>Username | Email</label>
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

        <input type="submit" className="register-btn" value="Sign In" />
      </form>
    </div>
  );
}

export default Index;
