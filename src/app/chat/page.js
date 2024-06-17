"use client";

import React, { useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { gql, useMutation, useSubscription } from "@apollo/client";

import { Suspense } from "react";

const MESSAGE_RECEIVED = gql`
  subscription messages($roomId: String) {
    messageReceived(roomId: $roomId) {
      user {
        username
        email
      }
      text
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String!, $message: String!, $user: UserInput) {
    sendMessage(roomId: $roomId, message: $message, user: $user) {
      text
    }
  }
`;

function Chat() {
  const listRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const newMessageSubscription = useSubscription(MESSAGE_RECEIVED, {
    variables: {
      roomId: String(roomId),
    },
    shouldResubscribe: true,
    fetchPolicy: "no-cache",
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [haveLogin, setHaveLogin] = useState(null);

  const { data: newMessageData, error } = newMessageSubscription;

  const checkIfHaveLogin = () => {
    const data = localStorage.getItem("user");

    if (!data) {
      router.replace("/");
      return;
    }

    setHaveLogin(JSON.parse(data));
  };

  useEffect(() => {
    checkIfHaveLogin();
  }, []);

  useEffect(() => {
    listRef.current.scrollTo(0, listRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    if (newMessageData?.messageReceived) {
      console.log("newMessageData: ", [
        newMessageData.messageReceived.user,
        haveLogin,
        newMessageData.messageReceived.user.email === haveLogin.email,
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        newMessageData.messageReceived,
      ]);

      setTimeout(() => {
        listRef.current.scrollTo(0, listRef.current.scrollHeight, {});
      }, 150);
    }
  }, [newMessageData]);

  const submitMessage = () => {
    sendMessage({
      variables: {
        roomId: String(roomId),
        message: message,
        user: {
          username: haveLogin.nickname,
          email: haveLogin.email,
        },
      },
    });

    setMessage("");
  };

  return (
    <div className="overscroll-none">
      <h1 className="text-3xl font-bold mb-4 ">{`Chat na sala ${roomId}`}</h1>

      <div className=" absolute top-20 bottom-14 left-2 right-2 flex flex-col overflow-y-hidden">
        <div ref={listRef} className="overflow-y-auto">
          {messages.map(({ text, user }, index) => {
            return (
              <div
                key={index}
                className={`flex ${
                  user.email === haveLogin.email
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`w-32 p-4 mb-2  rounded-md ${
                    user.email === haveLogin.email
                      ? "bg-blue-700"
                      : "bg-gray-700"
                  }
                  
                  ${
                    user.email === haveLogin.email ? "text-right" : "text-left"
                  }`}
                >
                  <p className="font-bold">{user.username}</p>
                  <p>{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div className="flex">
          <div className=" flex-1 h-10 mr-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-700 h-10 rounded-md text-lg border-blue-700 border-solid border w-full"
            />
          </div>
          <div className="w-24 h-10">
            <button
              onClick={submitMessage}
              className="flex-none rounded-md bg-blue-700 h-10 w-full grow-0 text-lg border-blue-700 border-solid border  "
            >
              Enviar
            </button>
          </div>
          {/* <div className="flex-4">
            <input className="bg-gray-700 h-10 text-lg border-blue-700 border-solid border " />
          </div>

          */}
        </div>
      </div>
    </div>
  );
}

export default Chat;
