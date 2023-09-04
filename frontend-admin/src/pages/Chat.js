/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../data/api";
import openSocket from "socket.io-client";

function Chat({ role }) {
  const [rooms, setRooms] = useState(null);
  const [messages, setMessages] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const chatContainerRef = useRef();

  // get rooms
  const getRooms = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/rooms`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getRooms: ", data);
      if (data.expired)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else {
        setRooms(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getRooms();
  }, []);

  // get messages
  const getMessages = async (id) => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/messages/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getMessages: ", data);
      if (data.expired)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // put new message
  const putMessage = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/message`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ roomId, newMsg }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // console.log("putMessage: ", data);
      if (data.expired)
        setErrorMsg((prev) => ({ ...prev, errorMsg: data.errorMg }));
      else {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    putMessage();
    setNewMsg("");
  };

  // update messages with socket.io
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = openSocket(SERVER_URL);
    socketRef.current.on("clientMsg", (data) => {
      if (data.action === "update" && data.roomId === roomId) {
        setMessages(data.messages);
      } else if (data.action === "create") {
        setRooms(data.roomIds);
      } else if (data.action === "delete") {
        setRooms((prev) => prev.filter((r) => r !== data.roomId));
        setMessages([]);
      }
    });
    return () => socketRef.current.disconnect();
  }, [roomId]);

  // scroll to new message
  useEffect(() => {
    if (messages && messages.length > 0 && chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastChild;
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (role !== "admin" && role !== "consultant") {
    return <h1 className="text-center my-5">Unauthorized!</h1>;
  }
  if (errorMsg.errorMsg) {
    return <h1 className="text-center my-5">{errorMsg.errorMsg}</h1>;
  }

  return (
    <>
      <h4 className="text-dark fw-bold">Chat</h4>
      <h6>Apps / Chat</h6>

      {rooms ? (
        <div
          className="row bg-white shadow rounded mx-0 mt-4 chat"
          style={{ height: "82vh" }}
        >
          {/* list of room chat */}
          <div className="col-3 border-end px-0" style={{ overflowY: "auto" }}>
            <div className="border-bottom p-3">
              <input
                type="text"
                placeholder="Search Contact"
                className="border rounded w-100 p-2"
              />
            </div>
            {rooms &&
              rooms.length > 0 &&
              rooms.map((room) => (
                <div
                  className="row justify-content-between align-items-center border-bottom text-break py-3 px-2 mx-0 chat--room"
                  style={{ columnGap: "0.8rem" }}
                  key={room}
                >
                  <div className="col-sm-2 col-0 chat--room-img">
                    <img
                      src={require("../data/consultant-1.jpg")}
                      alt="consultant"
                      className="rounded-circle"
                    />
                  </div>
                  <div
                    className="col-sm-9 col-12 cursor-pointer chat--room-name"
                    onClick={() => {
                      getMessages(room);
                      setRoomId(room);
                    }}
                  >
                    {room}
                  </div>
                </div>
              ))}
          </div>

          {/* content of room chat */}
          <div className="col-9 px-0">
            <div
              className="border-bottom py-4"
              style={{ height: "74vh", overflowY: "auto" }}
              ref={chatContainerRef}
            >
              {messages &&
                messages.length > 0 &&
                messages.map((msg) =>
                  msg.role === "client" ? (
                    // client's messages
                    <div className="row text-break mx-0" key={msg._id}>
                      <div className="col-lg-1 col-sm-2 col-3 text-center">
                        <img
                          src={require("../data/consultant-1.jpg")}
                          alt="consultant"
                          className="rounded-circle"
                        />
                      </div>
                      <div className="col-lg-9 col-sm-8 col-7 d-flex px-0">
                        <p className="bg-info-subtle rounded p-2">
                          Client: {msg.msg}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // admin's messages
                    <div className="row justify-content-end mx-0" key={msg._id}>
                      <div className="col-10 d-flex justify-content-end pe-3">
                        <p className="bg-light text-secondary rounded p-2">
                          {msg.msg}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>

            <form
              className="d-flex justify-content-between align-items-center p-3"
              style={{ height: "8vh" }}
              onSubmit={handleSubmit}
            >
              <div style={{ flex: 0.95 }}>
                <input
                  type="text"
                  placeholder="Type and enter"
                  className="border-0 outline-0 w-100"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
              </div>
              <button type="submit" className="btn border-0 p-0">
                <i className="fa fa-paper-plane text-white bg-primary rounded-circle p-2"></i>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="spinner"></div>
      )}
    </>
  );
}

export default Chat;
