"use client";

import React, { useEffect, useRef, useState } from "react";

function Chat() {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current.scrollTo(0, listRef.current.scrollHeight);
  }, []);

  return (
    <div className="overscroll-none">
      <h1 className="text-3xl font-bold mb-4 ">Chat</h1>

      <div className=" absolute top-20 bottom-14 left-2 right-2 flex flex-col overflow-y-hidden">
        <div ref={listRef} className="overflow-y-auto">
          {Array(20)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-32 p-4 mb-2  rounded-md ${
                      index % 2 === 0 ? "bg-blue-700" : "bg-gray-700"
                    }`}
                  >
                    <p>Chat {index}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2">
        <div className="flex">
          <div className=" flex-1 h-10 mr-2">
            <input className="bg-gray-700 h-10 rounded-md text-lg border-blue-700 border-solid border w-full" />
          </div>
          <div className="w-24 h-10">
            <button className="flex-none rounded-md bg-blue-700 h-10 w-full grow-0 text-lg border-blue-700 border-solid border  ">
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
