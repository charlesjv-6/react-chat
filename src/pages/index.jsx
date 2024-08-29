import LoginForm from "../layouts/login-form";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const load = () => {
    const user = sessionStorage.getItem('user'); 
    if (user) {
      navigate('/t/list');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main>
        <LoginForm />
    </main>
  );
}

export default Index;
