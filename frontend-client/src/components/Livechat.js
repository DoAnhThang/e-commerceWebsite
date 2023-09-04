/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../data/api";
import openSocket from "socket.io-client";

function Livechat() {
  const roomId = localStorage.getItem("roomId") || "";
  const [messages, setMessages] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const chatContainerRef = useRef();

  const showLivechat = useSelector((state) => state.ui.livechatIsVisible);

  // get messages
  const getMessages = async (id) => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/messages/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getMessages: ", data);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (showLivechat) {
      if (roomId) getMessages(roomId);
    }
  }, []);

  // put new message
  const putMessage = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/message`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ roomId, newMsg }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // console.log("putMessage: ", data);
      if (data.roomId) {
        localStorage.setItem("roomId", data.roomId);
      }
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // delete chat session
  const deleteChatSession = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/messages/${roomId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      // console.log("deleteChatSession: ", data);
      if (data.isSuccess) {
        setMessages([]);
        localStorage.removeItem("roomId");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMsg === "/end") {
      deleteChatSession();
    } else {
      putMessage();
    }
    setNewMsg("");
  };

  // update messages with socket.io
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = openSocket(SERVER_URL);
    socketRef.current.on("adminMsg", (data) => {
      if (data.action === "update" && data.roomId === roomId) {
        setMessages(data.messages);
      }
    });
    return () => socketRef.current.disconnect();
  }, [roomId]);

  // scroll to new message
  useEffect(() => {
    if (messages && messages.length > 0 && chatContainerRef.current.lastChild) {
      const lastMessage = chatContainerRef.current.lastChild;
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {ReactDOM.createPortal(
        <Container
          className="position-fixed rounded-4 shadow-lg bg-white animation-zoom-400 px-0 livechat"
          style={{
            right: "5px",
            bottom: "6.5rem",
            width: "28rem",
            zIndex: 300,
          }}
        >
          {/* title of livechat window */}
          <Row className="border-bottom p-2 mx-0">
            <Col className="d-flex justify-content-between align-items-center">
              <h5 className="fst-normal fw-bold mb-0">Customer Support</h5>
              <button className="btn btn-light btn-sm rounded-0">
                Let's Chat App
              </button>
            </Col>
          </Row>

          {/* content of livechat window */}
          <Container
            className="fs-8 ps-4 pe-3 pt-3"
            style={{ height: "25rem", overflowY: "auto" }}
            ref={chatContainerRef}
          >
            {messages &&
              messages.map((msg) =>
                msg.role === "client" ? (
                  // client's messages
                  <div className="row justify-content-end" key={msg._id}>
                    <div className="col-10 d-flex justify-content-end">
                      <p className="bg-primary text-white rounded p-2">
                        {msg.msg}
                      </p>
                    </div>
                  </div>
                ) : (
                  // admin's messages
                  <div className="row gap-3" key={msg._id}>
                    <div className="col-1 px-0">
                      <img
                        src={require("../data/consultant-1.jpg")}
                        alt="consultant"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="col-9 d-flex px-0">
                      <p className="bg-light text-secondary rounded p-2">
                        Tư vấn viên: {msg.msg}
                      </p>
                    </div>
                  </div>
                )
              )}
          </Container>

          {/* toolbar of livechat window */}
          <form
            className="d-flex align-items-center bg-light border-top gap-3 py-2 ps-3 pe-4"
            style={{ borderRadius: "0 0 1rem 1rem" }}
            onSubmit={handleSubmit}
          >
            <img
              src={require("../data/consultant-1.jpg")}
              alt="consultant"
              className="rounded-circle"
            />
            <input
              type="text"
              placeholder="Enter Message!"
              className="w-75 fst-normal border-0 outline-0 rounded ps-2"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button type="submit" className="btn border-0 px-1">
              <i className="fa fa-paper-plane text-primary"></i>
            </button>
          </form>
        </Container>,
        document.getElementById("livechat-root")
      )}
    </>
  );
}

export default Livechat;
