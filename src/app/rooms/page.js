"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Modal from "./components/modal";

function Rooms() {
  const router = useRouter();
  const [haveLogin, setHaveLogin] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [lastRoom, setLastRoom] = useState(null);

  const [nickname, setname] = useState("");
  const [email, setemail] = useState("");

  const checkIfHaveLogin = () => {
    const data = localStorage.getItem("user");

    if (!data) {
      return;
    }

    setHaveLogin(data);
  };

  const navigate = (roomId) => {
    if (haveLogin) {
      router.push(`/chat?roomId=${roomId}`);
      return;
    }

    setLastRoom(roomId);

    setShowModal(true);
  };

  const submitSignup = () => {
    localStorage.setItem("user", JSON.stringify({ nickname, email }));

    if (!nickname || !email) {
      alert("Você precisa preencher os campos corretamente");
      return;
    }
    setShowModal(false);
    setHaveLogin({ nickname, email });
    router.push(`/chat?roomId=${lastRoom}`);

    console.log("submit: ", [lastRoom, showModal, nickname, email]);
  };

  useEffect(() => {
    checkIfHaveLogin();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 ">Rooms</h1>

      <Modal
        title={"Cadastre-se"}
        open={showModal}
        setShowModal={setShowModal}
        onSubmit={submitSignup}
      >
        <div className="flex-row">
          <input
            className="bg-gray-700 text-white w-full h-10 rounded-md mb-2 px-4 "
            placeholder="Digite seu nome"
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
          <input
            className="bg-gray-700 text-white w-full h-10 rounded-md mb-2 px-4 "
            placeholder="Digite seu email"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
        </div>
      </Modal>

      {Array(10)
        .fill(0)
        .map((_, index) => {
          return (
            <a
              onClick={() => {
                navigate(index);
              }}
              key={index}
            >
              <div className="p-4 mb-2 bg-blue-700 rounded-md">
                <p>Room {index}</p>
              </div>
            </a>
          );
        })}
    </div>
  );
}

export default Rooms;
