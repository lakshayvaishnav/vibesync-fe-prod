"use client";

import { SignInFlow } from "@/types/auth-types";
import { useState } from "react";
import SignInCard from "./sign-in-card";
import SignupPage from "./sing-up-card";

export default function AuthScreen({ authType }: { authType?: SignInFlow }) {
  const [formType, setFormType] = useState<SignInFlow>(authType || "/signIn");
  return (
    <>
      {formType == "/signIn" ? (
        <SignInCard setFormType={setFormType} />
      ) : (
        <SignupPage setFormType={setFormType} />
      )}
    </>
  );
}
