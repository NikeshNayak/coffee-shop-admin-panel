import { json, redirect } from "react-router-dom";
import { APIRoutes, BASEURL } from "../configs/globalConfig";

export async function loginAction({ request }) {
  try {
    const data = await request.formData();
    const authData = {
      emailId: data.get("email"),
      password: data.get("password"),
    };

    const response = await fetch(`${BASEURL}${APIRoutes.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (response.status === 422 || response.status === 401) {
      return response;
    }

    if (!response.ok) {
      throw json({ message: "Could not authenticate user." }, { status: 500 });
    }

    const resData = await response.json();
    const token = resData.accessToken;

    localStorage.setItem("token", token);
    // const expiration = new Date();
    // expiration.setHours(expiration.getHours() + 1);
    // localStorage.setItem("expiration", expiration.toISOString());

    return redirect("/");
  } catch (err) {
    throw json({ message: "Server error." }, { status: 500 });
  }
}