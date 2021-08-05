import React, { useState, useEffect, useReducer, useContext,useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/Auth-Context";
import Input from "../UI/input/Input";

const emailReducer = (state, action) => {
  if (action.type === "user_input") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "input_blur") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
// password reducer

const PasswordReducer = (state, action) => {
  if (action.type === "pass_input") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }

  if (action.type === "input_blur") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmal] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(PasswordReducer, {
    value: "",
    isValid: null,
  });


  const authctx = useContext(AuthContext);

  const emailInputRef =useRef();
  const passwordInputRef=useRef();

  useEffect(() => {
    console.log("effect running");
    return () => {
      console.log("effect cleanup");
    };
  }, []);
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

   const emailChangeHandler = (event) => {
    dispatchEmal({ type: "user_input", val: event.target.value });
    // setFormIsValid(
    //  event.target.value.includes('@') && passwordState.isValid
    //      );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: "pass_input", val: event.target.value });
    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    //       );
  };

  const validateEmailHandler = () => {
    dispatchEmal({ type: "input_blur" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "input_blur" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
      authctx.onLogin(emailState.value, passwordState.value);
    }else if(!emailIsValid){
       emailInputRef.current.focus();
    }else{
      passwordInputRef.current.focus();
    }
   
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input

        ref={emailInputRef}
          id="email"
          type="email"
          label="E-Mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler }
        />

<Input
          ref={passwordInputRef}
          id="password"
          type="password"
          label="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler }
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
