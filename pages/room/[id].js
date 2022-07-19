import Script from "next/script";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Room() {
  const router = useRouter();
  const { id } = router.query;
  const [visible, setvisible] = useState(true);

  const showandhidehandler = () => {
    let newvisiblestatus = !visible;
    setvisible(newvisiblestatus);
  };

  return (
    <>
      <Script
        src="https://unpkg.com/peerjs@1.4.5/dist/peerjs.min.js"
        onLoad={async () => {
          const peer = new Peer(`room-${id}-first`);

          const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          document.querySelector("video#local").srcObject = localStream;
          peer.on("call", (call) => {
            call.answer(localStream);

            call.on("stream", (remoteStream) => {
              document.querySelector("video#remote").srcObject = remoteStream;
            });
          });
        }}
      />

      <h1
        className="mt-20 text-center text-3xl uppercase 
					font-black"
      >
        Room
      </h1>

      <p className="mt-20 mb-20 text-center text-3xl font-black">
        Share this link to join the room: <br />
        <a href={`/room/${id}/join`} className="underline">
          https://videoconf-drab.vercel.app:3000/room/{id}/join
        </a>
      </p>

      <button
        className="mt-20 text-center text-3xl uppercase 
					font-black"
        onClick={showandhidehandler}
      >
        set visibility
      </button>

      <div className="flex">
        {visible && <video id="local" autoPlay playsInline muted></video>}
        <video id="remote" autoPlay playsInline></video>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //we need this or the router query data is not available client-side
  // see https://nextjs.org/docs/api-reference/next/router#router-object
  return {
    props: {},
  };
}
