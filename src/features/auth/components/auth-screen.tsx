"use client";

import { useState } from "react";
import { SignInFlow } from "../types/types";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");

    return (
        <div className="h-[100vh] flex bg-[#5c3b58] items-center justify-center">
            <div className="md:h-auto md:w-[450px]">
                {state === 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
            </div>
        </div>
    );
};

export default AuthScreen;